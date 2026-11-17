"use client";

import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Coordinates the invitation gate and the main experience.
 *
 *  "gate"     → the cinematic invitation cover is showing (server default)
 *  "opening"  → the guest pressed the seal; the curtain transition is running
 *  "open"     → main site is interactive
 */
type Phase = "gate" | "opening" | "open";

interface ExperienceState {
  phase: Phase;
  /** True once the main site may run its entrance animations. */
  revealed: boolean;
  beginOpening: () => void;
  finishOpening: () => void;
  skipToSite: () => void;
  /** Brings the invitation cover back (the S&F logo). */
  returnToGate: () => void;
}

const ExperienceContext = createContext<ExperienceState | null>(null);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("gate");

  // The cover shows on every visit. Only ?open=1 (testing/previews) skips it,
  // jumping to a section if the link names one (?open=1#rsvp).
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("open") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only state after hydration
      setPhase("open");
      if (url.hash.length > 1) {
        requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView());
      }
      return;
    }
    // A refresh after tapping a section link (#rsvp) still starts at the cover, with the page at the top behind it.
    history.scrollRestoration = "manual";
    if (url.hash) history.replaceState(null, "", url.pathname + url.search);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Lock page scroll while the cover is visible.
  useEffect(() => {
    const root = document.documentElement;
    if (phase === "open") {
      root.style.removeProperty("overflow");
      return;
    }
    root.style.overflow = "hidden";
    return () => {
      root.style.removeProperty("overflow");
    };
  }, [phase]);

  const beginOpening = useCallback(() => setPhase((p) => (p === "gate" ? "opening" : p)), []);
  const finishOpening = useCallback(() => setPhase("open"), []);
  const skipToSite = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setPhase("open");
  }, []);

  const returnToGate = useCallback(() => {
    // The head script in layout.tsx hides the cover for ?open=1 links; undo that.
    document.documentElement.removeAttribute("data-opened");
    if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: "instant" });
    setPhase("gate");
  }, []);

  const value = useMemo<ExperienceState>(
    () => ({ phase, revealed: phase !== "gate", beginOpening, finishOpening, skipToSite, returnToGate }),
    [phase, beginOpening, finishOpening, skipToSite, returnToGate],
  );

  return (
    <MotionConfig reducedMotion="user">
      <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>
    </MotionConfig>
  );
}

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return ctx;
}

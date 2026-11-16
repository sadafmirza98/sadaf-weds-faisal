"use client";

import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { safeStorage } from "@/lib/utils";

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
}

const ExperienceContext = createContext<ExperienceState | null>(null);
const OPENED_KEY = "wedding:opened";

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("gate");

  // Returning guests (same tab session), deep links (#rsvp) and ?open=1 skip the cover.
  useEffect(() => {
    const url = new URL(window.location.href);
    const deepLinked = url.hash.length > 1 || url.searchParams.get("open") === "1";
    if (deepLinked || safeStorage.get("session", OPENED_KEY) === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only state after hydration
      setPhase("open");
      if (url.hash.length > 1) {
        requestAnimationFrame(() => document.getElementById(url.hash.slice(1))?.scrollIntoView());
      }
    }
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
  const finishOpening = useCallback(() => {
    safeStorage.set("session", OPENED_KEY, "1");
    setPhase("open");
  }, []);
  const skipToSite = useCallback(() => {
    safeStorage.set("session", OPENED_KEY, "1");
    window.scrollTo({ top: 0 });
    setPhase("open");
  }, []);

  const value = useMemo<ExperienceState>(
    () => ({ phase, revealed: phase !== "gate", beginOpening, finishOpening, skipToSite }),
    [phase, beginOpening, finishOpening, skipToSite],
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

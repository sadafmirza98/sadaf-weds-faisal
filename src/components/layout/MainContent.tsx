"use client";

import { useExperience } from "@/components/layout/ExperienceProvider";

/** Keeps the page inert (unfocusable, hidden from AT) while the invitation cover is open. */
export function MainContent({ children }: { children: React.ReactNode }) {
  const { phase } = useExperience();
  const locked = phase !== "open";
  return (
    <main id="main" inert={locked} aria-hidden={locked || undefined} className="relative z-[1]">
      {children}
    </main>
  );
}

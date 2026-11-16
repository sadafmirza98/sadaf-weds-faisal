"use client";

import { useEffect, useState } from "react";
import { timeLeftUntil, type TimeLeft } from "@/lib/time";

/**
 * Ticks once per second, aligned to the wall-clock second.
 * Returns null until mounted so server and client markup match.
 */
export function useCountdown(targetMs: number): TimeLeft | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let timeout = 0;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t < targetMs) timeout = window.setTimeout(tick, 1000 - (t % 1000) + 5);
    };
    tick();
    // Re-sync when returning to a backgrounded tab (timers are throttled there).
    const onVisible = () => {
      if (!document.hidden) {
        window.clearTimeout(timeout);
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [targetMs]);

  return now === null ? null : timeLeftUntil(targetMs, now);
}

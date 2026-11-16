"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Burst {
  id: number;
  petals: Array<{ x: number; y: number; r: number; s: number; d: number }>;
}

/**
 * Easter egg: a small sakura blossom that scatters petals when clicked.
 * Every click spawns a short-lived burst (removed after it finishes).
 */
export function SakuraBurst({ className, size = 44, label = "A sakura blossom" }: { className?: string; size?: number; label?: string }) {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [clicks, setClicks] = useState(0);
  const reduce = useReducedMotion();
  const gradId = `sb-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const idRef = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const burst = useCallback(() => {
    setClicks((c) => c + 1);
    if (reduce) return;
    const id = ++idRef.current;
    const petals = Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const dist = 60 + Math.random() * 90;
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 20,
        r: Math.random() * 540 - 270,
        s: 0.6 + Math.random() * 0.7,
        d: Math.random() * 0.12,
      };
    });
    setBursts((b) => [...b, { id, petals }]);
    timers.current.push(window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1800));
  }, [reduce]);

  return (
    <button
      type="button"
      onClick={burst}
      aria-label={`${label} — click to scatter petals`}
      className={cn("group relative inline-grid place-items-center rounded-full", className)}
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox="-12 -12 24 24"
        className="h-full w-full drop-shadow-[0_0_12px_rgba(184,69,90,0.45)]"
        animate={{ rotate: clicks * 72 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#8E5A66" />
            <stop offset="1" stopColor="#F4E2E0" />
          </linearGradient>
        </defs>
        {[0, 72, 144, 216, 288].map((r) => (
          <path key={r} transform={`rotate(${r})`} fill={`url(#${gradId})`} d="M0 0C6 -2 6 -8.6 2 -10L0 -8.4L-2 -10C-6 -8.6 -6 -2 0 0Z" />
        ))}
        <circle r="2.2" fill="#741D35" />
        <circle r="0.9" fill="#D5B98A" />
      </motion.svg>
      <AnimatePresence>
        {bursts.map((b) =>
          b.petals.map((p, i) => (
            <motion.span
              key={`${b.id}-${i}`}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-2.5 rounded-[60%_60%_50%_50%/80%_80%_30%_30%] bg-gradient-to-t from-[#8E5A66] to-[#F1DCDA]"
              initial={{ x: "-50%", y: "-50%", opacity: 1, rotate: 0, scale: p.s }}
              animate={{ x: `calc(-50% + ${p.x}px)`, y: [`-50%`, `calc(-50% + ${p.y}px)`, `calc(-50% + ${p.y + 60}px)`], opacity: [1, 1, 0], rotate: p.r }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, delay: p.d, ease: [0.22, 1, 0.36, 1] }}
            />
          )),
        )}
      </AnimatePresence>
    </button>
  );
}

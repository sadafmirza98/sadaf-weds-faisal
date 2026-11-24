"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A classic "&": the thread runs up the diagonal from the bottom right, round
 * the top loop, down into the bowl and up the right arm; then the crossbar is
 * stitched across last.
 */
const AMPERSAND =
  "M82 94 C 70 84, 54 66, 46 52 C 38 38, 37 22, 46 15 C 54 9, 64 14, 62 24 C 60 34, 46 42, 34 50 C 22 58, 17 72, 22 83 C 28 95, 48 97, 60 88 C 68 82, 74 72, 77 63 M 70 62 L 88 62";

const EASE = [0.65, 0, 0.35, 1] as const;

/**
 * The "&" between the couple's names, written by the red thread of fate and
 * left glowing softly. Screen readers get a plain "&".
 */
export function ThreadAmpersand({ className, delay = 0, idPrefix = "amp" }: { className?: string; delay?: number; idPrefix?: string }) {
  const reduce = useReducedMotion();
  const id = (s: string) => `${idPrefix}-${s}`;

  // Every layer draws together, so the glow follows the thread as it writes.
  const draw = {
    initial: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { duration: 2, delay, ease: EASE }, opacity: { duration: 0.15, delay } },
  };

  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">&amp;</span>
      <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" className="size-full overflow-visible">
        <defs>
          <linearGradient id={id("thread")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E25A74" />
            <stop offset="0.55" stopColor="#D64560" />
            <stop offset="1" stopColor="#B8253F" />
          </linearGradient>
          <filter id={id("glow")} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <g strokeLinecap="round" strokeLinejoin="round">
          {/* soft red glow around the thread */}
          <motion.path d={AMPERSAND} stroke="#E25A74" strokeWidth={9} strokeOpacity={0.55} filter={`url(#${id("glow")})`} {...draw} />
          {/* the thread */}
          <motion.path d={AMPERSAND} stroke={`url(#${id("thread")})`} strokeWidth={3.8} {...draw} />
          {/* a fine sheen along it, so it reads as silk */}
          <motion.path d={AMPERSAND} stroke="#FFD3DC" strokeWidth={1} strokeOpacity={0.55} {...draw} />
        </g>

        {/* once written, the glow breathes gently */}
        {!reduce && (
          <motion.path
            d={AMPERSAND}
            stroke="#F0A7B4"
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${id("glow")})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            transition={{ duration: 3.2, delay: delay + 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </svg>
    </span>
  );
}

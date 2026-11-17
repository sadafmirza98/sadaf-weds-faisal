"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** One loop: strands draw, the bow ties, it holds, fades, then starts again. */
const CYCLE = 7.5;
const HOLD_UNTIL = 6.2;
const FADED_BY = 6.9;
const EASE = [0.65, 0, 0.35, 1] as const;

/**
 * Keyframes for one stroke that starts drawing at `start` and takes `draw`
 * seconds. pathLength resets only while the stroke is invisible, so no stray
 * dot shows between loops.
 */
function loop(start: number, draw: number) {
  const times = [0, start, start + draw, HOLD_UNTIL, FADED_BY, CYCLE].map((t) => t / CYCLE);
  return {
    variants: {
      idle: { pathLength: 0, opacity: 0 },
      shown: { pathLength: 1, opacity: 1 },
      loop: {
        pathLength: [0, 0, 1, 1, 1, 0],
        opacity: [0, 0, 1, 1, 0, 0],
        transition: { duration: CYCLE, times, ease: EASE, repeat: Infinity },
      },
    },
  };
}

/**
 * The red thread of fate: two strands that meet and tie in a small bow.
 * Loops continuously while on screen; with reduced motion it is simply shown.
 * Decorative.
 */
export function RedThread({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  // Reduced motion: the finished bow, no loop.
  const state = reduce ? "shown" : inView ? "loop" : "idle";

  return (
    <svg ref={ref} aria-hidden="true" viewBox="0 0 240 72" fill="none" className={cn("overflow-visible", className)}>
      <defs>
        <linearGradient id="thread-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B8253F" stopOpacity="0" />
          <stop offset="0.35" stopColor="#C8344E" />
          <stop offset="1" stopColor="#D64560" />
        </linearGradient>
        <linearGradient id="thread-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#B8253F" stopOpacity="0" />
          <stop offset="0.35" stopColor="#C8344E" />
          <stop offset="1" stopColor="#D64560" />
        </linearGradient>
      </defs>
      <motion.g
        initial="idle"
        animate={state}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 4px rgb(214 69 96 / 0.55))" }}
      >
        {/* the two strands, one from each family */}
        <motion.path d="M2 30 C 40 14, 70 50, 120 34" stroke="url(#thread-l)" strokeWidth="1.6" {...loop(0, 1.4)} />
        <motion.path d="M238 30 C 200 14, 170 50, 120 34" stroke="url(#thread-r)" strokeWidth="1.6" {...loop(0, 1.4)} />
        {/* the bow */}
        <motion.path d="M120 34 C 106 14, 88 18, 94 30 C 99 40, 111 40, 120 34" stroke="#D64560" strokeWidth="1.6" {...loop(1.3, 0.7)} />
        <motion.path d="M120 34 C 134 14, 152 18, 146 30 C 141 40, 129 40, 120 34" stroke="#D64560" strokeWidth="1.6" {...loop(1.3, 0.7)} />
        <motion.path d="M120 34 C 116 44, 111 54, 104 64" stroke="#C8344E" strokeWidth="1.4" {...loop(1.9, 0.6)} />
        <motion.path d="M120 34 C 125 44, 131 53, 139 61" stroke="#C8344E" strokeWidth="1.4" {...loop(1.9, 0.6)} />
        {/* the knot */}
        <motion.circle
          cx="120"
          cy="34"
          r="2.6"
          fill="#E8C98F"
          stroke="none"
          style={{ transformOrigin: "120px 34px" }}
          variants={{
            idle: { scale: 0, opacity: 0 },
            shown: { scale: 1, opacity: 1 },
            loop: {
              scale: [0, 0, 1, 1, 1, 0],
              opacity: [0, 0, 1, 1, 0, 0],
              transition: { duration: CYCLE, times: [0, 2, 2.5, HOLD_UNTIL, FADED_BY, CYCLE].map((t) => t / CYCLE), ease: EASE, repeat: Infinity },
            },
          }}
        />
      </motion.g>
    </svg>
  );
}

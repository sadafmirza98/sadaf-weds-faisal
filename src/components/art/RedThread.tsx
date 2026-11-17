"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/** One loop (seconds): strands meet, the knot ties, loops and tails fall out, it holds, fades, repeats. */
const CYCLE = 4.6;
const HOLD_UNTIL = 3.9;
const FADED_BY = 4.3;
const EASE = [0.65, 0, 0.35, 1] as const;

const timesFor = (start: number, draw: number) => [0, start, start + draw, HOLD_UNTIL, FADED_BY, CYCLE].map((t) => t / CYCLE);

/**
 * Keyframes for one stroke that starts drawing at `start` and takes `draw`
 * seconds. pathLength resets only while the stroke is invisible, so no stray
 * dot shows between loops.
 */
function stroke(start: number, draw: number) {
  return {
    variants: {
      idle: { pathLength: 0, opacity: 0 },
      shown: { pathLength: 1, opacity: 1 },
      loop: {
        pathLength: [0, 0, 1, 1, 1, 0],
        opacity: [0, 0, 1, 1, 0, 0],
        transition: { duration: CYCLE, times: timesFor(start, draw), ease: EASE, repeat: Infinity },
      },
    },
  };
}

/** The knot pulls tight: pops in slightly oversized, then settles. */
const knot = {
  idle: { scale: 0, opacity: 0 },
  shown: { scale: 1, opacity: 1 },
  loop: {
    scale: [0, 0, 1.25, 1, 1, 1, 0],
    opacity: [0, 0, 1, 1, 1, 0, 0],
    transition: {
      duration: CYCLE,
      times: [0, 0.6, 0.78, 0.9, HOLD_UNTIL, FADED_BY, CYCLE].map((t) => t / CYCLE),
      ease: "easeOut" as const,
      repeat: Infinity,
    },
  },
};

const RED = "#C8344E";
const RED_LIGHT = "#D64560";
const RED_DARK = "#8E1F35";

/**
 * The red thread of fate: a strand from each family meets in a knot and is
 * tied into a bow. Loops continuously while on screen; with reduced motion it
 * is simply shown. Decorative.
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
          <stop offset="0.35" stopColor={RED} />
          <stop offset="1" stopColor={RED_LIGHT} />
        </linearGradient>
        <linearGradient id="thread-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#B8253F" stopOpacity="0" />
          <stop offset="0.35" stopColor={RED} />
          <stop offset="1" stopColor={RED_LIGHT} />
        </linearGradient>
      </defs>
      <motion.g
        initial="idle"
        animate={state}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: "drop-shadow(0 0 4px rgb(214 69 96 / 0.55))" }}
      >
        {/* a strand from each family, running into the knot */}
        <motion.path d="M2 30 C 40 14, 72 48, 115 35" stroke="url(#thread-l)" strokeWidth="1.7" {...stroke(0, 0.65)} />
        <motion.path d="M238 30 C 200 14, 168 48, 125 35" stroke="url(#thread-r)" strokeWidth="1.7" {...stroke(0, 0.65)} />

        {/* the bow's loops, pulled out of either side of the knot */}
        <motion.path d="M116 32.5 C 104 15, 85 16, 88 30 C 90.5 41, 105 40.5, 116 36.5" stroke={RED_LIGHT} strokeWidth="1.8" {...stroke(0.8, 0.4)} />
        <motion.path d="M124 32.5 C 136 15, 155 16, 152 30 C 149.5 41, 135 40.5, 124 36.5" stroke={RED_LIGHT} strokeWidth="1.8" {...stroke(0.8, 0.4)} />

        {/* the tails */}
        <motion.path d="M117.5 37 C 114 45, 109 53, 101 61 C 99.5 62.5, 98 63, 96.5 62.5" stroke={RED} strokeWidth="1.5" {...stroke(1.05, 0.4)} />
        <motion.path d="M122.5 37 C 126 45, 131 52, 139 59 C 140.5 60.4, 142 60.8, 143.5 60.3" stroke={RED} strokeWidth="1.5" {...stroke(1.05, 0.4)} />

        {/* the knot — drawn last so it sits over the strand ends */}
        <motion.g variants={knot} style={{ transformOrigin: "120px 34.5px" }}>
          <rect x="114.6" y="30" width="10.8" height="9" rx="3.6" fill={RED} stroke={RED_DARK} strokeWidth="0.8" />
          {/* the wrap: two turns of thread across the knot */}
          <path d="M116.4 32.4 C 118.5 33.6, 121.5 33.6, 123.6 32.4" stroke={RED_DARK} strokeWidth="0.7" />
          <path d="M116.4 36.4 C 118.5 37.6, 121.5 37.6, 123.6 36.4" stroke={RED_DARK} strokeWidth="0.7" />
          <path d="M117.2 31.3 C 119 30.7, 121 30.7, 122.8 31.3" stroke="#F0A7B4" strokeOpacity="0.7" strokeWidth="0.6" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

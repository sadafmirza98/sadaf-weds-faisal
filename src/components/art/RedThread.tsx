"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.65, 0, 0.35, 1] as const;

/**
 * The red thread of fate: two strands that meet and tie in a small bow.
 * Draws itself when scrolled into view. Decorative.
 */
export function RedThread({ className }: { className?: string }) {
  const draw = (delay: number, duration = 1.4) => ({
    initial: { pathLength: 0, opacity: 0 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, amount: 0.6 },
    transition: { pathLength: { duration, delay, ease: EASE }, opacity: { duration: 0.2, delay } },
  });

  return (
    <svg aria-hidden="true" viewBox="0 0 240 72" fill="none" className={cn("overflow-visible", className)}>
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
      <g strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px rgb(214 69 96 / 0.55))" }}>
        {/* the two strands, one from each family */}
        <motion.path d="M2 30 C 40 14, 70 50, 120 34" stroke="url(#thread-l)" strokeWidth="1.6" {...draw(0)} />
        <motion.path d="M238 30 C 200 14, 170 50, 120 34" stroke="url(#thread-r)" strokeWidth="1.6" {...draw(0)} />
        {/* the bow */}
        <motion.path d="M120 34 C 106 14, 88 18, 94 30 C 99 40, 111 40, 120 34" stroke="#D64560" strokeWidth="1.6" {...draw(1.3, 0.7)} />
        <motion.path d="M120 34 C 134 14, 152 18, 146 30 C 141 40, 129 40, 120 34" stroke="#D64560" strokeWidth="1.6" {...draw(1.3, 0.7)} />
        <motion.path d="M120 34 C 116 44, 111 54, 104 64" stroke="#C8344E" strokeWidth="1.4" {...draw(1.9, 0.6)} />
        <motion.path d="M120 34 C 125 44, 131 53, 139 61" stroke="#C8344E" strokeWidth="1.4" {...draw(1.9, 0.6)} />
      </g>
      {/* the knot */}
      <motion.circle
        cx="120"
        cy="34"
        r="2.6"
        fill="#E8C98F"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 2, ease: EASE }}
        style={{ transformOrigin: "120px 34px" }}
      />
    </svg>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A twilight comet whose tail splits in two as it falls, drawn for the venue
 * map. It drifts slowly along its path; with reduced motion it holds still.
 * Decorative.
 */
export function Comet({ className, idPrefix = "comet" }: { className?: string; idPrefix?: string }) {
  const reduce = useReducedMotion();
  const id = (s: string) => `${idPrefix}-${s}`;

  return (
    <svg aria-hidden="true" viewBox="0 0 600 220" fill="none" className={cn("overflow-visible", className)}>
      <defs>
        <linearGradient id={id("core")} gradientUnits="userSpaceOnUse" x1="596" y1="6" x2="206" y2="142">
          <stop offset="0" stopColor="#F3E3C3" stopOpacity="0" />
          <stop offset="0.55" stopColor="#F0C9D0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFF8EC" />
        </linearGradient>
        <linearGradient id={id("glow")} gradientUnits="userSpaceOnUse" x1="596" y1="6" x2="206" y2="142">
          <stop offset="0" stopColor="#7C6FD6" stopOpacity="0" />
          <stop offset="0.6" stopColor="#9C7FD8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#E8A0B4" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={id("shard")} gradientUnits="userSpaceOnUse" x1="420" y1="70" x2="236" y2="176">
          <stop offset="0" stopColor="#E8A0B4" stopOpacity="0" />
          <stop offset="1" stopColor="#FFE6EC" stopOpacity="0.95" />
        </linearGradient>
        <filter id={id("blur")} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <radialGradient id={id("head")}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.35" stopColor="#FFF1DE" stopOpacity="0.9" />
          <stop offset="1" stopColor="#E8A0B4" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.g
        animate={reduce ? undefined : { x: [0, -14, 0], y: [0, 5, 0], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* soft violet-rose halo around the tail */}
        <path d="M596 4 L596 10 L210 154 Q192 160 196 136 Z" fill={`url(#${id("glow")})`} filter={`url(#${id("blur")})`} />
        {/* the main tail, tapering to nothing */}
        <path d="M596 6 L596 7.4 L207.6 145.6 Q200 147 202.4 138.4 Z" fill={`url(#${id("core")})`} />
        {/* the fragment breaking away beneath it */}
        <path d="M420 70 L420 71 L238.4 178.2 Q232 180 233.6 173.8 Z" fill={`url(#${id("shard")})`} />

        {/* heads */}
        <circle cx="203" cy="142" r="16" fill={`url(#${id("head")})`} />
        <circle cx="203" cy="142" r="2.6" fill="#FFFFFF" />
        <circle cx="235" cy="176.5" r="8" fill={`url(#${id("head")})`} opacity="0.85" />
        <circle cx="235" cy="176.5" r="1.4" fill="#FFFFFF" />
      </motion.g>
    </svg>
  );
}

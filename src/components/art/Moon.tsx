"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Four-point sparkle centred on 0,0 with radius 1 (scaled with a transform). */
const SPARKLE = "M0 -1C0.12 -0.3 0.3 -0.12 1 0C0.3 0.12 0.12 0.3 0 1C-0.12 0.3 -0.3 0.12 -1 0C-0.3 -0.12 -0.12 -0.3 0 -1Z";

/**
 * A slender pearl-and-champagne crescent with a twinkling star — inline SVG so
 * the glow and star can animate with CSS. A warm glow hugs it, and a soft band
 * of light sweeps across it every few seconds. Purely decorative; interactive
 * wrappers add their own semantics.
 */
export function Moon({ className, glow = true, idPrefix = "moon" }: { className?: string; glow?: boolean; idPrefix?: string }) {
  const g = (s: string) => `${idPrefix}-${s}`;
  const reduce = useReducedMotion();
  return (
    <div className={cn("relative aspect-square", className)} aria-hidden="true">
      {glow && (
        <div
          className="absolute -inset-[30%] animate-breathe rounded-full"
          style={{
            background:
              "radial-gradient(circle closest-side at 50% 50%, rgb(243 227 195 / 0.16) 0%, rgb(213 185 138 / 0.07) 40%, rgb(213 185 138 / 0.025) 70%, transparent 100%)",
          }}
        />
      )}
      <svg viewBox="0 0 200 200" className="relative h-full w-full overflow-visible">
        <defs>
          <linearGradient id={g("body")} x1="0.15" y1="0.85" x2="0.85" y2="0.15">
            <stop offset="0" stopColor="#C99A5B" />
            <stop offset="0.35" stopColor="#EBCF9C" />
            <stop offset="0.7" stopColor="#FBEFD8" />
            <stop offset="1" stopColor="#FFF8EC" />
          </linearGradient>
          <radialGradient id={g("sheen")} cx="0.3" cy="0.7" r="0.5">
            <stop offset="0" stopColor="#FFFDF7" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFFDF7" stopOpacity="0" />
          </radialGradient>
          <mask id={g("cut")}>
            <circle cx="100" cy="100" r="72" fill="#fff" />
            <circle cx="128" cy="80" r="62" fill="#000" />
          </mask>
          <filter id={g("halo")} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={g("glow")} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="11" />
          </filter>
          {/* a band of light that sweeps across the crescent now and then */}
          <linearGradient id={g("shimmer")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* warm glow, then a soft halo hugging the crescent */}
        <circle cx="100" cy="100" r="72" fill="#E9C98F" opacity="0.35" mask={`url(#${g("cut")})`} filter={`url(#${g("glow")})`} />
        <circle cx="100" cy="100" r="72" fill="#F3E3C3" opacity="0.5" mask={`url(#${g("cut")})`} filter={`url(#${g("halo")})`} />
        {/* the crescent */}
        <g mask={`url(#${g("cut")})`}>
          <circle cx="100" cy="100" r="72" fill={`url(#${g("body")})`} />
          <circle cx="100" cy="100" r="72" fill={`url(#${g("sheen")})`} />
          {!reduce && (
            <g transform="rotate(-35 100 100)">
              <motion.rect
                x="-60"
                y="-40"
                width="60"
                height="280"
                fill={`url(#${g("shimmer")})`}
                initial={{ x: 0 }}
                animate={{ x: [0, 300] }}
                transition={{ duration: 2.6, delay: 2.5, repeat: Infinity, repeatDelay: 6.5, ease: [0.45, 0, 0.25, 1] }}
              />
            </g>
          )}
          <circle cx="100" cy="100" r="71.3" fill="none" stroke="#FFF8EC" strokeOpacity="0.7" strokeWidth="1.2" />
        </g>

        {/* the star, nestled in the crescent */}
        <g className="animate-twinkle" style={{ transformOrigin: "142px 92px" }}>
          <path d={SPARKLE} transform="translate(142 92) scale(15)" fill="#FFF8EC" />
          <circle cx="142" cy="92" r="2.2" fill="#FFFFFF" />
        </g>
        <path d={SPARKLE} transform="translate(166 58) scale(6)" fill="#F3E3C3" opacity="0.8" />
      </svg>
    </div>
  );
}

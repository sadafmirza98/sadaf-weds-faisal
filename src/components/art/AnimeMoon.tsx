"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Four-point sparkle centred on 0,0 with radius 1 (scaled with a transform). */
const SPARKLE = "M0 -1C0.12 -0.3 0.3 -0.12 1 0C0.3 0.12 0.12 0.3 0 1C-0.12 0.3 -0.3 0.12 -1 0C-0.3 -0.12 -0.12 -0.3 0 -1Z";
/** A long, thin cross flare (anime lens star). */
const FLARE = "M0 -1C0.03 -0.12 0.12 -0.03 1 0C0.12 0.03 0.03 0.12 0 1C-0.03 0.12 -0.12 0.03 -1 0C-0.12 -0.03 -0.03 -0.12 0 -1Z";

/** Light specks drifting around the moon: [x, y, size, delay]. */
const SPECKS: [number, number, number, number][] = [
  [22, 40, 1.6, 0],
  [178, 30, 1.2, 1.1],
  [196, 150, 1.8, 2.3],
  [12, 150, 1.3, 0.6],
  [60, 196, 1.1, 1.8],
  [150, 186, 1.5, 3],
  [100, 8, 1.2, 2.6],
  [-14, 96, 1.4, 1.4],
];

/**
 * The cover's crescent, drawn in an anime night-sky style: the same crescent
 * as the site's moon, cel-shaded, wrapped in a dreamy bloom, with a lens-flare
 * star, cloud wisps drifting across and specks of light. Original artwork.
 * Purely decorative; interactive wrappers add their own semantics.
 */
export function AnimeMoon({ className, idPrefix = "amoon" }: { className?: string; idPrefix?: string }) {
  const reduce = useReducedMotion();
  const g = (s: string) => `${idPrefix}-${s}`;
  const url = (s: string) => `url(#${g(s)})`;

  return (
    <div className={cn("relative aspect-square", className)} aria-hidden="true">
      {/* the night air glowing around the moon: ivory at the heart, lavender and rose further out */}
      <div
        className="absolute -inset-[55%] animate-breathe rounded-full"
        style={{
          background:
            "radial-gradient(circle closest-side at 45% 55%, rgb(255 246 226 / 0.2) 0%, rgb(226 196 230 / 0.09) 32%, rgb(232 160 180 / 0.05) 55%, transparent 100%)",
        }}
      />

      <svg viewBox="0 0 200 200" className="relative h-full w-full overflow-visible">
        <defs>
          <mask id={g("cut")}>
            <circle cx="100" cy="100" r="72" fill="#fff" />
            <circle cx="128" cy="80" r="62" fill="#000" />
          </mask>
          {/* pearl body: near-white on the lit limb, warm champagne towards the tips */}
          <linearGradient id={g("body")} x1="0.1" y1="0.9" x2="0.8" y2="0.1">
            <stop offset="0" stopColor="#F2D9A8" />
            <stop offset="0.3" stopColor="#FFF1D6" />
            <stop offset="0.65" stopColor="#FFFBF2" />
            <stop offset="1" stopColor="#FFFFFF" />
          </linearGradient>
          <linearGradient id={g("cloud")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#C9B3E6" stopOpacity="0" />
            <stop offset="0.3" stopColor="#E7D3EE" stopOpacity="0.75" />
            <stop offset="0.7" stopColor="#F3D4DC" stopOpacity="0.7" />
            <stop offset="1" stopColor="#E8A0B4" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g("streak")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#FFF6E6" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={g("rim")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="0.45" stopColor="#FFF6EA" stopOpacity="0.8" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <filter id={g("b3")} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id={g("b9")} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
          <filter id={g("b20")} x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <filter id={g("cel")} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.2" />
          </filter>
        </defs>

        {/* bloom: three blurred copies of the crescent, from wide rose to tight ivory */}
        <g mask={url("cut")}>
          <circle cx="100" cy="100" r="72" fill="#E8A0B4" opacity="0.85" filter={url("b20")} />
        </g>
        <circle cx="100" cy="100" r="72" fill="#F6D9C0" opacity="0.8" mask={url("cut")} filter={url("b9")} />
        <circle cx="100" cy="100" r="72" fill="#FFF4E0" opacity="0.8" mask={url("cut")} filter={url("b3")} />

        {/* a faint horizontal light streak through the moon */}
        <rect x="-70" y="117" width="340" height="1.6" rx="0.8" fill={url("streak")} />

        {/* the crescent, cel-shaded */}
        <g mask={url("cut")}>
          <circle cx="100" cy="100" r="72" fill={url("body")} />
          {/* a soft shadow band along the inner edge */}
          <circle cx="128" cy="80" r="66" fill="none" stroke="#E9C89A" strokeWidth="9" opacity="0.55" filter={url("cel")} />
          {/* bright rim on the lit edge */}
          <circle cx="100" cy="100" r="70.6" fill="none" stroke="#FFFFFF" strokeWidth="2.4" opacity="0.9" />
          {/* glossy highlight */}
          <ellipse cx="58" cy="128" rx="9" ry="22" transform="rotate(35 58 128)" fill="#FFFFFF" opacity="0.55" filter={url("b3")} />
        </g>

        {/* glint on the limb */}
        <path d={SPARKLE} transform="translate(44 146) scale(7)" fill="#FFFFFF" opacity="0.9" />

        {/* the star nestled in the crescent, with a long anime lens flare */}
        <motion.g
          style={{ transformOrigin: "142px 92px", transformBox: "view-box" }}
          animate={reduce ? undefined : { opacity: [0.75, 1, 0.75], scale: [0.94, 1.06, 0.94], rotate: [0, 8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="142" cy="92" r="12" fill="#FFF6E6" opacity="0.45" filter={url("b3")} />
          <path d={FLARE} transform="translate(142 92) scale(34)" fill="#FFF8EC" opacity="0.85" />
          <path d={SPARKLE} transform="translate(142 92) scale(12)" fill="#FFFFFF" />
          <circle cx="142" cy="92" r="2.2" fill="#FFFFFF" />
        </motion.g>

        {/* cloud wisps drifting across the lower half */}
        <motion.g
          animate={reduce ? undefined : { x: [-10, 12, -10] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M-40 151 C -18 146, 6 148, 22 144 C 34 139, 48 141, 60 144 C 76 139, 96 137, 112 142 C 128 138, 150 140, 166 144 C 186 140, 210 143, 236 148 C 214 150, 196 149, 178 151 C 160 154, 140 151, 124 153 C 104 156, 86 151, 66 154 C 44 157, 24 153, 4 155 C -12 156, -28 154, -40 151 Z"
            fill={url("cloud")}
            stroke={url("cloud")}
            strokeWidth="0.8"
            opacity="0.5"
            filter={url("cel")}
          />
          {/* moonlight catching the top of the wisp */}
          <path d="M20 145 C 34 140, 48 141, 60 144 C 76 139, 96 137, 112 142 C 128 138, 150 140, 168 144" stroke={url("rim")} strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.8" />
        </motion.g>
        <motion.g
          animate={reduce ? undefined : { x: [14, -12, 14] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M14 173 C 30 168, 48 170, 62 166 C 78 162, 92 165, 104 168 C 120 162, 142 162, 158 166 C 176 162, 204 164, 244 169 C 220 172, 198 171, 180 173 C 160 176, 138 172, 118 175 C 98 178, 78 174, 58 176 C 40 178, 24 177, 14 173 Z"
            fill={url("cloud")}
            stroke={url("cloud")}
            strokeWidth="0.8"
            opacity="0.32"
            filter={url("cel")}
          />
        </motion.g>

        {/* specks of light */}
        {SPECKS.map(([x, y, r, delay], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="#FFF6E6"
            style={{ filter: "drop-shadow(0 0 2px rgb(255 240 220 / 0.9))" }}
            initial={{ opacity: reduce ? 0.7 : 0 }}
            animate={reduce ? undefined : { opacity: [0, 1, 0], y: [0, -6, -12] }}
            transition={{ duration: 3.6, delay, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
          />
        ))}
        <path d={SPARKLE} transform="translate(170 56) scale(5)" fill="#F3E3C3" opacity="0.85" />
      </svg>
    </div>
  );
}

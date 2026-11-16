import { cn } from "@/lib/utils";

/**
 * The crimson moon — inline SVG so its glow can breathe with CSS.
 * Purely decorative; interactive wrappers add their own semantics.
 */
export function CrimsonMoon({ className, glow = true, idPrefix = "moon" }: { className?: string; glow?: boolean; idPrefix?: string }) {
  const g = (s: string) => `${idPrefix}-${s}`;
  return (
    <div className={cn("relative aspect-square", className)} aria-hidden="true">
      {glow && (
        <div
          className="absolute -inset-[45%] animate-breathe rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgb(184 69 90 / 0.4) 0%, rgb(116 29 53 / 0.2) 32%, rgb(64 13 32 / 0.08) 55%, transparent 70%)",
          }}
        />
      )}
      <svg viewBox="0 0 200 200" className="relative h-full w-full">
        <defs>
          <radialGradient id={g("body")} cx="0.38" cy="0.34" r="0.75">
            <stop offset="0" stopColor="#E9A697" />
            <stop offset="0.22" stopColor="#C2546A" />
            <stop offset="0.6" stopColor="#7E2140" />
            <stop offset="1" stopColor="#3A0A18" />
          </radialGradient>
          <radialGradient id={g("shade")} cx="0.78" cy="0.82" r="0.85">
            <stop offset="0.35" stopColor="#090708" stopOpacity="0" />
            <stop offset="1" stopColor="#090708" stopOpacity="0.6" />
          </radialGradient>
          <filter id={g("soft")} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
          <clipPath id={g("clip")}>
            <circle cx="100" cy="100" r="96" />
          </clipPath>
        </defs>
        <circle cx="100" cy="100" r="96" fill={`url(#${g("body")})`} />
        {/* soft maria and craters */}
        <g clipPath={`url(#${g("clip")})`} fill="#4A0C1F" filter={`url(#${g("soft")})`}>
          <ellipse cx="122" cy="88" rx="34" ry="24" opacity="0.22" />
          <ellipse cx="80" cy="128" rx="28" ry="18" opacity="0.2" />
          <ellipse cx="138" cy="138" rx="16" ry="12" opacity="0.22" />
          <circle cx="66" cy="74" r="9" opacity="0.18" />
          <circle cx="104" cy="52" r="6" opacity="0.2" />
          <circle cx="156" cy="104" r="7" opacity="0.2" />
        </g>
        <circle cx="100" cy="100" r="96" fill={`url(#${g("shade")})`} />
        <circle cx="100" cy="100" r="95.5" fill="none" stroke="#F6D2C3" strokeOpacity="0.22" />
      </svg>
    </div>
  );
}

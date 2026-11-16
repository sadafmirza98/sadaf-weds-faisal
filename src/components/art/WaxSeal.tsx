import { cn } from "@/lib/utils";

/** Irregular wax blob outline, precomputed so SSR and client match. */
const BLOB = (() => {
  const pts: string[] = [];
  const n = 28;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 47 + Math.sin(i * 2.7) * 2.4 + Math.cos(i * 1.3) * 1.6;
    pts.push(`${(50 + Math.cos(a) * r).toFixed(2)} ${(50 + Math.sin(a) * r).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
})();

/**
 * Crimson wax seal with the couple's monogram. Decorative SVG; wrap it in a
 * button where it acts as a control.
 */
export function WaxSeal({
  monogram,
  className,
  idPrefix = "seal",
}: {
  monogram: [string, string];
  className?: string;
  idPrefix?: string;
}) {
  const g = (s: string) => `${idPrefix}-${s}`;
  return (
    <svg viewBox="0 0 100 100" className={cn("h-full w-full", className)} aria-hidden="true">
      <defs>
        <radialGradient id={g("wax")} cx="0.38" cy="0.32" r="0.8">
          <stop offset="0" stopColor="#B23A55" />
          <stop offset="0.45" stopColor="#741D35" />
          <stop offset="1" stopColor="#2E0713" />
        </radialGradient>
        <radialGradient id={g("press")} cx="0.6" cy="0.65" r="0.7">
          <stop offset="0" stopColor="#5C1029" />
          <stop offset="1" stopColor="#3A0A18" />
        </radialGradient>
        <linearGradient id={g("gold")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3E3C3" />
          <stop offset="0.5" stopColor="#D5B98A" />
          <stop offset="1" stopColor="#8F7148" />
        </linearGradient>
      </defs>
      <path d={BLOB} fill={`url(#${g("wax")})`} />
      <path d={BLOB} fill="none" stroke="#F1E7D9" strokeOpacity="0.12" />
      <circle cx="50" cy="50" r="34" fill={`url(#${g("press")})`} />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#1E040C" strokeOpacity="0.6" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="31" fill="none" stroke={`url(#${g("gold")})`} strokeWidth="0.6" strokeDasharray="1 2.2" />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontStyle="italic"
        fontSize="22"
        fill={`url(#${g("gold")})`}
      >
        {monogram[0]}
        <tspan fontSize="13" dx="1" dy="-1">
          &amp;
        </tspan>
        <tspan dx="1" dy="1">
          {monogram[1]}
        </tspan>
      </text>
      {/* sprig */}
      <path d="M36 70q14 6 28 0" fill="none" stroke={`url(#${g("gold")})`} strokeWidth="0.7" />
      <circle cx="50" cy="73" r="1.2" fill={`url(#${g("gold")})`} />
      <ellipse cx="36" cy="34" rx="10" ry="5" transform="rotate(-35 36 34)" fill="#F1E7D9" opacity="0.08" />
    </svg>
  );
}

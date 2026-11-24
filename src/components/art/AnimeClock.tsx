"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const NUMERALS = [
  "XII",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
];
const SPARKLE =
  "M0 -1C0.12 -0.3 0.3 -0.12 1 0C0.3 0.12 0.12 0.3 0 1C-0.12 0.3 -0.3 0.12 -1 0C-0.3 -0.12 -0.12 -0.3 0 -1Z";
/** One sakura petal with the notched tip, pointing up from 0,0 (radius 10). */
const PETAL = "M0 0C6.2 -2.2 6 -8.8 2 -10L0 -8.4L-2 -10C-6 -8.8 -6.2 -2.2 0 0Z";

/** Point on a circle, rounded so server and browser render identical numbers. */
const polar = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  const round = (n: number) => Math.round(n * 100) / 100;
  return [round(Math.cos(a) * r), round(Math.sin(a) * r)] as const;
};

function Blossom({
  x,
  y,
  r,
  rot = 0,
  id,
}: {
  x: number;
  y: number;
  r: number;
  rot?: number;
  id: (s: string) => string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r / 10})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={a}
          d={PETAL}
          transform={`rotate(${a})`}
          fill={`url(#${id("petal")})`}
          stroke="#5C1029"
          strokeOpacity="0.35"
          strokeWidth="0.5"
        />
      ))}
      <circle r="2.2" fill="#741D35" />
      {[0, 72, 144, 216, 288].map((a) => {
        const [cx, cy] = polar(a + 36, 3.6);
        return <circle key={a} cx={cx} cy={cy} r="0.7" fill="#D5B98A" />;
      })}
    </g>
  );
}

const HANDS: Record<
  "hour" | "minute" | "second",
  (url: (s: string) => string) => React.ReactNode
> = {
  hour: (url) => (
    <>
      <path
        d="M-3.2 12 L-2.4 -26 L0 -46 L2.4 -26 L3.2 12 Z"
        fill={url("gold")}
        stroke="#6B4A2A"
        strokeOpacity="0.5"
        strokeWidth="0.5"
      />
      <path
        d="M0 -40 L-3.4 -32 L0 -24 L3.4 -32 Z"
        fill="none"
        stroke="#FFF6E6"
        strokeWidth="0.8"
      />
    </>
  ),
  minute: (url) => (
    <>
      <path
        d="M-2.4 14 L-1.6 -46 L0 -72 L1.6 -46 L2.4 14 Z"
        fill={url("gold")}
        stroke="#6B4A2A"
        strokeOpacity="0.5"
        strokeWidth="0.5"
      />
      <path
        d="M0 -64 L-2.6 -57 L0 -50 L2.6 -57 Z"
        fill="none"
        stroke="#FFF6E6"
        strokeWidth="0.7"
      />
    </>
  ),
  second: () => (
    <>
      <line
        x1="0"
        y1="20"
        x2="0"
        y2="-82"
        stroke="#E25A74"
        strokeWidth="1.2"
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 2px rgb(226 90 116 / 0.8))" }}
      />
      {/* a little heart as the counterweight */}
      <path
        d="M0 28 C -5 24, -5 18, -1.8 18 C -0.8 18, 0 19, 0 20 C 0 19, 0.8 18, 1.8 18 C 5 18, 5 24, 0 28 Z"
        fill="#E25A74"
      />
      <circle cx="0" cy="-82" r="1.6" fill="#FFD3DC" />
    </>
  ),
};

/**
 * An open-work gold gear, turning about its own centre (SVG animation, so the
 * pivot is exact). Positive `seconds` per turn runs anticlockwise.
 */
function Gear({
  cx,
  cy,
  r,
  teeth,
  seconds,
  reduce,
}: {
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  seconds: number;
  reduce: boolean | null;
}) {
  const round = (n: number) => Math.round(n * 100) / 100;
  const pt = (deg: number, rr: number) => {
    const a = (deg * Math.PI) / 180;
    return `${round(cx + Math.cos(a) * rr)} ${round(cy + Math.sin(a) * rr)}`;
  };
  const step = 360 / teeth;
  const inner = r * 0.82;
  let d = "";
  for (let k = 0; k < teeth; k++) {
    const a = k * step;
    d += `${k ? "L" : "M"}${pt(a - step * 0.32, inner)} L${pt(a - step * 0.18, r)} L${pt(a + step * 0.18, r)} L${pt(a + step * 0.32, inner)} `;
  }
  const spokes = [0, 72, 144, 216, 288];
  return (
    <g>
      <path
        d={`${d}Z`}
        fill="none"
        stroke="#E9C98F"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <circle
        cx={cx}
        cy={cy}
        r={round(r * 0.62)}
        fill="none"
        stroke="#E9C98F"
        strokeWidth="0.7"
      />
      <circle
        cx={cx}
        cy={cy}
        r={round(r * 0.18)}
        fill="none"
        stroke="#E9C98F"
        strokeWidth="0.8"
      />
      {spokes.map((a) => (
        <path
          key={a}
          d={`M${pt(a, r * 0.18)} L${pt(a, r * 0.62)}`}
          stroke="#E9C98F"
          strokeWidth="0.7"
        />
      ))}
      {!reduce && (
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${cx} ${cy}`}
          to={`${seconds > 0 ? -360 : 360} ${cx} ${cy}`}
          dur={`${Math.abs(seconds)}s`}
          repeatCount="indefinite"
        />
      )}
    </g>
  );
}

/**
 * An enchanted clock in an anime night-sky style: a gilded dial with Roman
 * numerals on a starry face, a crescent moon, sakura on the rim and a slowly
 * turning magic circle; clockwork turns behind the face, and the bezel is
 * engraved "Time waits for no one" (a nod to the time-leaping classic) with
 * the wedding date beneath. Its hands run backwards with the countdown — every
 * second the second hand steps back, and the minute and hour hands creep
 * anticlockwise towards the moment. Original artwork; decorative.
 */
export function AnimeClock({
  secondsLeft,
  dateLine,
  className,
  idPrefix = "clock",
}: {
  secondsLeft: number | null;
  /** Engraved beneath, e.g. "XIX · XII · MMXXVI". */
  dateLine: string;
  className?: string;
  idPrefix?: string;
}) {
  const reduce = useReducedMotion();
  const id = (s: string) => `${idPrefix}-${s}`;
  const url = (s: string) => `url(#${id(s)})`;
  // Continuous angles from the time left, so the hands never jump at the wrap.
  const s = secondsLeft ?? 0;
  const angles = { second: s * 6, minute: s * 0.1, hour: s / 120 };
  const tick = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 140, damping: 14, mass: 0.6 };

  return (
    <div className={cn("relative aspect-square", className)} aria-hidden="true">
      {/* bloom behind the clock */}
      <div
        className="absolute -inset-[22%] animate-breathe rounded-full"
        style={{
          background:
            "radial-gradient(circle closest-side, rgb(243 227 195 / 0.16), rgb(184 69 90 / 0.1) 55%, transparent 100%)",
        }}
      />
      {/* the magic circle, turning slowly backwards (its own layer, so it turns about the centre) */}
      <motion.svg
        viewBox="-125 -125 250 250"
        className="absolute inset-0 size-full overflow-visible opacity-75"
        animate={reduce ? undefined : { rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <circle
          r="124"
          fill="none"
          stroke="#D5B98A"
          strokeOpacity="0.35"
          strokeWidth="0.6"
          strokeDasharray="1 4"
        />
        <circle
          r="118"
          fill="none"
          stroke="#F0A7B4"
          strokeOpacity="0.3"
          strokeWidth="0.5"
        />
        {Array.from({ length: 24 }, (_, i) => {
          const [x, y] = polar(i * 15, 121);
          return i % 3 === 0 ? (
            <path
              key={i}
              d={SPARKLE}
              transform={`translate(${x} ${y}) scale(3.2)`}
              fill="#F3E3C3"
              opacity="0.8"
            />
          ) : (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="0.9"
              fill="#F0A7B4"
              opacity="0.7"
            />
          );
        })}
      </motion.svg>
      <svg
        viewBox="-125 -125 250 250"
        className="relative size-full overflow-visible"
      >
        <defs>
          <radialGradient id={id("face")} cx="0.5" cy="0.38" r="0.7">
            <stop offset="0" stopColor="#3A1C3E" />
            <stop offset="0.55" stopColor="#24102A" />
            <stop offset="1" stopColor="#12080F" />
          </radialGradient>
          <linearGradient id={id("gold")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F3E3C3" />
            <stop offset="0.45" stopColor="#D5B98A" />
            <stop offset="0.75" stopColor="#B89C6E" />
            <stop offset="1" stopColor="#F3E3C3" />
          </linearGradient>
          <linearGradient id={id("petal")} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#8E5A66" />
            <stop offset="0.6" stopColor="#D3A9AF" />
            <stop offset="1" stopColor="#F4E2E0" />
          </linearGradient>
          <radialGradient id={id("moon")} cx="0.35" cy="0.65" r="0.8">
            <stop offset="0" stopColor="#FFF8EC" />
            <stop offset="1" stopColor="#E9C98F" />
          </radialGradient>
          <mask id={id("crescent")}>
            <circle cx="0" cy="-36" r="11" fill="#fff" />
            <circle cx="5" cy="-40" r="9.5" fill="#000" />
          </mask>
          {/* paths the bezel inscriptions follow: over the top, and under the bottom (reading left to right) */}
          <path id={id("arc-top")} d="M -103 0 A 103 103 0 0 1 103 0" />
          <path
            id={id("arc-bottom")}
            d="M -108.5 0 A 108.5 108.5 0 0 0 108.5 0"
          />
          <clipPath id={id("window")}>
            <circle r="50" />
          </clipPath>
          <filter id={id("glow")} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* the bezel, engraved: "Time waits for no one" over the top, the date beneath */}
        <circle r="105" fill="none" stroke="#1C0C16" strokeWidth="11.5" />
        <circle r="110.8" fill="none" stroke={url("gold")} strokeWidth="1" />
        <text
          className="font-display"
          fontSize="6.6"
          fontWeight={600}
          letterSpacing="2.4"
          fill="#E9C98F"
        >
          <textPath
            href={`#${id("arc-top")}`}
            startOffset="50%"
            textAnchor="middle"
          >
            .
          </textPath>
        </text>
        <text
          className="font-display"
          fontSize="6.6"
          fontWeight={600}
          letterSpacing="2.4"
          fill="#E9C98F"
        >
          <textPath
            href={`#${id("arc-bottom")}`}
            startOffset="50%"
            textAnchor="middle"
          >
            {dateLine}
          </textPath>
        </text>
        {[-62, 62, 118, -118].map((a) => {
          const [x, y] = polar(a, 105.4);
          return (
            <path
              key={a}
              d={SPARKLE}
              transform={`translate(${x} ${y}) scale(2.6)`}
              fill="#F3E3C3"
            />
          );
        })}

        {/* the dial */}
        <circle r="99" fill="none" stroke={url("gold")} strokeWidth="3.2" />
        <circle
          r="99"
          fill="none"
          stroke="#FFF6E6"
          strokeOpacity="0.35"
          strokeWidth="6"
          filter={url("glow")}
        />
        <circle r="94" fill={url("face")} />
        <circle r="94" fill="none" stroke={url("gold")} strokeWidth="0.8" />

        {/* stars on the face */}
        {[
          [-48, -58, 0.9],
          [52, -50, 1.1],
          [-62, 18, 0.8],
          [60, 30, 0.9],
          [-30, 52, 1],
          [34, 58, 0.8],
          [-12, -64, 0.7],
          [70, -8, 0.7],
        ].map(([x, y, r], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="#FFF6E6"
            animate={reduce ? undefined : { opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 3 + (i % 3),
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* clockwork seen through the face, turning backwards */}
        <g clipPath={url("window")} opacity="0.32">
          <Gear
            cx={-12}
            cy={18}
            r={22}
            teeth={14}
            seconds={24}
            reduce={reduce}
          />
          <Gear
            cx={21}
            cy={7}
            r={13}
            teeth={9}
            seconds={-15.4}
            reduce={reduce}
          />
          <Gear cx={7} cy={37} r={9} teeth={7} seconds={-12} reduce={reduce} />
        </g>

        {/* crescent moon */}
        <circle
          cx="0"
          cy="-36"
          r="11"
          fill="#FFF1DE"
          opacity="0.5"
          mask={url("crescent")}
          filter={url("glow")}
        />
        <circle
          cx="0"
          cy="-36"
          r="11"
          fill={url("moon")}
          mask={url("crescent")}
        />

        {/* inner ring */}
        <circle
          r="52"
          fill="none"
          stroke="#D5B98A"
          strokeOpacity="0.25"
          strokeWidth="0.6"
          strokeDasharray="2 3"
        />

        {/* minute ticks and hour marks */}
        {Array.from({ length: 60 }, (_, i) => {
          const hour = i % 5 === 0;
          const [x1, y1] = polar(i * 6, hour ? 79 : 85);
          const [x2, y2] = polar(i * 6, 90);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={hour ? "#F3E3C3" : "#D5B98A"}
              strokeOpacity={hour ? 0.95 : 0.45}
              strokeWidth={hour ? 1.8 : 0.7}
              strokeLinecap="round"
            />
          );
        })}

        {/* Roman numerals */}
        {NUMERALS.map((n, i) => {
          const [x, y] = polar(i * 30, 67);
          return (
            <text
              key={n}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#F3E3C3"
              className="font-display"
              fontSize={i % 3 === 0 ? 13 : 9.5}
              fontWeight={500}
            >
              {n}
            </text>
          );
        })}

        {/* sakura on the rim */}
        <Blossom x={-72} y={-72} r={12} rot={10} id={id} />
        <Blossom x={-88} y={-52} r={8} rot={40} id={id} />
        <Blossom x={74} y={72} r={11} rot={-15} id={id} />
        <Blossom x={92} y={50} r={7.5} rot={25} id={id} />
      </svg>
      {/* the hands, running backwards — each its own layer turning about the centre */}
      {secondsLeft !== null &&
        (["hour", "minute", "second"] as const).map((hand) => (
          <motion.svg
            key={hand}
            viewBox="-125 -125 250 250"
            className="absolute inset-0 size-full overflow-visible"
            initial={false}
            animate={{ rotate: angles[hand] }}
            transition={tick}
          >
            {HANDS[hand](url)}
          </motion.svg>
        ))}
      {/* the hands pivot on a sakura */}
      <svg
        viewBox="-125 -125 250 250"
        className="absolute inset-0 size-full overflow-visible"
      >
        <Blossom x={0} y={0} r={9} id={id} />
        <circle r="3" fill={url("gold")} />
        <circle r="1.3" fill="#E25A74" />
      </svg>
    </div>
  );
}

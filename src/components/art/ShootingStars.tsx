import { cn } from "@/lib/utils";

/**
 * Occasional shooting stars with soft gold-and-blush tails. Pure CSS (see
 * `.shooting-star` in globals.css), so it renders on the server and costs
 * nothing at runtime. Fixed positions and timings keep server and client
 * markup identical. Hidden for reduced motion.
 */
const STARS = [
  // top/left in %, angle in deg (tail points back up-right), travel, cycle length, start delay
  { top: 6, left: 72, angle: 148, dist: "38vmax", dur: 11, delay: 1.5 },
  { top: 14, left: 38, angle: 156, dist: "30vmax", dur: 14, delay: 6 },
  { top: 2, left: 92, angle: 142, dist: "44vmax", dur: 17, delay: 10.5 },
  { top: 24, left: 60, angle: 152, dist: "26vmax", dur: 13, delay: 15 },
];

export function ShootingStars({ className, count = STARS.length }: { className?: string; count?: number }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden motion-reduce:hidden", className)}>
      {STARS.slice(0, count).map((s, i) => (
        <span
          key={i}
          className="shooting-star"
          style={
            {
              top: `${s.top}%`,
              left: `${s.left}%`,
              "--angle": `${s.angle}deg`,
              "--dist": s.dist,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

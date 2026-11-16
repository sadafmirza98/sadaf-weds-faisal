"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { wedding } from "@/config/wedding";
import { useInvite } from "@/components/layout/InviteProvider";
import { Reveal } from "@/components/animations/Reveal";
import { Illustration } from "@/components/art/Illustration";
import { SectionHeading } from "@/components/art/Ornament";
import { formatTime, hasTime, monthOf, parseLocal, weekdayOf } from "@/lib/time";
import { cn } from "@/lib/utils";

const WEEKDAYS = [
  ["S", "Sunday"],
  ["M", "Monday"],
  ["T", "Tuesday"],
  ["W", "Wednesday"],
  ["T", "Thursday"],
  ["F", "Friday"],
  ["S", "Saturday"],
] as const;

const HEART = "M12 20.6s-7.4-4.5-9.5-9.1C1 8.2 3.1 4.6 6.6 4.6c2.2 0 3.7 1.3 4.4 2.6.7-1.3 2.2-2.6 4.4-2.6 3.5 0 5.6 3.6 4.1 6.9-2.1 4.6-9.5 9.1-9.5 9.1z";

function Heart({ filled, className }: { filled: boolean; className?: string }) {
  const gid = `heart-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {filled && (
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#C2546A" />
            <stop offset="1" stopColor="#741D35" />
          </linearGradient>
        </defs>
      )}
      <path d={HEART} fill={filled ? `url(#${gid})` : "none"} stroke="#D5B98A" strokeWidth={filled ? 0.8 : 1.1} strokeLinejoin="round" />
    </svg>
  );
}

/** SECTION F — a month calendar with the wedding days marked by hearts. */
export function SaveTheDate() {
  const { saveTheDate } = wedding;
  const { events, primary } = useInvite();
  const main = parseLocal(primary.start);
  const monthName = monthOf(primary.start);
  const firstWeekday = new Date(Date.UTC(main.year, main.month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(main.year, main.month, 0)).getUTCDate();

  // Events that fall in the wedding month, grouped by day.
  const byDay = new Map<number, string[]>();
  for (const e of events) {
    const p = parseLocal(e.start);
    if (p.year === main.year && p.month === main.month) byDay.set(p.day, [...(byDay.get(p.day) ?? []), e.name]);
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));

  return (
    <section id="calendar" aria-labelledby="calendar-title" className="section-y relative overflow-hidden">
      <div aria-hidden="true" className="starfield absolute inset-0 -z-10 animate-twinkle opacity-40" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_50%_at_50%_55%,rgba(92,16,41,0.4),transparent_70%)]" />

      <div className="shell relative">
        <Reveal>
          <SectionHeading id="calendar-title" eyebrow={saveTheDate.eyebrow} title={saveTheDate.title} intro={saveTheDate.intro} />
        </Reveal>

        <Reveal delay={0.15} className="relative mx-auto mt-14 max-w-md sm:mt-20">
          <Illustration name="floral-spray" className="pointer-events-none absolute -left-16 -top-14 w-32 -rotate-12 opacity-80 sm:-left-28 sm:w-44" />
          <Illustration name="floral-spray" className="pointer-events-none absolute -bottom-14 -right-16 w-32 rotate-[168deg] opacity-80 sm:-right-28 sm:w-44" />

          <div className="frame relative bg-obsidian/70 px-4 pb-8 pt-9 backdrop-blur-sm sm:px-8 sm:pb-10 sm:pt-11">
            <table className="w-full table-fixed border-collapse text-center">
              <caption className="mb-7">
                <span className="block font-display text-[clamp(2.6rem,9vw,3.5rem)] italic leading-none text-ivory">{monthName}</span>
                <span className="mt-3 block font-serif text-xs uppercase tracking-[0.5em] text-gold">{main.year}</span>
              </caption>
              <thead>
                <tr>
                  {WEEKDAYS.map(([short, full], i) => (
                    <th key={i} scope="col" abbr={full} className="pb-3 text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ivory/40">
                      {short}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, w) => (
                  <tr key={w}>
                    {week.map((day, d) => {
                      const names = day ? byDay.get(day) : undefined;
                      const primary = day === main.day;
                      return (
                        <td key={d} className="p-0.5">
                          {day && (
                            <div className="relative mx-auto grid aspect-square w-full max-w-12 place-items-center">
                              {names && (
                                <motion.span
                                  aria-hidden="true"
                                  className="absolute inset-[-14%]"
                                  animate={primary ? { scale: [1, 1.12, 1, 1.08, 1] } : undefined}
                                  transition={primary ? { duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" } : undefined}
                                >
                                  <Heart filled={primary} className="size-full drop-shadow-[0_0_10px_rgba(184,69,90,0.55)]" />
                                </motion.span>
                              )}
                              <span
                                className={cn(
                                  "relative font-serif text-sm sm:text-base",
                                  primary ? "-mt-1 font-medium text-ivory" : names ? "-mt-1 text-gold" : "text-ivory/60",
                                )}
                              >
                                {day}
                              </span>
                              {names && <span className="sr-only">, {names.join(" and ")}</span>}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="mt-8 space-y-3 border-t border-gold/15 pt-6 text-left">
              {events.map((e) => {
                const p = parseLocal(e.start);
                const primary = p.year === main.year && p.month === main.month && p.day === main.day;
                return (
                  <li key={e.id} className="flex items-center gap-3">
                    <Heart filled={primary} className="size-5 shrink-0" />
                    <span className="w-16 shrink-0 font-serif text-xs uppercase tracking-[0.2em] text-gold">
                      {weekdayOf(e.start).slice(0, 3)} {p.day}
                    </span>
                    <span className="font-display text-lg italic leading-tight text-ivory/90">
                      {e.name}
                      {hasTime(e.start) && <span className="text-ivory/50"> · {formatTime(e.start)}</span>}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

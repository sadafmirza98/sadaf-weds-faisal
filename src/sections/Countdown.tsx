"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useSyncExternalStore } from "react";
import { wedding } from "@/config/wedding";
import { Reveal } from "@/components/animations/Reveal";
import { CrimsonMoon } from "@/components/art/CrimsonMoon";
import { Illustration } from "@/components/art/Illustration";
import { Ornament } from "@/components/art/Ornament";
import { useCountdown } from "@/hooks/useCountdown";
import { formatFullDate, formatTime, hasTime, zonedTimeToUtc } from "@/lib/time";

const EASE = [0.22, 1, 0.36, 1] as const;

/** A single digit that rolls up when it changes. */
function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.56em] overflow-hidden align-top">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0 flex items-center justify-center"
          initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ value, label, pad = 2 }: { value: number | null; label: string; pad?: number }) {
  const text = value === null ? "–".repeat(pad) : String(value).padStart(pad, "0");
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-[clamp(2.75rem,11vw,7.5rem)] font-light leading-none text-ivory lining-nums" aria-hidden="true">
        {Array.from(text).map((d, i) => (
          <Digit key={i} value={d} />
        ))}
      </span>
      <span className="eyebrow mt-4 text-[0.6rem] text-gold/85 sm:text-[0.6875rem]">{label}</span>
    </div>
  );
}

const subscribeNoop = () => () => {};

/** The wedding moment expressed in the guest's own timezone (client only). */
function useGuestLocalTime(target: Date, enabled: boolean) {
  return useSyncExternalStore(
    subscribeNoop,
    () => {
      if (!enabled) return null;
      const guestTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!guestTz || guestTz === wedding.timeZone) return null;
      return new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
      }).format(target);
    },
    () => null,
  );
}

/** SECTION E — live countdown to the configured moment in the configured timezone. */
export function Countdown() {
  // Every guest counts down to the Nikah (weddingDate), whatever their invite.
  const moment = wedding.weddingDate;
  const target = useMemo(() => zonedTimeToUtc(moment, wedding.timeZone), [moment]);
  const left = useCountdown(target.getTime());
  // Date-only start → count to the start of the day; no clock time is shown.
  const timed = hasTime(moment);
  const guestLocal = useGuestLocalTime(target, timed);
  const done = left !== null && left.total === 0;
  const { countdown } = wedding;
  const zoneLabel = wedding.timeZoneLabel ?? `${wedding.timeZone.split("/").pop()?.replace(/_/g, " ")} time`;

  return (
    <section id="countdown" aria-labelledby="countdown-title" className="relative isolate overflow-hidden py-[clamp(5rem,16vw,12rem)]">
      <div aria-hidden="true" className="starfield absolute inset-0 -z-20 animate-twinkle opacity-60" />
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_60%_55%_at_50%_100%,rgba(116,29,53,0.45),transparent_70%)]" />
      <div aria-hidden="true" className="absolute bottom-0 left-1/2 -z-10 w-[min(78vw,560px)] -translate-x-1/2 translate-y-[58%] opacity-75">
        <CrimsonMoon idPrefix="cd-moon" />
      </div>
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-obsidian to-transparent" />

      <div className="shell text-center">
        <Reveal>
          <p className="eyebrow">{countdown.eyebrow}</p>
          <h2 id="countdown-title" className="display-title mx-auto mt-6 max-w-3xl text-[clamp(2.6rem,6.5vw,4.75rem)] italic text-balance">
            {done ? countdown.celebrationTitle : countdown.title}
          </h2>
          <p className="mt-6 text-[0.7rem] uppercase tracking-[0.32em] text-ivory/65">
            {formatFullDate(moment)}
            {timed && ` · ${formatTime(moment)} ${zoneLabel}`}
          </p>
          {guestLocal && <p className="mt-2 font-display text-base italic text-ivory/45">That is {guestLocal} where you are.</p>}
        </Reveal>

        <Reveal delay={0.15} className="mt-12 sm:mt-20">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: EASE }}
                className="mx-auto max-w-xl"
              >
                <Ornament className="mx-auto" width="w-56" />
                <p className="mt-8 font-display text-[clamp(1.4rem,3vw,2rem)] italic leading-snug text-ivory/90 text-pretty">
                  {countdown.celebrationMessage}
                </p>
              </motion.div>
            ) : (
              <motion.div key="ticking" exit={{ opacity: 0 }}>
                <div
                  role="timer"
                  aria-live="off"
                  aria-label={
                    left
                      ? `${left.days} days, ${left.hours} hours, ${left.minutes} minutes and ${left.seconds} seconds to go`
                      : "Counting down"
                  }
                  className="mx-auto grid max-w-4xl grid-cols-4 items-start"
                >
                  <Unit value={left?.days ?? null} label="Days" pad={left && left.days > 99 ? 3 : 2} />
                  <Unit value={left?.hours ?? null} label="Hours" />
                  <Unit value={left?.minutes ?? null} label="Minutes" />
                  <Unit value={left?.seconds ?? null} label="Seconds" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>

        <Illustration name="floral-garland" className="relative mx-auto mt-14 w-[min(96vw,760px)] sm:mt-28" sizes="(max-width: 768px) 92vw, 720px" />
      </div>
    </section>
  );
}

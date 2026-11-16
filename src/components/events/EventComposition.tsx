"use client";

import { CalendarPlus, Clock, MapPin, Shirt } from "lucide-react";
import { motion } from "motion/react";
import { wedding } from "@/config/wedding";
import type { WeddingEvent } from "@/types/wedding";
import { Reveal } from "@/components/animations/Reveal";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import { mapsUrl } from "@/lib/maps";
import { formatLongDate, formatTime, formatTimeRange, hasTime, weekdayOf, parseLocal, zonedTimeToUtc } from "@/lib/time";
import { cn, coupleNames, toRoman } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** One celebration rendered as an editorial spread (not a card). */
export function EventComposition({ event, index }: { event: WeddingEvent; index: number }) {
  const flip = index % 2 === 1;
  const day = parseLocal(event.start).day;
  const headingId = `event-${event.id}`;

  return (
    <article aria-labelledby={headingId} className="relative grid items-start gap-8 py-12 sm:gap-10 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-24">
      {/* Title block */}
      <div className={cn("relative lg:col-span-5", flip && "lg:order-2 lg:col-start-8")}>
        <Reveal className="relative">
          <div className="flex items-center gap-5">
            <motion.span
              aria-hidden="true"
              className="text-outline select-none font-display text-[clamp(3.5rem,7vw,5rem)] font-light leading-none"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.6, ease: EASE }}
            >
              {toRoman(index + 1)}
            </motion.span>
            <span aria-hidden="true" className="h-px w-12 bg-gold/40" />
            <p className="eyebrow">{event.kicker}</p>
          </div>
          <h3 id={headingId} className="mt-6 font-display text-[clamp(2.5rem,5.5vw,4.25rem)] italic leading-[0.95] text-ivory">
            {event.name}
          </h3>
          <div className="mt-8 flex items-end gap-5">
            <span className="font-display text-[4.5rem] font-light leading-[0.8] text-gold">{String(day).padStart(2, "0")}</span>
            <span className="pb-1 text-[0.6875rem] uppercase leading-relaxed tracking-[0.3em] text-ivory/75">
              {weekdayOf(event.start)}
              <br />
              {formatLongDate(event.start).replace(/^\d+\s/, "")}
            </span>
          </div>
          <p className="mt-6 flex items-center gap-3 text-sm tracking-wide text-ivory/80">
            <Clock className="size-4 text-gold/80" aria-hidden="true" />
            <span>{hasTime(event.start) ? formatTimeRange(event.start, event.end) : wedding.celebrations.timeToBeAnnounced}</span>
          </p>
        </Reveal>
      </div>

      {/* Details */}
      <Reveal delay={0.15} className={cn("relative lg:col-span-6", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7")}>
        <p className="font-display text-[1.35rem] italic leading-relaxed text-ivory/85 text-pretty">{event.description}</p>

        {event.schedule && event.schedule.length > 0 && hasTime(event.start) && (
          <div className="mt-10">
            <p className="eyebrow text-gold/80">The evening</p>
            <ol className="relative mt-6 space-y-6 before:absolute before:bottom-2 before:left-[6.25rem] before:top-2 before:w-px before:bg-gradient-to-b before:from-gold/50 before:via-gold/25 before:to-transparent sm:before:left-[7.25rem]">
              {[{ time: event.start, title: event.name, note: undefined as string | undefined }, ...event.schedule].map((item) => (
                <li key={item.time + item.title} className="relative grid grid-cols-[5.5rem_1fr] items-baseline gap-6 sm:grid-cols-[6.5rem_1fr]">
                  <time
                    dateTime={zonedTimeToUtc(item.time, wedding.timeZone).toISOString()}
                    className="text-right font-serif text-sm uppercase tracking-[0.12em] text-gold"
                  >
                    {formatTime(item.time)}
                  </time>
                  <span aria-hidden="true" className="absolute left-[6.25rem] top-[0.45rem] size-[7px] -translate-x-1/2 rotate-45 border border-gold bg-obsidian sm:left-[7.25rem]" />
                  <div className="pl-1">
                    <p className="font-display text-2xl italic leading-none text-ivory">{item.title}</p>
                    {item.note && <p className="mt-1.5 text-sm leading-relaxed text-ivory/55">{item.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        <dl className="mt-10 divide-y divide-gold/12 border-y border-gold/12">
          <div className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <dt className="eyebrow flex items-center gap-2 text-gold/80">
              <MapPin className="size-3.5" aria-hidden="true" /> Venue
            </dt>
            <dd>
              {event.venue ? (
                <>
                  <p className="font-serif text-lg text-ivory">{event.venue.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ivory/60">{event.venue.address}</p>
                </>
              ) : (
                <p className="font-display text-lg italic text-ivory/70">{wedding.celebrations.venueToBeAnnounced}</p>
              )}
            </dd>
          </div>
          {event.dressCode && (
            <div className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="eyebrow flex items-center gap-2 text-gold/80">
                <Shirt className="size-3.5" aria-hidden="true" /> Attire
              </dt>
              <dd>
                <div className="flex flex-wrap items-center gap-4">
                  <p className="font-serif text-lg text-ivory">{event.dressCode.label}</p>
                  {event.dressCode.swatches && (
                    <ul className="flex -space-x-1.5" aria-label="Suggested colours">
                      {event.dressCode.swatches.map((c) => (
                        <li key={c} className="size-5 rounded-full border border-ivory/25 shadow-[0_0_0_2px_#090708]" style={{ background: c }} title={c}>
                          <span className="sr-only">{c}</span>
                        </li>
                      ))}
                    </ul>
                )}
              </div>
              {event.dressCode.note && <p className="mt-1 text-sm leading-relaxed text-ivory/60">{event.dressCode.note}</p>}
            </dd>
          </div>
          )}
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
          {event.venue && (
            <a href={mapsUrl(event.venue)} target="_blank" rel="noopener noreferrer" className="link-luxe">
              <MapPin className="size-3.5" aria-hidden="true" />
              Get directions
              <span className="sr-only"> to {event.venue.name} (opens Google Maps in a new tab)</span>
            </a>
          )}
          <a
            href={googleCalendarUrl(event, wedding.timeZone, coupleNames)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-luxe"
          >
            <CalendarPlus className="size-3.5" aria-hidden="true" />
            Google Calendar
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <button type="button" onClick={() => downloadIcs(event, wedding.timeZone, coupleNames)} className="link-luxe">
            <CalendarPlus className="size-3.5" aria-hidden="true" />
            Apple / Outlook
            <span className="sr-only"> — download calendar file</span>
          </button>
        </div>
      </Reveal>
    </article>
  );
}

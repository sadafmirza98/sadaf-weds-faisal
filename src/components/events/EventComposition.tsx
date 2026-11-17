"use client";

import { CalendarPlus, Clock, MapPin } from "lucide-react";
import { wedding } from "@/config/wedding";
import type { LocalDateTime, WeddingEvent } from "@/types/wedding";
import { Reveal } from "@/components/animations/Reveal";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import { mapsUrl } from "@/lib/maps";
import { formatLongDate, formatTime, formatTimeRange, hasTime, weekdayOf, parseLocal, zonedTimeToUtc } from "@/lib/time";
import { coupleNames, joinNames } from "@/lib/utils";

interface Moment {
  time: string;
  title: string;
  note?: string;
}

/**
 * One day of celebrations as a single editorial spread: the date, the
 * evening's timeline (each event plus extra moments such as the Bidai),
 * one venue and one "add to calendar" for the whole day.
 * `events` are the guest's events on that day, in time order.
 */
export function EventComposition({ events }: { events: WeddingEvent[] }) {
  const [first] = events;
  const names = joinNames(
    events.map((e) => e.name),
    " & ",
  );
  const timed = hasTime(first.start);

  const moments: Moment[] = timed
    ? events
        .flatMap((e) => [{ time: e.start as string, title: e.name }, ...(e.schedule ?? [])])
        .sort((a, b) => a.time.localeCompare(b.time))
    : [];
  // The day ends at the latest end time or extra moment, if it is after the start.
  const lastMoment = [...events.map((e) => e.end), ...moments.map((m) => m.time)]
    .filter((t): t is string => Boolean(t))
    .sort()
    .pop();
  const end = timed && lastMoment && lastMoment > first.start ? (lastMoment as LocalDateTime) : undefined;
  const venue = events.find((e) => e.venue)?.venue;

  // The whole day as one calendar entry.
  const calendarEvent: WeddingEvent = {
    id: `day-${first.start.slice(0, 10)}`,
    name: names,
    kicker: first.kicker,
    start: first.start,
    end,
    venue,
    description: [
      first.description,
      moments.length > 1 ? moments.map((m) => `${formatTime(m.time)}  ${m.title}`).join("\n") : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  };

  return (
    <article aria-labelledby="day-title" className="relative grid items-start gap-8 py-12 sm:gap-10 sm:py-16 lg:grid-cols-12 lg:gap-12 lg:py-20">
      {/* Date block */}
      <div className="relative lg:col-span-5">
        <Reveal className="relative">
          <div className="flex items-center gap-5">
            <span aria-hidden="true" className="h-px w-12 bg-gold/40" />
            <p className="eyebrow">{first.kicker}</p>
          </div>
          <h3 id="day-title" className="mt-6 font-display text-[clamp(2.5rem,5.5vw,4.25rem)] italic leading-[0.95] text-ivory">
            {names}
          </h3>
          <div className="mt-8 flex items-end gap-5">
            <span className="font-display text-[4.5rem] font-light leading-[0.8] text-gold">{String(parseLocal(first.start).day).padStart(2, "0")}</span>
            <span className="pb-1 text-[0.6875rem] uppercase leading-relaxed tracking-[0.3em] text-ivory/75">
              {weekdayOf(first.start)}
              <br />
              {formatLongDate(first.start).replace(/^\d+\s/, "")}
            </span>
          </div>
          <p className="mt-6 flex items-center gap-3 text-sm tracking-wide text-ivory/80">
            <Clock className="size-4 text-gold/80" aria-hidden="true" />
            <span>{timed ? formatTimeRange(first.start, end) : wedding.celebrations.timeToBeAnnounced}</span>
          </p>
        </Reveal>
      </div>

      {/* Timeline, venue and calendar */}
      <Reveal delay={0.15} className="relative lg:col-span-6 lg:col-start-7">
        <p className="font-display text-[1.35rem] italic leading-relaxed text-ivory/85 text-pretty">{first.description}</p>

        {moments.length > 1 && (
          <div className="mt-10">
            <p className="eyebrow text-gold/80">The evening</p>
            <ol className="relative mt-6 space-y-6 before:absolute before:bottom-2 before:left-[6.25rem] before:top-2 before:w-px before:bg-gradient-to-b before:from-gold/50 before:via-gold/25 before:to-transparent sm:before:left-[7.25rem]">
              {moments.map((item) => (
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

        <dl className="mt-10 border-y border-gold/12">
          <div className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <dt className="eyebrow flex items-center gap-2 text-gold/80">
              <MapPin className="size-3.5" aria-hidden="true" /> Venue
            </dt>
            <dd>
              {venue ? (
                <>
                  <p className="font-serif text-lg text-ivory">{venue.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ivory/60">{venue.address}</p>
                </>
              ) : (
                <p className="font-display text-lg italic text-ivory/70">{wedding.celebrations.venueToBeAnnounced}</p>
              )}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2">
          {venue && (
            <a href={mapsUrl(venue)} target="_blank" rel="noopener noreferrer" className="link-luxe">
              <MapPin className="size-3.5" aria-hidden="true" />
              Get directions
              <span className="sr-only"> to {venue.name} (opens Google Maps in a new tab)</span>
            </a>
          )}
          <a href={googleCalendarUrl(calendarEvent, wedding.timeZone, coupleNames)} target="_blank" rel="noopener noreferrer" className="link-luxe">
            <CalendarPlus className="size-3.5" aria-hidden="true" />
            Google Calendar
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <button type="button" onClick={() => downloadIcs(calendarEvent, wedding.timeZone, coupleNames)} className="link-luxe">
            <CalendarPlus className="size-3.5" aria-hidden="true" />
            Apple / Outlook
            <span className="sr-only"> — download calendar file</span>
          </button>
        </div>
      </Reveal>
    </article>
  );
}

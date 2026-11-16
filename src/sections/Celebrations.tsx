"use client";

import { wedding } from "@/config/wedding";
import { useInvite } from "@/components/layout/InviteProvider";
import { Reveal } from "@/components/animations/Reveal";
import { Illustration } from "@/components/art/Illustration";
import { Ornament, SectionHeading } from "@/components/art/Ornament";
import { EventComposition } from "@/components/events/EventComposition";
import { formatFullDate, formatTime, hasTime, zonedTimeToUtc } from "@/lib/time";

/** The guest's events and their extra moments, grouped by day and sorted by time. */
function itineraryOf(events: ReturnType<typeof useInvite>["events"]) {
  const items = events
    .filter((e) => hasTime(e.start))
    .flatMap((e) => [{ time: e.start as string, title: e.name }, ...(e.schedule ?? []).map((s) => ({ time: s.time as string, title: s.title }))])
    .sort((a, b) => a.time.localeCompare(b.time));
  const days = new Map<string, typeof items>();
  for (const item of items) days.set(item.time.slice(0, 10), [...(days.get(item.time.slice(0, 10)) ?? []), item]);
  return { count: items.length, days: [...days.entries()] };
}

/** SECTION D — the guest's events, with an at-a-glance itinerary. */
export function Celebrations() {
  const { celebrations, timeZone } = wedding;
  const { events } = useInvite();
  const zoneLabel = wedding.timeZoneLabel ?? `${timeZone.split("/").pop()?.replace(/_/g, " ")} local time`;
  const anyTimed = events.some((e) => hasTime(e.start));
  const itinerary = itineraryOf(events);

  return (
    <section id="celebrations" aria-labelledby="celebrations-title" className="section-y relative overflow-hidden bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(64,13,32,0.55),transparent_70%)]">
      <Illustration name="floral-spray" className="absolute -right-24 top-40 hidden w-64 opacity-40 lg:block" />
      <Illustration name="floral-spray" className="absolute -left-28 bottom-40 hidden w-56 -scale-x-100 opacity-30 lg:block" />

      <div className="shell relative">
        <Reveal>
          <SectionHeading id="celebrations-title" eyebrow={celebrations.eyebrow} title={celebrations.title} intro={celebrations.intro} />
          {anyTimed && <p className="mt-6 text-center text-[0.625rem] uppercase tracking-[0.3em] text-ivory/40">All times are {zoneLabel}</p>}
        </Reveal>

        {itinerary.count > 1 && (
          <Reveal delay={0.1} className="mx-auto mt-14 max-w-xl">
            <div className="frame px-6 py-8 sm:px-10">
              <p className="eyebrow text-center">At a glance</p>
              <div className="mt-6 space-y-7">
                {itinerary.days.map(([day, items]) => (
                  <div key={day}>
                    <p className="text-center font-display text-xl italic text-ivory">{formatFullDate(day)}</p>
                    <ol className="mx-auto mt-4 max-w-xs space-y-2.5">
                      {items.map((item) => (
                        <li key={item.time + item.title} className="flex items-baseline gap-4">
                          <time
                            dateTime={zonedTimeToUtc(item.time, timeZone).toISOString()}
                            className="w-20 shrink-0 text-right font-serif text-xs uppercase tracking-[0.12em] text-gold"
                          >
                            {formatTime(item.time)}
                          </time>
                          <span aria-hidden="true" className="h-px flex-1 translate-y-[-0.2em] bg-gold/20" />
                          <span className="font-display text-lg italic text-ivory/90">{item.title}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        <div className="mt-12 lg:mt-20">
          {events.map((event, i) => (
            <div key={event.id}>
              {i > 0 && <Ornament className="mx-auto" width="w-56" />}
              <EventComposition event={event} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

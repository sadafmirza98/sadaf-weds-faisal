"use client";

import { wedding } from "@/config/wedding";
import { useInvite } from "@/components/layout/InviteProvider";
import { Reveal } from "@/components/animations/Reveal";
import { Illustration } from "@/components/art/Illustration";
import { SectionHeading } from "@/components/art/Ornament";
import { EventComposition } from "@/components/events/EventComposition";
import { hasTime } from "@/lib/time";
import { SideSakura } from "@/components/art/GrowingSakura";

/**
 * SECTION D — the guest's main day (the day of their primary event, e.g.
 * 19 December for the Nikah) as one spread with its timeline. Their other
 * invited days are still marked on the Save the Date calendar.
 */
export function Celebrations() {
  const { celebrations, timeZone } = wedding;
  const { events, primary } = useInvite();
  const day = primary.start.slice(0, 10);
  const dayEvents = events.filter((e) => e.start.startsWith(day));
  const zoneLabel = wedding.timeZoneLabel ?? `${timeZone.split("/").pop()?.replace(/_/g, " ")} local time`;

  return (
    <section id="celebrations" aria-labelledby="celebrations-title" className="section-y relative overflow-hidden bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(64,13,32,0.55),transparent_70%)]">
      {/* a sakura sprig grows in from the side as this scrolls into view */}
      <SideSakura side="left" variant={1} className="top-[34%]" />
      <Illustration name="floral-spray" className="absolute -right-24 top-40 hidden w-64 opacity-40 lg:block" />
      <Illustration name="floral-spray" className="absolute -left-28 bottom-40 hidden w-56 -scale-x-100 opacity-30 lg:block" />

      <div className="shell relative">
        <Reveal>
          <SectionHeading id="celebrations-title" eyebrow={celebrations.eyebrow} title={celebrations.title} intro={celebrations.intro} />
          {hasTime(primary.start) && <p className="mt-6 text-center text-[0.625rem] uppercase tracking-[0.3em] text-ivory/40">All times are {zoneLabel}</p>}
        </Reveal>

        <div className="mt-8 lg:mt-14">
          <EventComposition events={dayEvents} />
        </div>

        <Reveal delay={0.1} className="mt-4 flex justify-center lg:mt-8">
          <a href="#rsvp" className="btn-luxe">
            Kindly RSVP
          </a>
        </Reveal>
      </div>
    </section>
  );
}

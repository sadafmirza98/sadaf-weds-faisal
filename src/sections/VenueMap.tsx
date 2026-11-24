"use client";

import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Check, Hand, MapPin, Navigation } from "lucide-react";
import { useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { useInvite } from "@/components/layout/InviteProvider";
import { Reveal } from "@/components/animations/Reveal";
import { Comet } from "@/components/art/Comet";
import { Illustration } from "@/components/art/Illustration";
import { SectionHeading } from "@/components/art/Ornament";
import { RedThread } from "@/components/art/RedThread";
import { directionsUrl, inviteVenues, mapsEmbedUrl, mapsUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";
import type { Venue } from "@/types/wedding";
import { SideSakura } from "@/components/art/GrowingSakura";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Two red threads, one from each side of the arch, wind across the map and
 * meet at the venue pin (the centre of the embed). Coordinates are in a
 * 100 × 125 box that matches the arch's 4:5 window.
 */
const THREADS = [
  "M -4 121 C 14 118, 26 108, 21 98 C 16 88, 30 79, 41 84 C 53 89, 59 77, 50 62.5",
  "M 104 4 C 86 9, 79 21, 84 32 C 89 43, 72 49, 62 44 C 52 39, 45 50, 50 62.5",
];

/** SECTION — the venue at twilight: a map in an arched window, with the way to us. */
export function VenueMap() {
  const { venueMap } = wedding;
  const { events } = useInvite();
  const venues = inviteVenues(events);
  const gapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // The comet flies across the gap between the intro line and the map as it
  // scrolls through the screen: in from the right as the gap rises from the
  // bottom, through the middle at mid-screen, out to the left near the top
  // (and back again on the way up). Tilted to a shallow angle about its head,
  // so it travels along the gap rather than dropping onto the map.
  const { scrollYProgress } = useScroll({ target: gapRef, offset: ["start end", "start start"] });
  const cometX = useTransform(scrollYProgress, [0, 1], ["62vw", "-62vw"]);
  const cometY = useTransform(scrollYProgress, [0, 1], ["-5.4vw", "5.4vw"]);
  if (!venues.length) return null;

  return (
    <section id="venue" aria-labelledby="venue-title" className="section-y relative isolate overflow-hidden">
      {/* desktop: a sakura sprig grows in from the margin as this scrolls into view */}
      <SideSakura side="right" variant={1} className="bottom-[6%]" />
      {/* Twilight: night above, a violet hour, then the last burgundy light */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,transparent_0%,rgba(30,24,62,0.55)_30%,rgba(64,13,32,0.5)_72%,transparent_100%)]"
      />
      <div aria-hidden="true" className="starfield absolute inset-0 -z-20 animate-twinkle opacity-60" />
      <Illustration name="floral-spray" className="pointer-events-none absolute -left-24 bottom-24 hidden w-56 -scale-x-100 opacity-30 lg:block" />

      <div className="shell relative">
        <Reveal>
          <SectionHeading id="venue-title" eyebrow={venueMap.eyebrow} title={venueMap.title} intro={venueMap.intro} />
        </Reveal>

        {/* The comet's path: a zero-height line through the gap below the intro */}
        <div ref={gapRef} aria-hidden="true" className="pointer-events-none relative mt-10 h-0 sm:mt-14">
          {/* positioned so the comet's head (at 33.8% × 64.5% of its box) sits on the line, centred */}
          <motion.div
            style={reduce ? undefined : { x: cometX, y: cometY }}
            className="absolute left-[calc(50%-23.7vw)] top-[-16.6vw] w-[70vw] sm:left-[calc(50%-min(46vw,560px)*0.338)] sm:top-[calc(min(46vw,560px)*-0.237)] sm:w-[min(46vw,560px)]"
          >
            <Comet className="w-full origin-[33.8%_64.5%] rotate-[14deg] opacity-95" />
          </motion.div>
        </div>

        <div className="mt-10 space-y-24 sm:mt-14">
          {venues.map(({ venue, events: names }) => (
            <VenueCard key={`${venue.name}|${venue.address}`} venue={venue} eventNames={names} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VenueCard({ venue, eventNames }: { venue: Venue; eventNames: string[] }) {
  const [exploring, setExploring] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(windowRef, { once: true, amount: 0.45 });
  const reduce = useReducedMotion();
  const drawn = reduce || inView;

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
      {/* ── The arched map window ─────────────────────────────────────── */}
      <Reveal className="relative mx-auto w-full max-w-[26rem]">
        {/* Outer gold arch, echoing the invitation cover */}
        <div aria-hidden="true" className="absolute -inset-3 rounded-t-full border border-gold/25" />
        <div
          ref={windowRef}
          className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-gold/45 bg-night shadow-[0_40px_90px_-30px_rgba(184,69,90,0.55)]"
        >
          <iframe
            src={mapsEmbedUrl(venue)}
            title={`Map showing ${venue.name}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            tabIndex={exploring ? 0 : -1}
            // A night-time map: inverted, then hue-turned back so the pin stays red.
            className={cn(
              "absolute inset-0 size-full border-0 [filter:invert(0.9)_hue-rotate(185deg)_saturate(0.6)_brightness(0.95)_contrast(0.9)]",
              !exploring && "pointer-events-none",
            )}
          />

          {/* Twilight wash + vignette (lighter while exploring) */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(43,35,110,0.55)_0%,rgba(92,16,41,0.25)_55%,rgba(232,140,120,0.3)_100%)] mix-blend-soft-light transition-opacity duration-700",
              exploring ? "opacity-40" : "opacity-100",
            )}
          />
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_18px_rgba(9,7,8,0.85)] transition-opacity duration-700",
              exploring ? "opacity-40" : "opacity-100",
            )}
          />

          {/* The threads and the knot at the venue */}
          <AnimatePresence>
            {!exploring && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <div className="starfield absolute inset-x-0 top-0 h-1/3 animate-twinkle opacity-70 [mask-image:linear-gradient(180deg,black,transparent)]" />
                {/* The box matches the 4:5 window exactly, so the default scaling never distorts it. */}
                <svg viewBox="0 0 100 125" className="absolute inset-0 size-full overflow-visible" fill="none">
                  {THREADS.map((d, i) => (
                    <motion.path
                      key={i}
                      d={d}
                      stroke={i ? "#D64560" : "#C8344E"}
                      strokeWidth={0.6}
                      strokeLinecap="round"
                      style={{ filter: "drop-shadow(0 0 1px rgb(214 69 96 / 0.9))" }}
                      initial={{ pathLength: reduce ? 1 : 0 }}
                      animate={{ pathLength: drawn ? 1 : 0 }}
                      transition={{ duration: 2.2, delay: 0.2 + i * 0.35, ease: [0.65, 0, 0.35, 1] }}
                    />
                  ))}
                </svg>
                {/* Where the threads meet */}
                <motion.span
                  className="absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D64560] shadow-[0_0_14px_4px_rgba(214,69,96,0.7)]"
                  initial={{ scale: reduce ? 1 : 0 }}
                  animate={{ scale: drawn ? 1 : 0 }}
                  transition={{ duration: 0.6, delay: reduce ? 0 : 2.6, ease: EASE }}
                />
                {!reduce && drawn && (
                  <motion.span
                    className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#F0A7B4]/70"
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: [0.3, 1.6], opacity: [0.8, 0] }}
                    transition={{ duration: 2.4, delay: 2.9, repeat: Infinity, repeatDelay: 0.8, ease: "easeOut" }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explore toggle: the map stays still (and page scrolling smooth) until asked */}
          <button
            type="button"
            onClick={() => setExploring((e) => !e)}
            aria-pressed={exploring}
            className="absolute bottom-4 left-1/2 z-10 inline-flex min-h-10 -translate-x-1/2 items-center gap-2 whitespace-nowrap border border-gold/45 bg-obsidian/80 px-4 text-[0.6rem] font-medium uppercase tracking-[0.28em] text-ivory backdrop-blur-sm transition-colors duration-500 hover:border-gold hover:text-gold"
          >
            {exploring ? <Check className="size-3.5" aria-hidden="true" /> : <Hand className="size-3.5" aria-hidden="true" />}
            {exploring ? "Done exploring" : "Explore the map"}
          </button>
        </div>
      </Reveal>

      {/* ── The way to us ─────────────────────────────────────────────── */}
      <Reveal delay={0.15} className="flex flex-col items-center text-center lg:items-start lg:text-left">
        {eventNames.length > 0 && <p className="eyebrow">{eventNames.join(" · ")}</p>}
        <h3 className="display-title mt-5 text-[clamp(2.3rem,5.5vw,3.6rem)] italic text-balance">{venue.name}</h3>
        <address className="body-copy mt-5 max-w-md not-italic text-pretty">{venue.address}</address>

        <RedThread className="mt-8 w-40" />

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:items-center">
          <a href={mapsUrl(venue)} target="_blank" rel="noopener noreferrer" className="btn-luxe">
            <MapPin className="size-3.5" aria-hidden="true" />
            Open in Google Maps
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={directionsUrl(venue)} target="_blank" rel="noopener noreferrer" className="link-luxe">
            <Navigation className="size-3.5" aria-hidden="true" />
            Directions from here
            <span className="sr-only"> to {venue.name} (opens Google Maps in a new tab)</span>
          </a>
        </div>
      </Reveal>
    </div>
  );
}

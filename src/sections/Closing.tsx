"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { useInvite } from "@/components/layout/InviteProvider";
import { Reveal } from "@/components/animations/Reveal";
import { SakuraBurst } from "@/components/animations/SakuraBurst";
import { ScriptName } from "@/components/animations/ScriptName";
import { Illustration } from "@/components/art/Illustration";
import { Ornament } from "@/components/art/Ornament";
import { ShootingStars } from "@/components/art/ShootingStars";
import { WaxSeal } from "@/components/art/WaxSeal";
import { formatDottedDate, parseLocal } from "@/lib/time";
import { SideSakura } from "@/components/art/GrowingSakura";

const EASE = [0.22, 1, 0.36, 1] as const;

/** SECTION H — closing thank-you, secret letter easter egg, return to top and the closing Quran verse. */
export function Closing() {
  const { blessing, closing, couple, easterEggs } = wedding;
  const { primary } = useInvite();
  const [letterOpen, setLetterOpen] = useState(false);
  const sealRef = useRef<HTMLButtonElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!letterOpen) return;
    letterRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLetterOpen(false);
        sealRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [letterOpen]);

  const toTop = () => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document
      .querySelector<HTMLElement>("#top a, #top button")
      ?.focus({ preventScroll: true });
  };

  return (
    <footer
      aria-labelledby="closing-title"
      className="relative overflow-hidden pb-10 pt-[var(--section-y)]"
    >
      {/* desktop: a sakura sprig grows in from the margin as this scrolls into view */}
      <SideSakura side="left" variant={1} className="top-[22%]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(92,16,41,0.5),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="starfield absolute inset-0 -z-10 animate-twinkle opacity-40"
      />
      <ShootingStars className="-z-10" count={3} />

      <div className="shell relative flex flex-col items-center text-center">
        <Reveal>
          <Illustration
            name="floral-garland"
            className="mx-auto w-[min(94vw,820px)]"
            sizes="(max-width: 768px) 94vw, 820px"
          />
        </Reveal>

        <Reveal delay={0.1} className="-mt-4 max-w-2xl">
          <p className="eyebrow">{closing.eyebrow}</p>
          <p className="mt-8 font-display text-[clamp(1.45rem,3.2vw,2.1rem)] font-light italic leading-snug text-ivory/90 text-pretty">
            {closing.message}
          </p>
          <p className="mt-10 font-display text-lg italic text-ivory/55">
            {closing.signOff}
          </p>
        </Reveal>

        <h2
          id="closing-title"
          className="display-title mt-6 text-[clamp(3.3rem,13vw,10rem)] leading-[1.05]"
        >
          <ScriptName text={couple.partnerOne.firstName} inView />
          <span className="gold-text mx-[0.15em] text-[0.5em] not-italic">
            &amp;
          </span>
          <ScriptName text={couple.partnerTwo.firstName} inView delay={0.5} />
        </h2>

        <Reveal delay={0.2}>
          <Ornament className="mx-auto mt-8" width="w-56" />
          <p className="mt-6 font-serif text-[0.8rem] uppercase tracking-[0.4em] text-gold">
            {formatDottedDate(primary.start)}
          </p>
          <p className="mt-2 text-[0.65rem] uppercase tracking-[0.35em] text-ivory/45">
            {wedding.locationLine}
          </p>
        </Reveal>

        {/* Easter egg: a tiny seal hiding a letter */}
        <div className="mt-16 flex items-center gap-8">
          <button
            ref={sealRef}
            type="button"
            onClick={() => setLetterOpen(true)}
            aria-expanded={letterOpen}
            aria-controls="secret-letter"
            aria-label="A small sealed note — open it"
            className="group relative size-11 rounded-full opacity-60 transition-[opacity,transform] duration-700 ease-silk hover:-rotate-12 hover:opacity-100"
          >
            <WaxSeal monogram={couple.monogram} idPrefix="closing-seal" />
          </button>
        </div>

        <AnimatePresence>
          {letterOpen && (
            <motion.div
              id="secret-letter"
              ref={letterRef}
              tabIndex={-1}
              role="dialog"
              aria-label="A secret note"
              className="frame relative mt-10 w-full max-w-md px-8 py-10 text-left outline-none"
              initial={{ opacity: 0, y: 20, rotateX: -50 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{
                opacity: 0,
                y: 10,
                rotateX: -30,
                transition: { duration: 0.4, ease: EASE },
              }}
              transition={{ duration: 0.9, ease: EASE }}
              style={{ transformPerspective: 900, transformOrigin: "top" }}
            >
              <button
                type="button"
                onClick={() => {
                  setLetterOpen(false);
                  sealRef.current?.focus();
                }}
                className="absolute right-3 top-3 grid size-10 place-items-center text-ivory/50 transition-colors hover:text-gold"
                aria-label="Fold the note away"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
              <p className="font-display text-lg italic text-gold">
                {easterEggs.secretLetter.salutation}
              </p>
              <p className="mt-4 font-display text-xl italic leading-relaxed text-ivory/85">
                {easterEggs.secretLetter.body}
              </p>
              <p className="mt-6 text-right font-display text-2xl italic text-ivory">
                — {easterEggs.secretLetter.signature}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={toTop}
          className="group mt-16 flex flex-col items-center gap-3 text-[0.625rem] uppercase tracking-[0.35em] text-ivory/60 transition-colors hover:text-gold"
        >
          <span className="grid size-12 place-items-center rounded-full border border-gold/30 transition-[border-color,transform] duration-700 ease-silk group-hover:-translate-y-1 group-hover:border-gold">
            <ArrowUp className="size-4" aria-hidden="true" />
          </span>
          Back to the beginning
        </button>

        {/* The last word: a verse from the Quran, Surah Ar-Rum 30:21 */}
        <Reveal className="mt-20 w-full max-w-3xl">
          <figure aria-labelledby="closing-verse-cite">
            <Ornament className="mx-auto" width="w-32" />
            <p
              lang="ar"
              dir="rtl"
              className="gold-text mt-10 px-2 py-2 font-arabic text-[clamp(1.5rem,4.4vw,2.4rem)] leading-[2] text-balance"
            >
              {blessing.arabic}
            </p>
            <blockquote className="mx-auto mt-6 max-w-2xl font-display text-[clamp(1.15rem,2.6vw,1.5rem)] font-light italic leading-relaxed text-ivory/80 text-pretty">
              <p>“{blessing.verse}”</p>
            </blockquote>
            <figcaption
              id="closing-verse-cite"
              className="eyebrow mt-7 flex items-center justify-center gap-4 text-[0.625rem] text-gold/85"
            >
              <span className="h-px w-8 bg-gold/40" aria-hidden="true" />
              {blessing.cite}
              <span className="h-px w-8 bg-gold/40" aria-hidden="true" />
            </figcaption>
          </figure>
        </Reveal>

        {/* the last flourish: a blossom to tap, below the verse */}
        <div className="mt-12">
          <SakuraBurst size={34} label="A falling blossom" />
        </div>

        <div className="mt-12 w-full border-t border-gold/10 pt-8 text-[0.6rem] uppercase tracking-[0.3em] text-ivory/35">
          {closing.developedBy && (
            <p className="text-ivory/45">
              {" "}
              {parseLocal(primary.start).year} · Developed by{" "}
              {closing.developedBy}
            </p>
          )}
          <p></p>
        </div>
      </div>
    </footer>
  );
}

import { wedding } from "@/config/wedding";
import type { Person } from "@/types/wedding";
import { Reveal } from "@/components/animations/Reveal";
import { SakuraBurst } from "@/components/animations/SakuraBurst";
import { Illustration } from "@/components/art/Illustration";
import { Ornament } from "@/components/art/Ornament";
import { RedThread } from "@/components/art/RedThread";

/**
 * The families, as on a Nikah card — straight after the hero.
 * Renders nothing until `couple.partnerOne/Two.family` is set.
 */
export function Families() {
  const { blessing, couple } = wedding;
  const people = [couple.partnerOne, couple.partnerTwo];
  if (!people.some((p) => p.family)) return null;

  return (
    <section id="families" aria-labelledby="families-title" className="section-y relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <Illustration name="floral-corner" className="absolute -left-24 top-16 hidden w-80 -scale-y-100 opacity-25 lg:block" />
      <Illustration name="floral-corner" className="absolute -right-24 bottom-0 hidden w-80 rotate-180 opacity-25 lg:block" />

      <div className="shell relative flex flex-col items-center text-center">
        <Reveal>
          <Ornament width="w-40" />
        </Reveal>
        <Reveal delay={0.1} className="mt-10 w-full max-w-4xl">
          <h2 id="families-title" className="eyebrow">
            {blessing.familiesEyebrow}
          </h2>
          <div className="mt-10 grid items-center gap-8 sm:grid-cols-[1fr_auto_1fr] sm:gap-10">
            <Family person={couple.partnerOne} />
            <RedThread className="mx-auto w-44 sm:w-48" />
            <Family person={couple.partnerTwo} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** The Quran verse — near the end, just before the closing thank-you. */
export function Blessing() {
  const { blessing } = wedding;

  return (
    <section id="blessing" aria-labelledby="blessing-title" className="section-y relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="shell relative flex flex-col items-center text-center">
        <h2 id="blessing-title" className="sr-only">
          A verse for our wedding
        </h2>

        <Reveal>
          <Ornament width="w-40" />
        </Reveal>

        <Reveal delay={0.1} className="mt-10 max-w-3xl">
          <figure>
            <blockquote className="font-display text-[clamp(1.55rem,3.6vw,2.6rem)] font-light italic leading-snug text-ivory/90 text-balance">
              <p>“{blessing.verse}”</p>
            </blockquote>
            <figcaption className="eyebrow mt-8 flex items-center justify-center gap-4 text-[0.625rem] text-gold/85">
              <span className="h-px w-8 bg-gold/40" aria-hidden="true" />
              {blessing.cite}
              <span className="h-px w-8 bg-gold/40" aria-hidden="true" />
            </figcaption>
          </figure>
        </Reveal>

        <Reveal delay={0.2} className="mt-10">
          <SakuraBurst size={40} label="A sakura blossom" />
        </Reveal>
      </div>
    </section>
  );
}

function Family({ person }: { person: Person }) {
  return (
    <div className="flex flex-col items-center">
      <p className="font-script text-[clamp(2.9rem,7vw,4rem)] leading-tight text-ivory">{person.fullName}</p>
      {person.family && (
        <>
          <p className="eyebrow mt-4 text-[0.6rem] text-ivory/50">{person.family.relation}</p>
          <p className="mt-2 font-serif text-base text-ivory/80 text-balance">{person.family.parents}</p>
        </>
      )}
    </div>
  );
}

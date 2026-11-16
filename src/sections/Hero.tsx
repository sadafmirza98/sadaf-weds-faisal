"use client";

import { AnimatePresence, motion, useAnimate, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { wedding } from "@/config/wedding";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { useInvite } from "@/components/layout/InviteProvider";
import { ScriptName } from "@/components/animations/ScriptName";
import { CrimsonMoon } from "@/components/art/CrimsonMoon";
import { Bismillah } from "@/components/art/Bismillah";
import { Illustration } from "@/components/art/Illustration";
import { formatLongDate, weekdayOf } from "@/lib/time";
import { joinNames } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** SECTION B — dramatic hero with a parallax moon. */
export function Hero() {
  const { revealed } = useExperience();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const moonY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const floraY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Easter egg: three taps on the moon reveal a hidden line.
  const [taps, setTaps] = useState(0);
  const [secret, setSecret] = useState(false);
  const [moonScope, animateMoon] = useAnimate<HTMLButtonElement>();
  useEffect(() => {
    if (!secret) return;
    const t = window.setTimeout(() => setSecret(false), 9000);
    return () => window.clearTimeout(t);
  }, [secret]);
  const onMoon = () => {
    const next = taps + 1;
    setTaps(next);
    animateMoon(moonScope.current, { scale: [1, 1.04, 1] }, { duration: 0.9, ease: EASE });
    if (next % 3 === 0) setSecret(true);
  };

  const base = revealed ? 0.75 : 0;
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 1.3, delay: base + delay, ease: EASE },
  });
  const { couple, hero } = wedding;
  const { events, primary } = useInvite();

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-svh items-center overflow-hidden pb-24 pt-24 lg:pb-24 lg:pt-28">
      {/* Atmosphere */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_80%_60%_at_70%_30%,rgba(92,16,41,0.45),transparent_60%),radial-gradient(ellipse_90%_50%_at_20%_100%,rgba(64,13,32,0.6),transparent_70%)]" />
      <div aria-hidden="true" className="starfield absolute inset-0 -z-20 animate-twinkle opacity-70" />
      <div aria-hidden="true" className="starfield-alt absolute inset-0 -z-20 opacity-60 [animation:twinkle_7s_ease-in-out_infinite_1.5s]" />

      {/* Moon (interactive easter egg) */}
      <motion.div
        style={{ y: moonY }}
        className="absolute left-1/2 top-[8svh] -z-10 w-[min(58vw,34svh)] -translate-x-1/2 short:left-auto short:right-[7%] short:top-[22svh] short:w-[min(52svh,34vw)] short:translate-x-0 lg:left-auto lg:right-[9%] lg:top-[13%] lg:w-[min(36vw,520px)] lg:translate-x-0"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 2.4, delay: base, ease: EASE }}
      >
        <button
          ref={moonScope}
          type="button"
          onClick={onMoon}
          aria-label="The moon"
          className="relative block w-full cursor-pointer rounded-full transition-[filter] duration-700 ease-silk hover:brightness-110"
        >
          <CrimsonMoon idPrefix="hero-moon" />
        </button>
      </motion.div>

      {/* Florals */}
      <motion.div style={{ y: floraY }} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -right-[18%] top-[2%] w-[min(85vw,620px)] lg:-right-[4%] lg:top-[4%]"
          initial={{ opacity: 0, x: 60 }}
          animate={revealed ? { opacity: 0.95, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 2.4, delay: base + 0.2, ease: EASE }}
        >
          <Illustration name="sakura-branch" eager sizes="(max-width: 1024px) 85vw, 620px" className="h-auto w-full animate-drift" />
        </motion.div>
        <motion.div
          className="absolute -bottom-[14%] -left-[9%] hidden w-[min(15vw,230px)] opacity-60 lg:block"
          initial={{ opacity: 0, y: 80 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ duration: 2.2, delay: base + 0.3, ease: EASE }}
        >
          <Illustration name="floral-spray" eager sizes="(max-width: 1024px) 46vw, 360px" className="h-auto w-full" />
        </motion.div>
        <motion.div
          className="absolute -bottom-[6%] -right-[22%] w-[min(52vw,420px)] opacity-70 lg:-bottom-[10%] lg:-right-[4%] lg:w-[min(30vw,460px)] lg:opacity-100"
          initial={{ opacity: 0, y: 80 }}
          animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
          transition={{ duration: 2.2, delay: base + 0.45, ease: EASE }}
        >
          <Illustration name="floral-corner" sizes="(max-width: 1024px) 60vw, 460px" className="h-auto w-full rotate-180" />
        </motion.div>
      </motion.div>

      {/* Ground mist */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />

      {/* Wording */}
      <motion.div style={{ y: textY, opacity: textOpacity }} className="shell pointer-events-none relative mt-[22svh] short:mt-0 lg:mt-0">
        <div className="pointer-events-auto mx-auto max-w-3xl text-center short:mx-0 short:max-w-[58%] short:text-left lg:mx-0 lg:max-w-2xl lg:text-left">
          <motion.div className="mb-4 text-[clamp(1rem,3.4vw,1.3rem)]" {...rise(0)}>
            <Bismillah className="short:items-start lg:items-start" />
          </motion.div>
          <motion.p className="eyebrow flex items-center justify-center gap-4 short:justify-start lg:justify-start" {...rise(0.1)}>
            <span className="h-px w-10 bg-gold/50" aria-hidden="true" />
            {joinNames(events.map((e) => e.name), " & ")}
          </motion.p>

          <h1 id="hero-title" className="display-title mt-5 text-[clamp(4.2rem,17vw,12rem)] short:text-[clamp(3.4rem,22svh,6.2rem)] leading-[1] [text-shadow:0_4px_40px_rgba(9,7,8,0.65)]">
            <span className="block">
              <ScriptName text={couple.partnerOne.firstName} play={revealed} delay={base + 0.25} />
            </span>
            <span className="flex items-baseline justify-center gap-[0.18em] short:justify-start short:pl-[0.9em] lg:justify-start lg:pl-[0.9em]">
              <motion.span
                className="gold-text font-display text-[0.45em] not-italic"
                initial={{ opacity: 0, rotate: -12 }}
                animate={revealed ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -12 }}
                transition={{ duration: 1.4, delay: base + 0.65, ease: EASE }}
              >
                &amp;
              </motion.span>
              <ScriptName text={couple.partnerTwo.firstName} play={revealed} delay={base + 0.75} />
            </span>
          </h1>

          <AnimatePresence>
            {secret && (
              <motion.p
                role="status"
                className="mx-auto mt-6 max-w-md font-display text-xl italic text-gold [text-shadow:0_0_24px_rgba(213,185,138,0.45)] short:mx-0 lg:mx-0"
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
                transition={{ duration: 1, ease: EASE }}
              >
                ✦ {wedding.easterEggs.moonMessage}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-serif text-[0.75rem] uppercase tracking-[0.24em] text-ivory/85 sm:mt-9 sm:gap-x-6 sm:text-[0.8rem] sm:tracking-[0.32em] short:justify-start lg:justify-start"
            {...rise(1)}
          >
            <span>{weekdayOf(primary.start)}</span>
            <span className="h-3 w-px bg-gold/40 sm:h-4" aria-hidden="true" />
            <span className="text-gold">{formatLongDate(primary.start)}</span>
            <span className="hidden h-4 w-px bg-gold/40 sm:block short:hidden" aria-hidden="true" />
            <span className="basis-full text-ivory/65 sm:basis-auto sm:text-ivory/85 short:basis-full">{wedding.locationLine}</span>
          </motion.div>

          <motion.p className="body-copy mx-auto mt-6 max-w-md text-pretty sm:mt-7 short:mx-0 lg:mx-0" {...rise(1.15)}>
            {hero.message}
          </motion.p>

          <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:mt-10 short:justify-start lg:justify-start" {...rise(1.3)}>
            <a href="#rsvp" className="btn-luxe">
              Kindly RSVP
            </a>
            <a href="#celebrations" className="link-luxe">
              The celebrations
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#blessing"
        aria-label="Scroll down"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.4em] text-ivory/50 transition-colors hover:text-gold"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 1.2, delay: base + 1.8 }}
      >
        <span className="relative block h-10 w-px overflow-hidden bg-ivory/10" aria-hidden="true">
          <span className="absolute inset-0 animate-scroll-cue bg-gold" />
        </span>
        <ArrowDown className="size-3" aria-hidden="true" />
      </motion.a>
    </section>
  );
}

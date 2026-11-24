"use client";

import { animate, motion, useAnimate, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { wedding } from "@/config/wedding";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { useInvite } from "@/components/layout/InviteProvider";
import { listedEvents } from "@/lib/invite-copy";
import { ScriptName } from "@/components/animations/ScriptName";
import { AnimeMoon } from "@/components/art/AnimeMoon";
import { ShootingStars } from "@/components/art/ShootingStars";
import { Bismillah } from "@/components/art/Bismillah";
import { ThreadAmpersand } from "@/components/art/ThreadAmpersand";
import { GrowingSakura } from "@/components/art/GrowingSakura";
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

  // The sakura branch grows in over the first few seconds after the page opens.
  const reduce = useReducedMotion();
  const sakuraGrowth = useMotionValue(0);

  // Tapping the moon: it swells big and settles back, while a ring of light
  // ripples out and a ring of sparkles bursts around it.
  const [moonScope, animateMoon] = useAnimate<HTMLButtonElement>();
  const [moonBursts, setMoonBursts] = useState<number[]>([]);
  const onMoon = () => {
    if (reduce) return;
    animateMoon(moonScope.current, { scale: [1, 1.32, 1.14, 1] }, { duration: 1.6, times: [0, 0.3, 0.65, 1], ease: EASE });
    const id = Date.now();
    setMoonBursts((b) => [...b.slice(-2), id]);
    window.setTimeout(() => setMoonBursts((b) => b.filter((x) => x !== id)), 1800);
  };

  const base = revealed ? 0.75 : 0;
  useEffect(() => {
    if (!revealed) return;
    if (reduce) {
      sakuraGrowth.set(1);
      return;
    }
    const controls = animate(sakuraGrowth, 1, { duration: 3.2, delay: base + 0.2, ease: [0.3, 0, 0.25, 1] });
    return () => controls.stop();
  }, [revealed, base, reduce, sakuraGrowth]);
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
      <ShootingStars className="-z-20" />

      {/* Moon (interactive easter egg) */}
      <motion.div
        style={{ y: moonY }}
        className="absolute left-1/2 top-[9svh] -z-10 w-[min(30vw,17svh)] -translate-x-1/2 short:left-auto short:right-[9%] short:top-[20svh] short:w-[min(28svh,18vw)] short:translate-x-0 lg:left-auto lg:right-[25%] lg:top-[10%] lg:w-[min(16vw,240px)] lg:translate-x-0"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 2.4, delay: base, ease: EASE }}
      >
        {/* Grows and glows on hover (pointer devices only) */}
        <div className="relative transition-[transform,filter] duration-700 ease-silk hover:scale-[1.15] hover:brightness-125">
          {moonBursts.map((id) => (
            <MoonBurst key={id} />
          ))}
          <button
            ref={moonScope}
            type="button"
            onClick={onMoon}
            aria-label="The moon"
            className="relative block w-full cursor-pointer rounded-full"
          >
            <AnimeMoon idPrefix="hero-moon" />
          </button>
        </div>
      </motion.div>

      {/* Florals */}
      <motion.div style={{ y: floraY }} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -right-[18%] top-[2%] w-[min(85vw,620px)] lg:-right-[4%] lg:top-[4%]"
          initial={{ opacity: 0, x: 60 }}
          animate={revealed ? { opacity: 0.95, x: 0 } : { opacity: 0, x: 60 }}
          transition={{ duration: 2.4, delay: base + 0.2, ease: EASE }}
        >
          <GrowingSakura growth={sakuraGrowth} className="h-auto w-full animate-drift" />
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
            {joinNames(listedEvents(events).map((e) => e.name), " & ")}
          </motion.p>

          <h1 id="hero-title" className="display-title mt-5 text-[clamp(4.2rem,17vw,12rem)] short:text-[clamp(3.4rem,22svh,6.2rem)] leading-[1] [text-shadow:0_4px_40px_rgba(9,7,8,0.65)]">
            <span className="block">
              <ScriptName text={couple.partnerOne.firstName} play={revealed} delay={base + 0.25} />
            </span>
            <span className="flex items-baseline justify-center gap-[0.18em] short:justify-start short:pl-[0.9em] lg:justify-start lg:pl-[0.9em]">
              {/* the red thread writes the "&" once the page is revealed */}
              {revealed ? (
                <ThreadAmpersand idPrefix="hero-amp" delay={base + 0.65} className="size-[0.5em] shrink-0 self-center" />
              ) : (
                <span className="inline-block size-[0.5em] shrink-0 self-center" aria-hidden="true" />
              )}
              <ScriptName text={couple.partnerTwo.firstName} play={revealed} delay={base + 0.75} />
            </span>
          </h1>

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

        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#families"
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

const SPARKLE = "M0 -1C0.12 -0.3 0.3 -0.12 1 0C0.3 0.12 0.12 0.3 0 1C-0.12 0.3 -0.3 0.12 -1 0C-0.3 -0.12 -0.12 -0.3 0 -1Z";

/** One tap's flourish around the moon: a ripple of light and a ring of sparkles flying outward. */
function MoonBurst() {
  const count = 10;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* ripple of light */}
      <motion.span
        className="absolute inset-[8%] rounded-full border border-[#FFF1DE]/70 shadow-[0_0_30px_6px_rgba(255,236,210,0.35)]"
        initial={{ scale: 0.7, opacity: 0.9 }}
        animate={{ scale: 2.1, opacity: 0 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
      {/* sparkles */}
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + 0.3;
        const r = i % 2 ? 52 : 66; // distance from the centre, % of the moon's box (its disc reaches ~36%)
        const size = i % 3 === 0 ? 22 : 14;
        return (
          <motion.svg
            key={i}
            viewBox="-1 -1 2 2"
            className="absolute drop-shadow-[0_0_6px_rgba(255,240,220,0.9)]"
            style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
            initial={{ left: "50%", top: "50%", scale: 0, opacity: 0, rotate: 0 }}
            animate={{
              left: `${50 + Math.cos(a) * r}%`,
              top: `${50 + Math.sin(a) * r}%`,
              scale: [0, 1.2, 0.6],
              opacity: [0, 1, 0],
              rotate: 90,
            }}
            transition={{ duration: 1.3, delay: 0.05 + (i % 3) * 0.05, ease: [0.2, 0.7, 0.3, 1] }}
          >
            <path d={SPARKLE} fill={i % 2 ? "#F0C9D0" : "#FFF6E6"} />
          </motion.svg>
        );
      })}
    </div>
  );
}

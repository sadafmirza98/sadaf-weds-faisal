"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import branchArt from "./sakura-branch.json";
import sprigArt from "./sakura-sprigs.json";

/*
 * Sakura that grows: drawn inline from data made by scripts/generate-art.mjs
 * (the same artwork as /illustrations/sakura-branch.svg, plus three small side
 * sprigs). `growth` 0 → 1 draws each limb outward from the trunk, opens each
 * blossom as the branch reaches it, then lets any loose petals appear.
 */

interface Segment {
  d: string;
  hd: string;
  w: number;
  hw: number;
  color: string;
  from: number;
  to: number;
}
interface Art {
  viewBox: number[];
  length: number;
  segments: Segment[];
  blossoms: { markup: string; at: number }[];
  petals: string[];
}

/** How long a blossom takes to open, as a share of the whole growth. */
const BLOOM = 0.08;

function GrowingSegment({ growth, s, at }: { growth: MotionValue<number>; s: Segment; at: (d: number) => number }) {
  const length = useTransform(growth, [at(s.from), at(s.to)], [0, 1], { clamp: true });
  // Hide the round cap's dot until the limb has started growing.
  const opacity = useTransform(length, (v) => (v > 0.001 ? 1 : 0));
  return (
    <>
      <motion.path d={s.d} stroke={s.color} strokeWidth={s.w} strokeLinecap="round" style={{ pathLength: length, opacity }} />
      <motion.path d={s.hd} stroke="#4A2530" strokeOpacity={0.55} strokeWidth={s.hw} strokeLinecap="round" style={{ pathLength: length, opacity }} />
    </>
  );
}

function Blossom({ growth, markup, start }: { growth: MotionValue<number>; markup: string; start: number }) {
  const scale = useTransform(growth, [start, start + BLOOM * 0.7, start + BLOOM], [0, 1.12, 1], { clamp: true });
  const opacity = useTransform(growth, [start, start + BLOOM * 0.4], [0, 1], { clamp: true });
  return <motion.g style={{ scale, opacity }} dangerouslySetInnerHTML={{ __html: markup }} />;
}

function Petal({ growth, markup, start }: { growth: MotionValue<number>; markup: string; start: number }) {
  const opacity = useTransform(growth, [start, start + 0.04], [0, 1], { clamp: true });
  return <motion.g style={{ opacity }} dangerouslySetInnerHTML={{ __html: markup }} />;
}

function Growing({
  art,
  defs,
  growth,
  ease,
  className,
  flip = false,
}: {
  art: Art;
  defs: string;
  growth: MotionValue<number>;
  /**
   * Growth (0–1) at which the branch reaches a point `dist` along it. Eased so
   * the bare trunk shoots out quickly and most of the time goes to the outer
   * twigs, where the blossoms open.
   */
  ease: number;
  className?: string;
  flip?: boolean;
}) {
  const at = (dist: number) => (dist / art.length) ** ease;
  const [x, y, w, h] = art.viewBox;
  return (
    <svg
      aria-hidden="true"
      viewBox={`${x} ${y} ${w} ${h}`}
      fill="none"
      className={cn("pointer-events-none select-none", flip && "-scale-x-100", className)}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <defs dangerouslySetInnerHTML={{ __html: defs }} />
      {art.segments.map((s, i) => (
        <GrowingSegment key={i} growth={growth} s={s} at={at} />
      ))}
      {art.blossoms.map((b, i) => (
        <Blossom key={i} growth={growth} markup={b.markup} start={Math.min(at(b.at) - 0.01, 1 - BLOOM)} />
      ))}
      {art.petals.map((m, i) => (
        <Petal key={i} growth={growth} markup={m} start={0.86 + i * 0.012} />
      ))}
    </svg>
  );
}

/** The hero's sakura branch, grown by `growth` (0–1). */
export function GrowingSakura({ growth, className }: { growth: MotionValue<number>; className?: string }) {
  return <Growing art={branchArt} defs={branchArt.defs} growth={growth} ease={3} className={className} />;
}

/** True on wide screens (lg and up). False on the server and the first render. */
function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return wide;
}

/**
 * Growth 0 → 1 as `ref` scrolls in: it starts as its top enters the screen and
 * is in full bloom once all of it is in view (its bottom three-quarters of the
 * way down the screen). Reversible.
 */
function useScrollGrowth(ref: React.RefObject<HTMLElement | null>) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "end 0.75"] });
  return useTransform(scrollYProgress, (p) => (reduce ? 1 : p));
}

/**
 * Desktop only: a sakura sprig growing in from the left or right margin of its
 * section as the guest scrolls it into view — and back as they scroll away.
 * Place it inside a `relative overflow-hidden` section, before the content.
 * (Phones have no side margins, so they get <SakuraBreak> between sections.)
 */
export function SideSakura(props: { side: "left" | "right"; variant?: 0 | 1 | 2; className?: string }) {
  const wide = useWide();
  return wide ? <SideSprig {...props} /> : null;
}

function SideSprig({ side, variant = 0, className }: { side: "left" | "right"; variant?: 0 | 1 | 2; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const growth = useScrollGrowth(ref);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute w-[min(22vw,360px)] opacity-90", side === "left" ? "-left-3" : "-right-3", className)}
    >
      <Growing art={sprigArt.variants[variant]} defs={sprigArt.defs} growth={growth} ease={2} flip={side === "right"} className="h-auto w-full" />
    </div>
  );
}

/**
 * Phones and tablets only: a long, low sakura vine laid across the seam
 * between two sections, in the empty padding they already have — it takes up
 * no space of its own. It grows in from one edge as it scrolls past.
 */
export function SakuraBreak(props: { side: "left" | "right"; variant?: 0 | 1 }) {
  const wide = useWide();
  // The vine mounts in its own component, so its scroll tracking always binds
  // to it, even when the screen narrows after the page has loaded.
  return wide ? null : <SakuraVine {...props} />;
}

function SakuraVine({ side, variant = 0 }: { side: "left" | "right"; variant?: 0 | 1 }) {
  const ref = useRef<HTMLDivElement>(null);
  const growth = useScrollGrowth(ref);
  return (
    // Zero height: the vine hangs centred on the seam, over the two sections' padding.
    <div aria-hidden="true" className="pointer-events-none relative z-[2] h-0">
      <div
        ref={ref}
        className={cn("absolute top-0 w-[92vw] max-w-[520px] -translate-y-1/2", side === "left" ? "left-0" : "right-0")}
      >
        <Growing art={sprigArt.vines[variant]} defs={sprigArt.defs} growth={growth} ease={1.4} flip={side === "right"} className="h-auto w-full" />
      </div>
    </div>
  );
}

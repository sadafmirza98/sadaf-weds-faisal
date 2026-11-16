"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  /** Start revealing when true (e.g. after the invitation opens). */
  play?: boolean;
  /** Animate on scroll into view instead of `play`. */
  inView?: boolean;
  delay?: number;
  stagger?: number;
}

const letter: Variants = {
  hidden: { y: "110%", opacity: 0, rotate: 4 },
  show: { y: "0%", opacity: 1, rotate: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Letter-by-letter masked reveal. The full string stays in an sr-only span so
 * screen readers announce words, not letters. Visibility is observed on the
 * wrapper (letters start clipped by their masks, so they can't be observed).
 */
export function SplitText({ text, className, play = true, inView = false, delay = 0, stagger = 0.045 }: SplitTextProps) {
  const container: Variants = {
    hidden: {},
    show: { transition: { delayChildren: delay, staggerChildren: stagger } },
  };
  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        className="inline-block whitespace-nowrap"
        variants={container}
        initial="hidden"
        {...(inView ? { whileInView: "show", viewport: { once: true, amount: 0.4 } } : { animate: play ? "show" : "hidden" })}
      >
        {Array.from(text).map((ch, i) => (
          <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span className="inline-block will-change-transform" variants={letter}>
              {ch === " " ? " " : ch}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </span>
  );
}

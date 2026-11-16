"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface ScriptNameProps {
  text: string;
  className?: string;
  /** Start revealing when true (e.g. after the invitation opens). */
  play?: boolean;
  /** Reveal on scroll into view instead of `play`. */
  inView?: boolean;
  delay?: number;
}

/**
 * A name in the calligraphy face, revealed left to right like ink from a pen.
 * The whole word is one span, so the script's joins and swashes stay intact;
 * padding (offset by negative margin) keeps flourishes inside the clip.
 */
export function ScriptName({ text, className, play = true, inView = false, delay = 0 }: ScriptNameProps) {
  const ink: Variants = {
    hidden: { clipPath: "inset(0% 100% 0% 0%)", opacity: 0.35 },
    show: { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, transition: { duration: 1.9, delay, ease: [0.45, 0, 0.2, 1] } },
  };
  // The trigger lives on an unclipped wrapper: a fully clipped element never reports as in view.
  return (
    <motion.span
      className="inline-block"
      initial="hidden"
      {...(inView ? { whileInView: "show", viewport: { once: true, amount: 0.3 } } : { animate: play ? "show" : "hidden" })}
    >
      <motion.span
        className={cn("-mx-[0.35em] -my-[0.3em] inline-block px-[0.35em] py-[0.3em] font-script font-normal not-italic", className)}
        variants={ink}
      >
        {text}
      </motion.span>
    </motion.span>
  );
}

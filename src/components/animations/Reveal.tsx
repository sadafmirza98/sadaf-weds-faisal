"use client";

import { motion, type HTMLMotionProps } from "motion/react";

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  /** Add a soft blur-to-focus. */
  blur?: boolean;
  amount?: number;
}

/** Scroll-triggered entrance: fade + rise (+ optional focus pull). Plays once. */
export function Reveal({ delay = 0, y = 28, blur = false, amount = 0.3, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { wedding } from "@/config/wedding";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { useMusic } from "@/components/music/MusicProvider";
import { useInvite } from "@/components/layout/InviteProvider";
import { inviteMessage } from "@/lib/invite-copy";
import { ScriptName } from "@/components/animations/ScriptName";
import { AnimeMoon } from "@/components/art/AnimeMoon";
import { ShootingStars } from "@/components/art/ShootingStars";
import { Illustration } from "@/components/art/Illustration";
import { Bismillah } from "@/components/art/Bismillah";
import { Ornament } from "@/components/art/Ornament";
import { WaxSeal } from "@/components/art/WaxSeal";
import { formatFullDate } from "@/lib/time";

const EASE = [0.22, 1, 0.36, 1] as const;
const CURTAIN = [0.76, 0, 0.24, 1] as const;

/** Background shared by both curtain halves so the seam is invisible. */
const curtainBg =
  "radial-gradient(ellipse 70% 60% at 50% 58%, #2b0915 0%, #16070c 42%, #090708 78%)";

/**
 * SECTION A — the cinematic invitation cover.
 *
 * Entrance: florals emerge → arch frame draws → moon rises → wording → seal.
 * Opening:  seal splits → gold flash → wording lifts away → curtains part.
 * Reduced motion: everything appears at once and opening is a simple fade.
 */
export function InvitationGate() {
  const { phase, beginOpening, finishOpening, skipToSite } = useExperience();
  const reduce = useReducedMotion();
  const opening = phase === "opening";
  const dialogRef = useRef<HTMLDivElement>(null);
  const { couple, invitation } = wedding;
  const invite = useInvite();
  const music = useMusic();

  // Reduced motion: no curtain choreography — open straight away.
  useEffect(() => {
    if (opening && reduce) finishOpening();
  }, [opening, reduce, finishOpening]);

  // Move focus into the dialog so keyboard and screen-reader users start here
  // (on first load and when the S&F logo brings the cover back).
  useEffect(() => {
    if (phase === "gate") dialogRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const enter = (delay: number, y = 18) => ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, delay, ease: EASE },
  });

  return (
    <AnimatePresence>
      {phase !== "open" && (
        <motion.div
          key="gate"
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="gate-title"
          aria-describedby="gate-message"
          className="gate fixed inset-0 z-50 overflow-hidden outline-none"
          exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
        >
          {/* ── Curtains ─────────────────────────────────────────────── */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
            style={{ background: curtainBg, backgroundSize: "200% 100%", backgroundPosition: "0% 0%" }}
            animate={opening && !reduce ? { x: "-101%" } : { x: 0 }}
            transition={{ duration: 1.5, delay: 0.55, ease: CURTAIN }}
          >
            <motion.div
              className="absolute -left-[12%] -top-[8%] w-[min(78vw,560px)] origin-top-left short:w-[min(34vw,300px)]"
              initial={{ opacity: 0, scale: 0.86, rotate: -6, x: -30, y: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }}
              transition={{ duration: 2, delay: 0.1, ease: EASE }}
            >
              <Illustration name="floral-corner" eager sizes="(max-width: 768px) 78vw, 560px" className="h-auto w-full" />
            </motion.div>
            <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
          </motion.div>

          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
            style={{ background: curtainBg, backgroundSize: "200% 100%", backgroundPosition: "100% 0%" }}
            animate={opening && !reduce ? { x: "101%" } : { x: 0 }}
            transition={{ duration: 1.5, delay: 0.55, ease: CURTAIN }}
            onAnimationComplete={() => {
              if (opening) finishOpening();
            }}
          >
            <motion.div
              className="absolute -bottom-[8%] -right-[12%] w-[min(78vw,560px)] rotate-180 short:w-[min(34vw,300px)]"
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, delay: 0.3, ease: EASE }}
            >
              <Illustration name="floral-corner" eager sizes="(max-width: 768px) 78vw, 560px" className="h-auto w-full" />
            </motion.div>
            <motion.div
              className="absolute -right-[6%] top-[4%] w-[min(60vw,460px)] short:w-[min(30vw,260px)]"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 0.9, x: 0 }}
              transition={{ duration: 2.2, delay: 0.45, ease: EASE }}
            >
              <Illustration name="sakura-branch" eager sizes="(max-width: 768px) 60vw, 460px" className="h-auto w-full" />
            </motion.div>
            <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
          </motion.div>

          {/* ── Atmosphere + wording (lifts away on open) ───────────────── */}
          <motion.div
            className="relative z-10 flex h-full w-full items-center justify-center px-5"
            animate={opening ? { opacity: 0, y: -24, filter: "blur(6px)" } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: opening ? 0.3 : 0, ease: EASE }}
          >
            <motion.div
              className="starfield pointer-events-none absolute inset-0 animate-twinkle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ duration: 2.5, delay: 0.2 }}
              aria-hidden="true"
            />
            <ShootingStars count={2} />

            {/* Arch frame */}
            <div className="relative flex h-[min(92svh,780px)] w-[min(90vw,440px)] flex-col items-center short:h-[94svh] short:w-[min(64vw,560px)]">
              <motion.div
                className="absolute inset-0 rounded-t-[999px] border border-gold/35"
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 1.8, delay: 0.25, ease: EASE }}
                aria-hidden="true"
              >
                <div className="absolute inset-[7px] rounded-t-[999px] border border-gold/12" />
                <div className="absolute inset-0 rounded-t-[999px] bg-gradient-to-b from-obsidian/10 via-obsidian/45 to-obsidian/70 backdrop-blur-[1px]" />
              </motion.div>

              <div className="relative flex h-full w-full flex-col items-center justify-between px-6 pb-[clamp(1.25rem,4svh,2.5rem)] pt-[clamp(1.75rem,6svh,3.5rem)] text-center short:pb-3 short:pt-[9svh]">
                <motion.div
                  className="w-[min(22vw,11svh,110px)] short:hidden"
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 2, delay: 0.4, ease: EASE }}
                >
                  <AnimeMoon idPrefix="gate-moon" />
                </motion.div>

                <div className="flex flex-col items-center">
                  <motion.div {...enter(0.6, 10)} className="mb-[clamp(0.25rem,1.4svh,0.9rem)] text-[clamp(0.95rem,2.6svh,1.2rem)]">
                    <Bismillah />
                  </motion.div>
                  <motion.p className="eyebrow text-[0.625rem]" {...enter(0.7)}>
                    {invitation.eyebrow}
                  </motion.p>

                  <h2
                    id="gate-title"
                    className="display-title mt-[clamp(0.5rem,2.2svh,1.5rem)] flex flex-col items-center text-[clamp(3rem,min(15vw,8.8svh),5.4rem)] leading-[1.05] short:mt-1 short:flex-row short:items-baseline short:gap-[0.25em] short:text-[clamp(2.5rem,13svh,3.6rem)]"
                  >
                    <ScriptName text={couple.partnerOne.firstName} delay={0.85} />
                    <motion.span
                      className="gold-text my-[0.05em] font-display text-[0.42em] not-italic"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.2, delay: 1.15, ease: EASE }}
                    >
                      &amp;
                    </motion.span>
                    <ScriptName text={couple.partnerTwo.firstName} delay={1.35} />
                  </h2>

                  <motion.div {...enter(1.5, 10)} className="mt-[clamp(0.75rem,2.2svh,1.25rem)] flex flex-col items-center gap-3">
                    <Ornament width="w-40" />
                    <p className="whitespace-nowrap font-serif text-[clamp(0.68rem,3.3vw,0.8rem)] uppercase tracking-[clamp(0.16em,0.9vw,0.3em)] text-ivory/85">
                      {formatFullDate(invite.primary.start)}
                    </p>
                  </motion.div>

                  <motion.p
                    id="gate-message"
                    className="mt-[clamp(0.5rem,1.8svh,1.1rem)] max-w-[19rem] short:max-w-[28rem] short:text-[0.95rem] font-display text-[clamp(0.98rem,2.3svh,1.18rem)] italic leading-snug text-ivory/70 text-pretty"
                    {...enter(1.65, 10)}
                  >
                    {inviteMessage(invite)}
                  </motion.p>
                </div>

                {/* Wax seal — the primary action */}
                <motion.button
                  type="button"
                  onClick={() => {
                    music.play(); // the tap is the user gesture browsers require for sound
                    beginOpening();
                  }}
                  disabled={opening}
                  className="group relative flex flex-col items-center gap-3 rounded-full outline-offset-8"
                  initial={{ opacity: 0, scale: 0.6, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 14, delay: 1.9 }}
                >
                  <span className="relative block size-[clamp(3.75rem,10svh,5.75rem)] short:size-14">
                    {/* idle pulse ring */}
                    {!opening && (
                      <motion.span
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full border border-gold/50 motion-reduce:hidden"
                        animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 2.6 }}
                      />
                    )}
                    {/* gold flash when breaking */}
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{ background: "radial-gradient(circle, rgb(243 227 195 / 0.85), rgb(213 185 138 / 0.25) 40%, transparent 70%)" }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={opening ? { scale: [0.4, 5], opacity: [0.9, 0] } : { scale: 0, opacity: 0 }}
                      transition={{ duration: 1, ease: EASE }}
                    />
                    {/* the two halves of the seal */}
                    {(["left", "right"] as const).map((side) => (
                      <motion.span
                        key={side}
                        className="absolute inset-0 transition-transform duration-500 ease-silk group-hover:scale-105"
                        style={{ clipPath: side === "left" ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" }}
                        animate={
                          opening
                            ? { x: side === "left" ? -36 : 36, y: 18, rotate: side === "left" ? -28 : 28, opacity: 0 }
                            : { x: 0, y: 0, rotate: 0, opacity: 1 }
                        }
                        transition={{ duration: 0.8, ease: EASE }}
                      >
                        <WaxSeal monogram={couple.monogram} idPrefix={`gate-seal-${side}`} className="drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]" />
                      </motion.span>
                    ))}
                  </span>
                  <span className="eyebrow text-[0.625rem] text-gold transition-colors duration-500 group-hover:text-ivory">
                    {invitation.openLabel}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Skip — always available, also the accessible shortcut */}
          <motion.button
            type="button"
            onClick={skipToSite}
            className="absolute right-4 top-4 z-20 px-3 py-2 text-[0.625rem] uppercase tracking-[0.3em] text-ivory/45 transition-colors hover:text-ivory sm:right-6 sm:top-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: opening ? 0 : 1 }}
            transition={{ duration: 1, delay: opening ? 0 : 1 }}
          >
            Skip intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

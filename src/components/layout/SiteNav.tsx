"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { useInvite } from "@/components/layout/InviteProvider";
import { Illustration } from "@/components/art/Illustration";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { inviteVenues } from "@/lib/maps";
import { formatDottedDate } from "@/lib/time";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SiteNav() {
  const { phase, returnToGate } = useExperience();
  const { events, primary } = useInvite();
  // The venue section only exists when the guest's events have a venue.
  const hasVenue = inviteVenues(events).length > 0;
  const nav = wedding.nav.filter((n) => n.id !== "venue" || hasVenue);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(nav.map((n) => n.id));
  const { scrollY } = useScroll();
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const [m1, m2] = wedding.couple.monogram;

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));
  useBodyScrollLock(open);

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) menuButton.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      // Keep focus within the menu button + overlay links.
      const links = Array.from(document.querySelectorAll<HTMLElement>("#mobile-menu a"));
      const order = [menuButton.current, ...links].filter((el): el is HTMLElement => Boolean(el));
      const idx = order.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      const next = (idx + (e.shiftKey ? -1 : 1) + order.length) % order.length;
      order[next]?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Close the overlay if the viewport grows to desktop size.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (phase !== "open") return null;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-700 ease-silk",
          scrolled || open ? "border-b border-gold/10 bg-obsidian/75 backdrop-blur-md" : "border-b border-transparent",
        )}
      >
        <nav aria-label="Primary" className="shell flex h-16 items-center justify-between lg:h-[4.5rem]">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              returnToGate();
            }}
            className="group flex items-baseline gap-1 font-display text-2xl italic text-ivory"
            aria-label="Back to the invitation cover"
          >
            <span>{m1}</span>
            <span className="gold-text text-base not-italic">&amp;</span>
            <span>{m2}</span>
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  className={cn(
                    "relative py-2 text-[0.6875rem] uppercase tracking-[0.28em] transition-colors duration-500",
                    active === item.id ? "text-gold" : "text-ivory/65 hover:text-ivory",
                  )}
                >
                  {item.label}
                  {active === item.id && (
                    <motion.span layoutId="nav-dot" className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rotate-45 bg-gold" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          <button
            ref={menuButton}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-11 items-center gap-3 px-1 text-[0.6875rem] uppercase tracking-[0.3em] text-ivory/80 lg:hidden"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className="relative block h-3 w-6" aria-hidden="true">
              <span className={cn("absolute left-0 h-px w-6 bg-gold transition-transform duration-500 ease-silk", open ? "top-1.5 rotate-45" : "top-0")} />
              <span className={cn("absolute left-0 h-px bg-gold transition-all duration-500 ease-silk", open ? "top-1.5 w-6 -rotate-45" : "top-3 w-4")} />
            </span>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-30 flex flex-col overflow-hidden bg-obsidian/97 pt-16 backdrop-blur-xl lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <Illustration name="floral-corner" className="absolute -bottom-16 -right-16 w-[80vw] max-w-md rotate-180 opacity-70" />
            <ul className="shell flex flex-1 flex-col justify-center gap-2">
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 + i * 0.07, ease: EASE }}
                >
                  <a
                    ref={i === 0 ? firstLink : undefined}
                    href={`#${item.id}`}
                    onClick={() => close(false)}
                    aria-current={active === item.id ? "true" : undefined}
                    className="group flex items-baseline gap-5 py-2"
                  >
                    <span className="w-6 font-sans text-[0.625rem] tracking-[0.2em] text-gold/70">0{i + 1}</span>
                    <span
                      className={cn(
                        "font-display text-[clamp(2.4rem,11vw,3.5rem)] italic leading-none transition-colors",
                        active === item.id ? "text-gold" : "text-ivory group-hover:text-gold",
                      )}
                    >
                      {item.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.p
              className="shell pb-10 text-[0.625rem] uppercase tracking-[0.35em] text-ivory/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {formatDottedDate(primary.start)} · {wedding.locationLine}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

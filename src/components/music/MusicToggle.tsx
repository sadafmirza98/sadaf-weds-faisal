"use client";

import { AnimatePresence, motion } from "motion/react";
import { Music2 } from "lucide-react";
import { useExperience } from "@/components/layout/ExperienceProvider";
import { useMusic } from "@/components/music/MusicProvider";

/** Floating play/pause button, shown once the invitation is open. */
export function MusicToggle() {
  const { phase } = useExperience();
  const { available, playing, play, pause } = useMusic();

  return (
    <AnimatePresence>
      {phase === "open" && available && (
        <motion.button
          type="button"
          onClick={playing ? pause : play}
          aria-pressed={playing}
          aria-label={playing ? "Pause music" : "Play music"}
          data-state={playing ? "playing" : "paused"}
          className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid size-12 place-items-center rounded-full border border-gold/40 bg-obsidian/75 text-gold shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md transition-colors hover:border-gold sm:right-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {playing ? (
            <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <span key={i} className="eq-bar w-[3px] rounded-full bg-gold" style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </span>
          ) : (
            <Music2 className="size-4" aria-hidden="true" />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}

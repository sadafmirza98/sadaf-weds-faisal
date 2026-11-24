import { wedding } from "@/config/wedding";
import { cn } from "@/lib/utils";

/**
 * The opening Bismillah (from `invitation.bismillah`) with its meaning in small
 * type beneath. Renders nothing when the config omits it. Screen readers get
 * the meaning only, so the script is not read out letter by letter.
 */
export function Bismillah({ className }: { className?: string }) {
  const b = wedding.invitation.bismillah;
  if (!b) return null;
  return (
    <p className={cn("flex flex-col items-center", className)}>
      <span
        lang={b.lang}
        dir="rtl"
        aria-hidden="true"
        className={cn(
          "gold-text inline-block px-2",
          // Nastaliq rises and falls far past the line box: give it room so nothing clips.
          b.lang === "ur" ? "py-[0.3em] font-urdu text-[1.2em] leading-[2]" : "py-1 font-arabic text-[1.35em] leading-[1.5]",
        )}
      >
        {b.text}
      </span>
      <span className="-mt-[0.15em] font-display text-[0.62em] italic tracking-wide text-ivory/60">{b.translation}</span>
    </p>
  );
}

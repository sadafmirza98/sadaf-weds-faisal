import { wedding } from "@/config/wedding";
import { cn } from "@/lib/utils";

/**
 * The opening Bismillah (from `invitation.bismillah`). Renders nothing when the
 * config omits it. The Arabic is read aloud via its English translation.
 */
export function Bismillah({ className, showTranslation = false }: { className?: string; showTranslation?: boolean }) {
  const b = wedding.invitation.bismillah;
  if (!b) return null;
  return (
    <p className={cn("flex flex-col items-center", className)}>
      <span lang="ar" dir="rtl" aria-hidden="true" className="gold-text inline-block px-1 py-1 font-arabic text-[1.35em] leading-[1.5]">
        {b.arabic}
      </span>
      <span className={showTranslation ? "mt-1 font-display text-[0.62em] italic tracking-wide text-ivory/55" : "sr-only"}>
        {b.translation}
      </span>
    </p>
  );
}

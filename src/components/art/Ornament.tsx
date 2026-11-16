import { cn } from "@/lib/utils";

/** Gold hairline divider with a small diamond-and-crescent centrepiece. */
export function Ornament({ className, width = "w-48" }: { className?: string; width?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3 text-gold", width, className)} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
      <svg viewBox="0 0 40 12" className="h-3 w-10 shrink-0">
        <path d="M2 6h10M28 6h10" stroke="currentColor" strokeOpacity="0.6" strokeWidth="0.6" />
        <path d="M20 1l4 5-4 5-4-5z" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="20" cy="6" r="1.2" fill="currentColor" />
        <circle cx="13.5" cy="6" r="0.8" fill="currentColor" opacity="0.7" />
        <circle cx="26.5" cy="6" r="0.8" fill="currentColor" opacity="0.7" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}

/** Section header used across the site: eyebrow · title · optional intro. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "center",
  className,
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "center" | "left";
  className?: string;
  id?: string;
}) {
  const centered = align === "center";
  return (
    <header className={cn(centered ? "mx-auto text-center" : "", "max-w-2xl", className)}>
      <p className={cn("eyebrow flex items-center gap-4", centered && "justify-center")}>
        <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
        {eyebrow}
        {centered && <span className="h-px w-8 bg-gold/50" aria-hidden="true" />}
      </p>
      <h2 id={id} className="display-title mt-6 text-[clamp(2.6rem,6.5vw,4.75rem)] italic text-balance">
        {title}
      </h2>
      {intro && <p className={cn("body-copy mt-6 text-pretty", centered && "mx-auto max-w-xl")}>{intro}</p>}
    </header>
  );
}

import Image from "next/image";
import { cn } from "@/lib/utils";

const ART = {
  "floral-corner": { src: "/illustrations/floral-corner.svg", width: 640, height: 640 },
  "floral-garland": { src: "/illustrations/floral-garland.svg", width: 1400, height: 360 },
  "floral-spray": { src: "/illustrations/floral-spray.svg", width: 420, height: 980 },
  "sakura-branch": { src: "/illustrations/sakura-branch.svg", width: 900, height: 560 },
} as const;

export type ArtName = keyof typeof ART;

/** Decorative illustration from /public/illustrations (hidden from assistive tech). */
export function Illustration({
  name,
  className,
  eager = false,
  sizes,
}: {
  name: ArtName;
  className?: string;
  /** Load immediately (above-the-fold art). */
  eager?: boolean;
  sizes?: string;
}) {
  const art = ART[name];
  return (
    <Image
      src={art.src}
      width={art.width}
      height={art.height}
      alt=""
      aria-hidden="true"
      draggable={false}
      loading={eager ? "eager" : "lazy"}
      sizes={sizes}
      className={cn("pointer-events-none select-none", className)}
    />
  );
}

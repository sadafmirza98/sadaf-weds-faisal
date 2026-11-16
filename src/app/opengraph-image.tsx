import { wedding } from "@/config/wedding";
import { resolveInvite } from "@/lib/invites";
import { ogSize, renderInviteCard } from "@/lib/og-card";

export const alt = wedding.seo.ogImageAlt;
export const size = ogSize;
export const contentType = "image/png";

/** Social preview for the plain link, generated at build time. */
export default function OpenGraphImage() {
  return renderInviteCard(resolveInvite(null)!);
}

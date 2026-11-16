import { wedding } from "@/config/wedding";
import { defaultInvite, inviteCodes, inviteForCode } from "@/lib/invites";
import { ogSize, renderInviteCard } from "@/lib/og-card";

export const alt = wedding.seo.ogImageAlt;
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return inviteCodes.map((code) => ({ code }));
}

/** Social preview for one invite link: its own events and date. */
export default async function InviteImage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return renderInviteCard(inviteForCode(code) ?? defaultInvite());
}

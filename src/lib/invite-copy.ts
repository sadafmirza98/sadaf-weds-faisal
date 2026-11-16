import type { Metadata } from "next";
import { wedding } from "@/config/wedding";
import type { Invite } from "@/types/wedding";
import { formatFullDate, formatLongDate } from "@/lib/time";
import { coupleNames, joinNames } from "@/lib/utils";

/** "Nikah, Reception and Walima" for this guest. */
export function inviteEventList(invite: Invite) {
  return joinNames(invite.events.map((e) => e.name));
}

/** The invitation message with `{events}` filled in. */
export function inviteMessage(invite: Invite) {
  return wedding.invitation.message.replace("{events}", inviteEventList(invite));
}

/** Link-preview description for this guest. */
export function inviteDescription(invite: Invite) {
  const first = invite.events[0].start;
  const sameDay = invite.events.every((e) => e.start.slice(0, 10) === first.slice(0, 10));
  const when = `${sameDay ? "on" : "from"} ${formatFullDate(first)}`;
  return `You are invited to the ${inviteEventList(invite)} of ${coupleNames} ${when} in ${wedding.locationLine.split(",")[0]}. Open the invitation to RSVP.`;
}

/** Page metadata for an invite. Next merges metadata shallowly, so openGraph/twitter are complete here. */
export function inviteMetadata(invite: Invite, url: string): Metadata {
  const title = `${coupleNames} — ${formatLongDate(invite.primary.start)}`;
  const description = inviteDescription(invite);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, siteName: coupleNames, locale: "en_GB" },
    twitter: { card: "summary_large_image", title, description },
  };
}

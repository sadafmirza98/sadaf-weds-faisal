import { wedding } from "@/config/wedding";
import type { WeddingEvent } from "@/types/wedding";

export interface Invite {
  /** The URL code, or null for the plain link. */
  code: string | null;
  /** The guest's events, in config order. */
  events: WeddingEvent[];
  /** The guest's main event: the Nikah (weddingDate) when invited, else their first event. */
  primary: WeddingEvent;
}

const byId = new Map(wedding.events.map((e) => [e.id, e]));

function build(code: string | null, ids: string[], where: string): Invite {
  const unknown = ids.filter((id) => !byId.has(id));
  if (unknown.length) throw new Error(`${where} lists unknown event id(s): ${unknown.join(", ")}. Check src/config/wedding.ts.`);
  const events = wedding.events.filter((e) => ids.includes(e.id));
  if (!events.length) throw new Error(`${where} has no events. Check src/config/wedding.ts.`);
  const primary = events.find((e) => e.start === wedding.weddingDate) ?? events[0];
  return { code, events, primary };
}

/** Every invite code, for static generation of /i/<code>. */
export const inviteCodes = Object.keys(wedding.invites.links);

/** The invite for a code (null code → the plain link). Returns null for an unknown code. */
export function resolveInvite(code: string | null): Invite | null {
  if (code === null) return build(null, wedding.invites.default, "invites.default");
  const link = Object.hasOwn(wedding.invites.links, code) ? wedding.invites.links[code] : undefined;
  return link ? build(code, link.events, `invites.links["${code}"]`) : null;
}

// Fail the build early if any invite references a missing event.
resolveInvite(null);
inviteCodes.forEach(resolveInvite);

/** ["Nikah", "Reception", "Walima"] → "Nikah, Reception and Walima". */
export function joinNames(names: string[], last = " and ") {
  return names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")}${last}${names[names.length - 1]}`;
}

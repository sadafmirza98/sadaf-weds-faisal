import { createHash } from "node:crypto";
import { defaultInviteEvents, events } from "@/config/events";
import { wedding } from "@/config/wedding";
import type { Invite } from "@/types/wedding";

/**
 * SERVER-ONLY. Invite links for every combination of events.
 *
 * A link is /i/<code>, where <code> is derived from the chosen event ids and
 * the private INVITE_SECRET. Without the secret nobody can work out the code
 * for another combination, and the code table never reaches the browser.
 *
 * Changing INVITE_SECRET changes every link — set it once, before sending any.
 */

const DEV_SECRET = "local-dev-secret";
const envSecret = process.env.INVITE_SECRET?.trim() || "";
const secret = envSecret || (process.env.NODE_ENV === "production" ? "" : DEV_SECRET);

/** False in a production build without INVITE_SECRET: only the plain link works. */
export const invitesEnabled = secret !== "";
/** True when links come from the built-in development secret (they will not match the live site). */
export const usingDevSecret = secret === DEV_SECRET;

if (process.env.NODE_ENV === "production" && !envSecret) {
  console.warn("[invites] INVITE_SECRET is not set — personalised invite links and the admin page are disabled.");
}

const byId = new Map(events.map((e) => [e.id, e]));

function inviteFor(ids: string[], where: string): Invite {
  const unknown = ids.filter((id) => !byId.has(id));
  if (unknown.length) throw new Error(`${where} lists unknown event id(s): ${unknown.join(", ")}. Check src/config/events.ts.`);
  const chosen = events.filter((e) => ids.includes(e.id));
  if (!chosen.length) throw new Error(`${where} has no events. Check src/config/events.ts.`);
  return { events: chosen, primary: chosen.find((e) => e.start === wedding.weddingDate) ?? chosen[0] };
}

/** Stable key for a set of event ids, independent of order. */
export const setKey = (ids: string[]) => [...ids].sort().join(",");

function codeFor(ids: string[]) {
  return createHash("sha256").update(`${secret}|${setKey(ids)}`).digest("hex").slice(0, 10);
}

/** Every non-empty combination of events, in config order. */
const combinations: string[][] = [];
for (let mask = 1; mask < 1 << events.length; mask++) {
  combinations.push(events.filter((_, i) => mask & (1 << i)).map((e) => e.id));
}

const codeToIds = new Map<string, string[]>();
const keyToCode = new Map<string, string>();
if (invitesEnabled) {
  for (const ids of combinations) {
    const code = codeFor(ids);
    if (codeToIds.has(code)) throw new Error("Invite code collision — change INVITE_SECRET.");
    codeToIds.set(code, ids);
    keyToCode.set(setKey(ids), code);
  }
}

/** The plain link's invite. */
export function defaultInvite(): Invite {
  return inviteFor(defaultInviteEvents, "defaultInviteEvents");
}

/** The invite behind a code, or null if the code is unknown. */
export function inviteForCode(code: string): Invite | null {
  const ids = codeToIds.get(code);
  return ids ? inviteFor(ids, `invite ${code}`) : null;
}

/**
 * Every code, for prebuilding /i/<code> pages. Cache Components needs at least
 * one entry, so without a secret a placeholder is returned (it renders the 404).
 */
export const inviteCodes = codeToIds.size ? [...codeToIds.keys()] : ["unavailable"];

/** True only for the admin page's secret path segment. */
export function isAdminKey(key: string) {
  return invitesEnabled && key === secret;
}

/** Everything the admin page needs: the events and a code for every combination. */
export function adminData() {
  return {
    events: events.map(({ id, name, start }) => ({ id, name, start })),
    defaultIds: defaultInviteEvents,
    codes: Object.fromEntries(keyToCode),
    usingDevSecret,
  };
}

// Fail the build early if the plain link names a missing event.
defaultInvite();

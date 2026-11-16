import type { WeddingEvent } from "@/types/wedding";
import type { RsvpFormValues } from "@/components/rsvp/schema";
import { formatTime, hasTime, parseLocal, weekdayOf, monthOf } from "@/lib/time";
import { coupleNames, joinNames } from "@/lib/utils";

/** "+91 84337 83337" → "918433783337" (the format wa.me expects). */
export function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

/** Opens a WhatsApp chat with `phone`, optionally with a pre-written message. */
export function whatsappUrl(phone: string, text?: string) {
  const base = `https://wa.me/${phoneDigits(phone)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

function eventLabel(e: WeddingEvent) {
  const p = parseLocal(e.start);
  const when = `${weekdayOf(e.start).slice(0, 3)} ${p.day} ${monthOf(e.start).slice(0, 3)}`;
  return `${e.name} (${when}${hasTime(e.start) ? `, ${formatTime(e.start)}` : ""})`;
}

/** The RSVP as a WhatsApp message the guest sends themselves. Lists the events on their invite. */
export function rsvpMessage(v: RsvpFormValues, invited: WeddingEvent[]) {
  const lines = [`Assalamu Alaikum! RSVP for ${coupleNames}'s wedding`, "", `Name: ${v.name}`];
  lines.push(v.attending === "yes" ? "Reply: Joyfully accepts" : "Reply: Regretfully declines");
  if (v.attending === "yes") lines.push(`Guests: ${v.attendees} (including me)`);
  lines.push(`Invited to: ${invited.map(eventLabel).join(", ")}`);
  if (v.message) lines.push("", `Message: ${v.message}`);
  return lines.join("\n");
}

/** The message the couple sends a guest with their personal link (admin page). */
export function inviteShareMessage(guest: string, eventNames: string[], link: string) {
  const hello = guest.trim() ? `Assalamu Alaikum ${guest.trim()}!` : "Assalamu Alaikum!";
  return `${hello}\n\nWith the blessings of Allah, we would be honoured to have you with us at our ${joinNames(eventNames)}.\n\nYour invitation: ${link}\n\n— ${coupleNames}`;
}

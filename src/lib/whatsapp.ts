import { wedding } from "@/config/wedding";
import type { RsvpFormValues } from "@/components/rsvp/schema";
import { formatTime, hasTime, parseLocal, weekdayOf, monthOf } from "@/lib/time";
import { coupleNames } from "@/lib/utils";

/** "+91 84337 83337" → "918433783337" (the format wa.me expects). */
export function phoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

/** Opens a WhatsApp chat with `phone`, optionally with a pre-written message. */
export function whatsappUrl(phone: string, text?: string) {
  const base = `https://wa.me/${phoneDigits(phone)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

function eventLabel(id: string) {
  const e = wedding.events.find((x) => x.id === id);
  if (!e) return id;
  const p = parseLocal(e.start);
  const when = `${weekdayOf(e.start).slice(0, 3)} ${p.day} ${monthOf(e.start).slice(0, 3)}`;
  return `${e.name} (${when}${hasTime(e.start) ? `, ${formatTime(e.start)}` : ""})`;
}

/** The RSVP as a WhatsApp message the guest sends themselves. */
export function rsvpMessage(v: RsvpFormValues) {
  const lines = [`Assalamu Alaikum! RSVP for ${coupleNames}'s wedding`, "", `Name: ${v.name}`];
  if (v.attending === "yes") {
    lines.push(
      "Reply: Joyfully accepts",
      `Guests: ${v.attendees} (including me)`,
      `Joining: ${wedding.events.filter((e) => v.events.includes(e.id)).map((e) => eventLabel(e.id)).join(", ")}`,
    );
  } else {
    lines.push("Reply: Regretfully declines");
  }
  if (v.message) lines.push("", `Message: ${v.message}`);
  return lines.join("\n");
}

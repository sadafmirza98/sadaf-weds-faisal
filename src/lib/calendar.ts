import type { LocalDateTime, WeddingEvent } from "@/types/wedding";
import { formatTime, hasTime, parseLocal, zonedTimeToUtc } from "@/lib/time";
import { mapsUrl } from "@/lib/maps";
import { joinNames } from "@/lib/utils";

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

function escapeIcs(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

/** "20261219" for a local date, optionally shifted by whole days. */
function dateStamp(value: string, addDays = 0) {
  const p = parseLocal(value);
  return new Date(Date.UTC(p.year, p.month - 1, p.day + addDays)).toISOString().slice(0, 10).replace(/-/g, "");
}

/**
 * Start/end of an event. Date-only events become all-day entries (the end date
 * is exclusive, per RFC 5545); timed events without an end use the start.
 */
function eventSpan(event: WeddingEvent, timeZone: string) {
  if (!parseLocal(event.start).hasTime) {
    return { allDay: true, start: dateStamp(event.start), end: dateStamp(event.start, 1) };
  }
  const start = stamp(zonedTimeToUtc(event.start, timeZone));
  const end = event.end ? stamp(zonedTimeToUtc(event.end, timeZone)) : start;
  return { allDay: false, start, end };
}

function details(event: WeddingEvent) {
  return [event.description, event.dressCode && `Dress code: ${event.dressCode.label}`].filter(Boolean).join("\n\n");
}

export interface Moment {
  time: string;
  title: string;
  note?: string;
}

/**
 * One day of a guest's celebrations (their events on that day, in time order):
 * its running order (each event plus extra moments such as the Rukhsati), when it
 * ends, its venue, and the whole day as a single calendar entry.
 */
export function planDay(events: WeddingEvent[]) {
  const [first] = events;
  const names = joinNames(
    events.map((e) => e.name),
    " & ",
  );
  const timed = hasTime(first.start);

  const moments: Moment[] = timed
    ? events
        .flatMap((e) => [{ time: e.start as string, title: e.name, note: e.note }, ...(e.schedule ?? [])])
        .sort((a, b) => a.time.localeCompare(b.time))
    : [];
  // The day ends at the latest end time or extra moment, if it is after the start.
  const lastMoment = [...events.map((e) => e.end), ...moments.map((m) => m.time)]
    .filter((t): t is string => Boolean(t))
    .sort()
    .pop();
  const end = timed && lastMoment && lastMoment > first.start ? (lastMoment as LocalDateTime) : undefined;
  const venue = events.find((e) => e.venue)?.venue;

  const calendarEvent: WeddingEvent = {
    id: `day-${first.start.slice(0, 10)}`,
    name: names,
    kicker: first.kicker,
    start: first.start,
    end,
    venue,
    description: [
      first.description,
      moments.length > 1 ? moments.map((m) => `${formatTime(m.time)}  ${m.title}`).join("\n") : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
  };

  return { first, names, timed, moments, end, venue, calendarEvent };
}

/** The guest's events on the same day as their primary event. */
export function primaryDayEvents(events: WeddingEvent[], primary: WeddingEvent) {
  const day = primary.start.slice(0, 10);
  return events.filter((e) => e.start.startsWith(day));
}

/** Google Calendar "add event" URL. */
export function googleCalendarUrl(event: WeddingEvent, timeZone: string, title: string) {
  const { start, end } = eventSpan(event, timeZone);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${title} — ${event.name}`,
    dates: `${start}/${end}`,
    details: event.venue ? `${details(event)}\n\nDirections: ${mapsUrl(event.venue)}` : details(event),
    location: event.venue ? `${event.venue.name}, ${event.venue.address}` : "",
    ctz: timeZone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** RFC 5545 calendar file contents for Apple Calendar / Outlook. */
export function buildIcs(event: WeddingEvent, timeZone: string, title: string) {
  const span = eventSpan(event, timeZone);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}-${span.start}@wedding-invitation`,
    `DTSTAMP:${stamp(new Date())}`,
    span.allDay ? `DTSTART;VALUE=DATE:${span.start}` : `DTSTART:${span.start}`,
    span.allDay ? `DTEND;VALUE=DATE:${span.end}` : `DTEND:${span.end}`,
    `SUMMARY:${escapeIcs(`${title} — ${event.name}`)}`,
    `DESCRIPTION:${escapeIcs(details(event))}`,
    ...(event.venue ? [`LOCATION:${escapeIcs(`${event.venue.name}, ${event.venue.address}`)}`, `URL:${mapsUrl(event.venue)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

/** Trigger a client-side download of the event's .ics file. */
export function downloadIcs(event: WeddingEvent, timeZone: string, title: string) {
  const blob = new Blob([buildIcs(event, timeZone, title)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.id}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

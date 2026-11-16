import type { LocalMoment } from "@/types/wedding";

/**
 * Timezone-aware helpers with zero dependencies.
 *
 * Wedding times are authored as wall-clock times in the venue's IANA
 * timezone. `zonedTimeToUtc` converts them to absolute instants (correct
 * across DST changes) so the countdown is accurate for guests anywhere.
 *
 * Display formatting is computed from the authored wall-clock parts rather
 * than `Intl`, so server and client render identical strings (no hydration
 * mismatches from ICU differences) and guests always see venue-local times.
 */

interface Parts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  /** false for date-only values ("time to be announced"). */
  hasTime: boolean;
}

const LOCAL_RE = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/;

export function parseLocal(value: LocalMoment | string): Parts {
  const m = LOCAL_RE.exec(value);
  if (!m) throw new Error(`Invalid local date "${value}". Expected "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm".`);
  return {
    year: Number(m[1]),
    month: Number(m[2]),
    day: Number(m[3]),
    hour: Number(m[4] ?? 0),
    minute: Number(m[5] ?? 0),
    hasTime: m[4] !== undefined,
  };
}

/** True when the value carries a time ("2026-12-19T19:00"), false for date-only. */
export function hasTime(value: LocalMoment | string) {
  return parseLocal(value).hasTime;
}

const dtfCache = new Map<string, Intl.DateTimeFormat>();
function formatterFor(timeZone: string) {
  let dtf = dtfCache.get(timeZone);
  if (!dtf) {
    dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    dtfCache.set(timeZone, dtf);
  }
  return dtf;
}

/** Offset (ms) between `timeZone` wall-clock and UTC at a given instant. */
function tzOffset(instant: number, timeZone: string): number {
  const parts = formatterFor(timeZone).formatToParts(new Date(instant));
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute"), get("second"));
  return asUtc - Math.floor(instant / 1000) * 1000;
}

/** Convert a wall-clock time in `timeZone` to an absolute Date. */
export function zonedTimeToUtc(value: LocalMoment | string, timeZone: string): Date {
  const p = parseLocal(value);
  const naive = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  const first = naive - tzOffset(naive, timeZone);
  const second = naive - tzOffset(first, timeZone);
  return new Date(second);
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function weekdayOf(value: LocalMoment | string) {
  const p = parseLocal(value);
  return WEEKDAYS[new Date(Date.UTC(p.year, p.month - 1, p.day)).getUTCDay()];
}

export function monthOf(value: LocalMoment | string) {
  return MONTHS[parseLocal(value).month - 1];
}

/** "12 June 2027" */
export function formatLongDate(value: LocalMoment | string) {
  const p = parseLocal(value);
  return `${p.day} ${MONTHS[p.month - 1]} ${p.year}`;
}

/** "Saturday, 12 June 2027" */
export function formatFullDate(value: LocalMoment | string) {
  return `${weekdayOf(value)}, ${formatLongDate(value)}`;
}

/** "12 · 06 · 2027" */
export function formatDottedDate(value: LocalMoment | string) {
  const p = parseLocal(value);
  return `${String(p.day).padStart(2, "0")} · ${String(p.month).padStart(2, "0")} · ${p.year}`;
}

/** "3:00 pm" */
export function formatTime(value: LocalMoment | string) {
  const { hour, minute } = parseLocal(value);
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "am" : "pm"}`;
}

/** "3:00 pm – 4:30 pm" (notes when the end falls on the next day); "From 3:00 pm" without an end. */
export function formatTimeRange(start: LocalMoment | string, end?: LocalMoment | string) {
  if (!end || !hasTime(end)) return `From ${formatTime(start)}`;
  const s = parseLocal(start);
  const e = parseLocal(end);
  const sameDay = s.year === e.year && s.month === e.month && s.day === e.day;
  return `${formatTime(start)} – ${formatTime(end)}${sameDay ? "" : " (next day)"}`;
}

export interface TimeLeft {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function timeLeftUntil(target: number, now: number): TimeLeft {
  const total = Math.max(0, target - now);
  const s = Math.floor(total / 1000);
  return {
    total,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

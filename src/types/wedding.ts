/**
 * Shape of the central wedding configuration (src/config/wedding.ts).
 * Every component reads wedding details from that object — never hardcode.
 */

/** Local calendar date in the wedding timezone, e.g. "2026-12-19". */
export type LocalDate = `${number}-${number}-${number}`;

/** Local wall-clock date-time in the wedding timezone, e.g. "2026-12-19T19:00". */
export type LocalDateTime = `${number}-${number}-${number}T${number}:${number}`;

/**
 * A date with or without a time. Date-only values mean "time to be announced":
 * the site shows the date, calendar entries become all-day events and the
 * countdown runs to the start of that day.
 */
export type LocalMoment = LocalDate | LocalDateTime;

export interface Person {
  firstName: string;
  fullName: string;
  /**
   * Parents' line as on a Nikah card, e.g. { relation: "Daughter of", parents: "Mr. & Mrs. …" }.
   * The families block is shown only when at least one partner has it.
   */
  family?: { relation: string; parents: string };
}

export interface Couple {
  partnerOne: Person;
  partnerTwo: Person;
  /** Shown on the wax seal and favicon, e.g. "E & K". Two letters work best. */
  monogram: [string, string];
}

export interface Venue {
  name: string;
  address: string;
  /**
   * Optional explicit Google Maps URL. When omitted, a search URL is built
   * from `name` + `address`.
   */
  mapsUrl?: string;
}

export interface DressCode {
  label: string;
  note?: string;
  /** Up to four colour swatches suggesting the palette for guests. */
  swatches?: string[];
}

/** One moment in an event's running order, e.g. 7:00 pm Nikah. */
export interface ScheduleItem {
  time: LocalDateTime;
  title: string;
  note?: string;
}

export interface WeddingEvent {
  id: string;
  name: string;
  /** Short lead-in shown above the name, e.g. "The Vows". */
  kicker: string;
  /** Date-only ("2026-12-19") until the timing is confirmed. */
  start: LocalMoment;
  /** Optional end time; ignored when `start` has no time. */
  end?: LocalDateTime;
  venue: Venue;
  /** Optional; the attire row is hidden when omitted. */
  dressCode?: DressCode;
  description: string;
  /**
   * Optional extra moments after the start, e.g. the Bidai at the end of the
   * Reception. Shown on the event card and in the day-by-day itinerary.
   */
  schedule?: ScheduleItem[];
  /** Countdown eyebrow when this is the guest's main event, e.g. "Until we say Qubool Hai". */
  countdownLabel?: string;
}

/** One personalised invite link: /i/<code> shows only these events. */
export interface InviteLink {
  /** For your reference only (who this link is for) — never shown to guests. */
  label: string;
  /** Ids from `events` that this link shows. */
  events: string[];
}

export interface Invites {
  /** Events shown by the plain link without a code ("/"). */
  default: string[];
  /** Code → invite. Each code is served at /i/<code>. Use hard-to-guess codes. */
  links: Record<string, InviteLink>;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface RsvpSettings {
  enabled: boolean;
  /** Optional: the form closes after this moment (wedding timezone). */
  deadline?: LocalDateTime;
  /** Maximum attendees one response may include (including the guest). */
  maxAttendees: number;
}

export interface Contact {
  eyebrow: string;
  /** Shown as written, e.g. "+91 84337 83337". Also the WhatsApp number RSVPs are sent to. */
  phone: string;
}

export interface EasterEggs {
  /** Revealed after clicking the hero moon three times. */
  moonMessage: string;
  /** The folded note hidden behind the small seal in the closing section. */
  secretLetter: { salutation: string; body: string; signature: string };
}

export interface SeoSettings {
  /** Production URL, used for canonical and Open Graph URLs. */
  siteUrl: string;
  title: string;
  description: string;
  ogImageAlt: string;
  /** false → search engines are asked not to index (link previews still work). */
  allowIndexing: boolean;
}

export interface WeddingConfig {
  couple: Couple;
  /** IANA timezone of the wedding location, e.g. "Europe/London". */
  timeZone: string;
  /** Name shown next to venue times, e.g. "Mumbai time". Defaults to the zone's city. */
  timeZoneLabel?: string;
  /** Primary moment the countdown targets (usually the ceremony start). */
  weddingDate: LocalMoment;
  locationLine: string;
  invitation: {
    /** Optional opening line shown above everything else (e.g. the Bismillah). */
    bismillah?: { arabic: string; translation: string };
    eyebrow: string;
    /** `{events}` is replaced with the guest's invited events, e.g. "Nikah, Reception and Walima". */
    message: string;
    openLabel: string;
  };
  /** The hero eyebrow lists the guest's invited events automatically. */
  hero: {
    message: string;
  };
  /** The verse after the hero, and the heading over the parents' names. */
  blessing: {
    verse: string;
    cite: string;
    familiesEyebrow: string;
  };
  celebrations: {
    eyebrow: string;
    title: string;
    intro: string;
    /** Shown in place of the time for events authored without one. */
    timeToBeAnnounced: string;
  };
  events: WeddingEvent[];
  /** Personalised links — who sees which events. */
  invites: Invites;
  countdown: {
    eyebrow: string;
    title: string;
    celebrationTitle: string;
    celebrationMessage: string;
  };
  /** The "Save the Date" month calendar. */
  saveTheDate: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  rsvp: RsvpSettings & {
    eyebrow: string;
    title: string;
    intro: string;
  };
  contact: Contact;
  closing: {
    eyebrow: string;
    message: string;
    signOff: string;
  };
  nav: NavItem[];
  easterEggs: EasterEggs;
  seo: SeoSettings;
}

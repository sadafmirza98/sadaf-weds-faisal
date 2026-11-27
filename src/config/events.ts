import type { Venue, WeddingEvent } from "@/types/wedding";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EVENTS — server-side only.
 *
 *  Never import this file from a "use client" component. Pages pick the events
 *  on a guest's invite here and pass only those to the browser, so a guest's
 *  page never contains the details of events they are not invited to.
 *
 *  Times are wall-clock times in `wedding.timeZone`: "YYYY-MM-DDTHH:mm", or
 *  "YYYY-MM-DD" while the time is unknown. List events in date order.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const banquet: Venue = {
  name: "The Grand FM Banquet",
  address:
    "Dilshad Banquet, 1st Floor, E.E. Heights, above Jaffer Bhai's Delhi Darbar Restaurant, Jogeshwari West, Mumbai 400102",
  mapsUrl:
    "http://google.com/maps/place/The+Grand+FM+Banquet/@19.1374952,72.8458317,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7b631b5978847:0x9570c62616af2660!8m2!3d19.1374952!4d72.8458317!16s%2Fg%2F11cp7fdv_p?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D",
  // The pin from the Google Maps place link above (!3d…!4d…).
  coordinates: { lat: 19.1374952, lng: 72.8458317 },
};

export const events: WeddingEvent[] = [
  {
    id: "haldi",
    kicker: "The Glow",
    name: "Haldi",
    start: "2026-12-17T15:00", // ✎ confirm time ("probably 3 pm")
    // venue: { name: "…", address: "…", mapsUrl: "…" },  ✎ add when known
    description:
      "An afternoon of turmeric, laughter and blessings with our families before the wedding.",
  },
  {
    id: "mehndi",
    kicker: "The Henna",
    name: "Mehndi",
    start: "2026-12-17T15:00", // ✎ confirm time ("probably 3 pm")
    // venue: { … },  ✎ add when known
    description:
      "Henna, laughter and celebration with our families and friends.",
  },
  {
    id: "nikah",
    kicker: "Qubool Hai",
    name: "Nikah",
    start: "2026-12-19T19:00",
    end: "2026-12-19T20:00",
    venue: banquet,
    inCalendarList: false, // the list under the calendar shows Reception for the 19th
    note: "Our sacred vow — we each say “Qubool Hai” and two lives become one.",
    description:
      "We will be joined in marriage in the presence of our families and loved ones. Your presence and your duas would mean the world to us.",
  },
  {
    id: "reception",
    kicker: "The Celebration",
    name: "Reception",
    start: "2026-12-19T20:00",
    end: "2026-12-19T23:00",
    venue: banquet,
    note: "A feast and an evening of joy with everyone we love, to celebrate our new beginning.",
    description:
      "An evening of celebration with our families and friends, ending with the Rukhsati.",
    schedule: [
      {
        time: "2026-12-19T23:00",
        title: "Rukhsati",
        note: "The bride’s farewell, as she leaves her family home wrapped in their duas.",
      },
    ],
  },
  {
    id: "walima",
    kicker: "The Feast",
    name: "Walima",
    start: "2026-12-20T19:00",
    venue: banquet,
    listed: false, // heart on 20 Dec only — not named in the invitation wording
    description:
      "Join us for our Walima, the wedding feast, as we celebrate our first day as husband and wife.",
  },
];

/**
 * What the plain link (https://<your-domain>/) shows. Every other guest gets a
 * personalised link from the admin page — see README › "Invite links".
 */
export const defaultInviteEvents: string[] = ["nikah", "reception", "walima"];

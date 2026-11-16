import type { Venue, WeddingConfig } from "@/types/wedding";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — the only file you need to edit to personalise
 *  the invitation.
 *
 *  Values marked  ✎ REPLACE  are placeholders or still need confirming.
 *  Dates are in `timeZone`: "YYYY-MM-DD" (time to be announced) or
 *  "YYYY-MM-DDTHH:mm" once the time is fixed — the whole site adapts.
 *  Images live in /public — see README › "Replacing images".
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Both celebrations are held here. */
const banquet: Venue = {
  name: "The Grand FM Banquet",
  address:
    "Dilshad Banquet, 1st Floor, E.E. Heights, above Jaffer Bhai's Delhi Darbar Restaurant, Jogeshwari West, Mumbai 400102",
  mapsUrl: "https://maps.app.goo.gl/AbPtDVY8sa2EQvLb8",
};

export const wedding: WeddingConfig = {
  couple: {
    partnerOne: {
      firstName: "Sadaf",
      fullName: "Sadaf Mirza",
      family: { relation: "Daughter of", parents: "Mrs. Mehrunnisa Mirza & Mr. Zaheer Mirza" },
    },
    partnerTwo: {
      firstName: "Faisal",
      fullName: "Faisal Khan",
      family: { relation: "Son of", parents: "Mrs. Fatima Khan & Mr. Mohd Afzal Khan" },
    },
    monogram: ["S", "F"],
  },

  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  // The Nikah. Guests invited to it count down to it; others count down to their first event.
  weddingDate: "2026-12-19T19:00",
  locationLine: "Mumbai, India",

  invitation: {
    bismillah: {
      arabic: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      translation: "In the name of Allah, the Most Gracious, the Most Merciful",
    },
    eyebrow: "Together with their families",
    // {events} becomes the guest's invited events, e.g. "Nikah, Reception and Walima".
    message: "request the honour of your presence at their {events}, beneath a crimson moon and a sky of falling petals.",
    openLabel: "Open the invitation",
  },

  hero: {
    message:
      "With the blessings of Allah and the duas of our families, we begin a new chapter together — and we would love for you to be there.",
  },

  blessing: {
    verse:
      "And of His signs is that He created for you from yourselves mates that you may find tranquillity in them; and He placed between you affection and mercy.",
    cite: "Surah Ar-Rum · 30:21",
    familiesEyebrow: "With the blessings of our families",
  },

  celebrations: {
    eyebrow: "Celebrations",
    title: "Beneath the crimson moon",
    intro: "Everything you need to find your way to us.",
    timeToBeAnnounced: "Timings to follow",
  },

  // Add Haldi and Mehndi here once their dates, times and venue are fixed,
  // then add their ids to the invite links below.
  events: [
    {
      id: "nikah",
      kicker: "Qubool Hai",
      name: "Nikah",
      start: "2026-12-19T19:00",
      end: "2026-12-19T20:00",
      venue: banquet,
      countdownLabel: "Until we say Qubool Hai",
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
      description: "An evening of celebration with our families and friends, ending with the Bidai.",
      schedule: [{ time: "2026-12-19T23:00", title: "Bidai", note: "The bride's farewell" }],
    },
    {
      id: "walima",
      kicker: "The Feast",
      name: "Walima",
      start: "2026-12-20T19:00",
      venue: banquet,
      description: "Join us for our Walima, the wedding feast, as we celebrate our first day as husband and wife.",
    },
  ],

  /**
   * Personalised links. Send each guest the link for their group:
   *   https://<your-domain>/i/<code>  shows only that group's events.
   * The plain link (https://<your-domain>/) shows `default`.
   * Codes are random so guests cannot guess each other's links.
   */
  invites: {
    default: ["nikah", "reception", "walima"],
    links: {
      "nc73rr": { label: "Everything (add Haldi & Mehndi once listed)", events: ["nikah", "reception", "walima"] },
      "r6hfpr": { label: "Nikah only", events: ["nikah"] },
      "qbfp3u": { label: "Walima only", events: ["walima"] },
    },
  },

  countdown: {
    eyebrow: "Until we celebrate together",
    title: "Counting every moment",
    celebrationTitle: "Alhamdulillah — the day is here",
    celebrationMessage:
      "The moment has arrived. Thank you for your love and your duas — we will see you under the crimson moon.",
  },

  saveTheDate: {
    eyebrow: "Save the Date",
    title: "Mark your calendar",
    intro: "Held close to our hearts — we cannot wait to celebrate with you.",
  },

  rsvp: {
    eyebrow: "Kindly Reply",
    title: "Will you join us?",
    intro: "Fill in your reply and send it to us on WhatsApp in one tap, so we can prepare a place for you.",
    enabled: true,
    // deadline: "2026-12-12T23:59",  ✎ optional — the form closes after this moment
    maxAttendees: 4, // ✎ confirm — guests per reply, including the guest
  },

  contact: {
    eyebrow: "For any queries",
    phone: "+91 84337 83337", // also receives the WhatsApp RSVPs
  },

  closing: {
    eyebrow: "With all our love",
    message:
      "Thank you for the love, the laughter and the duas that brought us here. Your presence is the greatest gift we could ask for, and we cannot wait to celebrate with you.",
    signOff: "Until the moon rises,",
  },

  nav: [
    { id: "celebrations", label: "Celebrations" },
    { id: "countdown", label: "Countdown" },
    { id: "calendar", label: "Save the Date" },
    { id: "rsvp", label: "RSVP" },
  ],

  easterEggs: {
    moonMessage:
      "Under every moon, in every lifetime — I would still find you.",
    secretLetter: {
      salutation: "To whoever found this,",
      body: "You must be the curious kind. We like that. Keep us in your duas.",
      signature: "S & F",
    },
  },

  seo: {
    siteUrl: "https://sadaf-and-faisal.vercel.app", // ✎ REPLACE with your real domain (or set NEXT_PUBLIC_SITE_URL)
    // Fallback title; each invite link gets "Sadaf & Faisal — <its main date>".
    title: "Sadaf & Faisal — Wedding Invitation",
    description:
      "You are invited to the Nikah & Reception of Sadaf & Faisal on 19 December 2026 and their Walima on 20 December 2026 in Mumbai. Open the invitation to RSVP.",
    ogImageAlt: "Sadaf & Faisal wedding invitation beneath a crimson moon",
    allowIndexing: false, // private invitation by default
  },
};

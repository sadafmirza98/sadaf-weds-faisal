import type { WeddingConfig } from "@/types/wedding";

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

export const wedding: WeddingConfig = {
  couple: {
    partnerOne: {
      firstName: "Sadaf",
      fullName: "Sadaf Mirza",
      family: {
        relation: "Daughter of",
        parents: "Mrs. Mehrunnisa Mirza & Mr. Zaheer Mirza",
      },
    },
    partnerTwo: {
      firstName: "Faisal",
      fullName: "Faisal Khan",
      family: {
        relation: "Son of",
        parents: "Mrs. Fatima Khan & Mr. Mohd Afzal Khan",
      },
    },
    monogram: ["S", "F"],
  },

  timeZone: "Asia/Kolkata",
  timeZoneLabel: "IST",
  // The Nikah. Every guest's countdown runs to this moment.
  weddingDate: "2026-12-19T19:00",
  locationLine: "Mumbai, India",

  invitation: {
    bismillah: {
      arabic: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      translation: "In the name of Allah, the Most Gracious, the Most Merciful",
    },
    eyebrow: "Together with their families",
    // {events} becomes the guest's invited events, e.g. "Nikah, Reception and Walima".
    message:
      "request the honour of your presence at their {events}, as they begin their life together.",
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
    title: "Join us in celebration",
    intro: "Everything you need to find your way to us.",
    timeToBeAnnounced: "Timings to follow",
    venueToBeAnnounced: "Venue to follow",
  },

  countdown: {
    eyebrow: "Until we say Qubool Hai",
    title: "Counting every moment",
    celebrationTitle: "Alhamdulillah — the day is here",
    celebrationMessage:
      "The moment has arrived. Thank you for your love and your duas — we cannot wait to celebrate with you.",
  },

  saveTheDate: {
    eyebrow: "Save the Date",
    title: "Mark your calendar",
    intro: "Held close to our hearts — we cannot wait to celebrate with you.",
  },

  rsvp: {
    eyebrow: "Kindly Reply",
    title: "Will you join us?",
    intro:
      "Fill in your reply and send it to us on WhatsApp in one tap, so we can prepare a place for you.",
    enabled: true,
    // deadline: "2026-12-12T23:59",  ✎ optional — the form closes after this moment
    maxAttendees: 4, // ✎ confirm — guests per reply, including the guest
  },

  // Starts when the guest taps the wax seal; a button lets them pause it.
  music: {
    youtubeId: "RMMNmCTEkWc", // "Suzume (Instrumental)" — https://youtu.be/RMMNmCTEkWc
    volume: 55,
  },

  contact: {
    eyebrow: "For any queries",
    phone: "+91 84337 83337", // also receives the WhatsApp RSVPs
  },

  closing: {
    eyebrow: "With all our love",
    message:
      "Thank you for the love, the laughter and the duas that brought us here. Your presence is the greatest gift we could ask for, and we cannot wait to celebrate with you.",
    signOff: "With love and duas,",
    developedBy: "Sadaf Mirza",
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
      signature: "SaFal",
    },
  },

  seo: {
    // Fallback only: Netlify/Vercel builds use the deployed address automatically,
    // or set NEXT_PUBLIC_SITE_URL for a custom domain.
    siteUrl: "https://sadaf-weds-faisal.netlify.app",
    // Fallback title; each invite link gets "Sadaf & Faisal — <its main date>".
    title: "Sadaf & Faisal — Wedding Invitation",
    // Fallback only — each page describes the guest's own events.
    description:
      "You are invited to the wedding celebrations of Sadaf & Faisal in Mumbai. Open the invitation to RSVP.",
    ogImageAlt: "Sadaf & Faisal wedding invitation",
    allowIndexing: false, // private invitation by default
  },
};

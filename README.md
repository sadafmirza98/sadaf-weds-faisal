# Crimson Moon — Wedding Invitation

A cinematic, dark-burgundy wedding invitation website built with Next.js 16, React 19, Tailwind CSS 4 and Motion. It opens with a sealed invitation cover. Breaking the wax seal parts two curtains to reveal the site: a hero beneath a crimson moon, a Quran verse and the families, the celebrations with each evening's timeline, a live countdown, a "Save the Date" calendar, an RSVP that is sent on WhatsApp, and a closing note.

All wedding details live in **one file**: [`src/config/wedding.ts`](src/config/wedding.ts).

---

## Quick start

Requires **Node.js 20.9+**.

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script              | What it does                                                   |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Local development server                                       |
| `npm run build`     | Production build (all routes prerendered as static content)    |
| `npm start`         | Serve the production build                                     |
| `npm run typecheck` | TypeScript check                                               |
| `npm run lint`      | ESLint                                                         |
| `npm run check`     | typecheck + lint + build                                       |
| `npm run art`       | Regenerate the illustrated SVG artwork (see *Images*)          |

Useful URLs while testing:

- `/?open=1` skips the invitation cover. Any `#section` deep link (for example `/#rsvp`) skips it too.
- The cover is shown once per browser tab session. Open a new tab or a private window to see it again.

---

## Deploying

The site needs no environment variables and no backend. RSVPs are sent on WhatsApp (see *RSVP*).

**Vercel:** import the repository and accept the defaults. The canonical/OG URL falls back to the project's production domain automatically.

**Netlify:** import the repository. `netlify.toml` already sets the build command, and Netlify applies its Next.js adapter automatically.

Optional variables (see [`.env.example`](.env.example)):

| Variable                    | Purpose                                                      |
| --------------------------- | ------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`      | Absolute URL used for canonical and Open Graph links         |

`NEXT_PUBLIC_*` values are embedded in the browser bundle, so never put a secret key in one.

---

## Customising the wedding details

Edit [`src/config/wedding.ts`](src/config/wedding.ts). Every placeholder is marked **`✎ REPLACE`**.

| Area                    | Config key                                           |
| ----------------------- | ---------------------------------------------------- |
| Names & monogram        | `couple`                                             |
| Date & timezone         | `weddingDate`, `timeZone` (IANA, e.g. `Asia/Kolkata`), `timeZoneLabel` (e.g. `IST`) |
| Bismillah               | `invitation.bismillah` (remove it to hide the line)   |
| Invitation cover text   | `invitation`                                         |
| Hero text               | `hero.message` (the line above the names lists the guest's events) |
| Verse & families        | `blessing` (verse, reference); parents via `couple.partnerOne/Two.family` — the families block shows once set |
| Events (any number)     | `events[]`: name, start/end, venue, optional dress code, description, optional `schedule[]` timeline |
| Google Maps links       | `events[].venue.mapsUrl` (optional; otherwise built from name + address) |
| Countdown copy          | `countdown`                                          |
| Save the Date calendar  | `saveTheDate` (the month comes from the guest's main event; every invited day gets a heart) |
| Personalised links      | `invites` — see *Personalised invite links* |
| RSVP settings           | `rsvp`: optional deadline, max guests per reply          |
| Contact & WhatsApp      | `contact.phone` — shown on the site and receives the WhatsApp RSVPs |
| Closing message         | `closing`                                            |
| Navigation              | `nav`                                                |
| Easter-egg text         | `easterEggs`                                         |
| SEO / social sharing    | `seo`: title, description, OG alt text, `allowIndexing` |

**Dates** are written at the venue, in `timeZone`:

- `"2026-12-19"` (date only) means *time to be announced*. The event shows `celebrations.timeToBeAnnounced`, calendar links add an all-day entry, and the countdown runs to the start of that day.
- `"2026-12-19T19:00"` once the time is fixed. Add `end` for a time range. The countdown targets the exact moment, calendar entries get the real times, and guests in another timezone also see the moment in their own local time.

Daylight-saving changes are handled.

The **favicon, Apple touch icon and Open Graph share image** are generated at build time from the config (names, monogram and date), so they update when you rebuild.

**Search engines:** `seo.allowIndexing` defaults to `false`, which adds a `noindex` meta tag. Link previews in WhatsApp, iMessage and similar apps still work.

**Directions:** each venue can set an explicit `mapsUrl`. Otherwise the link searches Google Maps for the venue name and address.

---

## Replacing images

### Illustrations

All artwork is original and generated by [`scripts/generate-art.mjs`](scripts/generate-art.mjs) (seeded, so it is deterministic):

- `public/illustrations/`: floral corner, garland, vertical spray, sakura branch

To swap in commissioned artwork, replace the files at the same paths, or point to new files in [`src/components/art/Illustration.tsx`](src/components/art/Illustration.tsx). Run `npm run art` to regenerate the procedural art after you tweak palettes or compositions in the script.

The crimson moon and the wax seal are inline React components ([`CrimsonMoon.tsx`](src/components/art/CrimsonMoon.tsx), [`WaxSeal.tsx`](src/components/art/WaxSeal.tsx)). The seal shows `couple.monogram`.

---

## Personalised invite links

Different guests can be invited to different events. Each group gets its own link, and that link shows **only** their events: on the cover, in the hero, countdown, calendar hearts, event cards, itinerary, RSVP choices, and in the WhatsApp/iMessage link preview.

```ts
// src/config/wedding.ts
invites: {
  default: ["nikah", "reception", "walima"],          // the plain link  https://<domain>/
  links: {
    nc73rr: { label: "Everything", events: ["nikah", "reception", "walima"] },
    r6hfpr: { label: "Nikah only", events: ["nikah"] },
    qbfp3u: { label: "Walima only", events: ["walima"] },
  },
},
```

- Send `https://<domain>/i/nc73rr` to the first group, `…/i/r6hfpr` to the second, and so on. `label` is for you only and is never shown to guests.
- To add a group, add a line with a new random code. Every link is prebuilt at deploy time. An unknown code shows the 404 page.
- To add an event (e.g. Haldi or Mehndi), add it to `events` and put its `id` in the links that should see it. The build fails if a link names an event that does not exist.
- A guest's countdown targets the Nikah if they are invited to it, otherwise their first event.

**Limit:** this decides what each guest *sees*. It is not a password. The site is static, so every event's details ship in the page's JavaScript, and a determined, technical guest could find them. Random codes stop guests from guessing other links.

## RSVP: sent on WhatsApp

There is no backend. The form (React Hook Form + Zod) collects the guest's name, whether they can attend, which celebrations they will join, the number of guests and an optional note. It then shows the reply as a ready-written message with a **Send on WhatsApp** button. That button opens `https://wa.me/<contact.phone>?text=…`, and the guest presses send in WhatsApp.

- Replies arrive in the WhatsApp chat of `contact.phone`. Nothing is stored by the site.
- The site never claims a reply was sent. It says the reply reaches the couple once the guest presses send in WhatsApp.
- Guests can edit their reply before sending, or start a new one for another guest.
- An optional `rsvp.deadline` replaces the form with a "replies closed" message after that moment.

The message is built in [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts).

## Project structure

```
src/
  app/                 layout, page, metadata routes (icon, OG image, robots, sitemap), 404, error
  config/wedding.ts    ← all wedding content
  types/               config types
  sections/            Hero, Blessing (verse + families), Celebrations, Countdown, SaveTheDate, Rsvp, Closing
  components/
    invitation/        InvitationGate (cover, seal, curtain reveal)
    layout/            ExperienceProvider (cover state), SiteNav, MainContent
    animations/        Reveal, SplitText, PetalField (canvas), SakuraBurst
    art/               CrimsonMoon, WaxSeal, Ornament/SectionHeading, Illustration
    events/            EventComposition
    rsvp/              RsvpForm, Zod schema
  hooks/               countdown, active section, scroll lock
  lib/                 timezone maths, calendar (.ics / Google), maps, WhatsApp message, OG assets
scripts/generate-art.mjs
public/illustrations
```

## Design system

- **Palette** (Tailwind tokens in `globals.css`): `obsidian #090708`, `burgundy #400D20`, `wine #5C1029`, `crimson #741D35`, `gold #D5B98A`, `ivory #F1E7D9`, `rose #A77B82`
- **Type:** Cormorant Garamond for display (italic names, lining numerals), Playfair Display for dates and venue names, Inter for UI and body text, Amiri for the Arabic Bismillah. All are self-hosted through `next/font`.
- **Shared components:** `.eyebrow`, `.display-title`, `.btn-luxe`, `.link-luxe`, `.frame`, `.field-input`, plus `ease-silk` / `ease-curtain` easings.
- **Motion:** Motion for React throughout. GSAP was not needed. Entrances play once, the cover runs a staged timeline, and parallax runs on transforms only. Petals are a single `<canvas>` (fewer petals on phones, paused in background tabs).

## Easter eggs

- Tap the **hero moon** three times to reveal a hidden line.
- Tap the **sakura blossom** under the verse or in the closing section to scatter petals.
- Open the **small wax seal** in the closing section to read a secret note.

## Accessibility and performance

- The cover is a modal dialog: the page behind it is `inert`, focus starts in the dialog, and *Skip intro* is always available.
- `prefers-reduced-motion` turns off the petals, curtain choreography, parallax and transforms. Content still fades in.
- The mobile menu and the lightbox trap focus, close with Esc and restore focus on close. The secret note also closes with Esc. The lightbox supports ← / → keys and swipe.
- Semantic landmarks and headings, a skip link, labelled controls, visible gold focus rings, and 44 px touch targets for the icon buttons, steppers and attendance options.
- Phones: portrait layouts are tuned from 360 px wide. Phones held sideways (short landscape screens) get a compact invitation cover and a side-by-side hero via the `short:` variant in `globals.css`.
- Every route is prerendered as static content. Art is static SVG, and photos go through `next/image`.

## Known limitations

- Date and time display is English-only (for example "Saturday, 19 December 2026"). It is formatted from the authored wall-clock values so server and client always match.
- Demo-mode RSVPs are not collected anywhere the couple can see. Connect an endpoint before sending invitations.
- There is no background music. None was supplied, and autoplaying audio is blocked by browsers.

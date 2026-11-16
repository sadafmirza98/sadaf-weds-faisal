# Sadaf & Faisal — Wedding Invitation

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

## Deploying (Netlify)

1. In Netlify: **Add new site → Import an existing project → GitHub →** `sadafmirza98/sadaf-weds-faisal`. Netlify reads `netlify.toml` and applies its Next.js adapter automatically.
2. **Site configuration → Environment variables →** add `INVITE_SECRET` with a long random value (`openssl rand -hex 16`). Do this **before the first build**, and never change it once links are sent.
3. Deploy. Your private admin page is `https://<your-site>.netlify.app/admin/<INVITE_SECRET>`.

Link previews use the Netlify address automatically. For a custom domain, also set `NEXT_PUBLIC_SITE_URL`. Without `INVITE_SECRET` the site still deploys, but only the plain link works and there is no admin page.

| Variable                | Purpose                                                       |
| ----------------------- | ------------------------------------------------------------- |
| `INVITE_SECRET`         | Required for invite links and the admin page (keep it private) |
| `NEXT_PUBLIC_SITE_URL`  | Optional custom domain for canonical and link-preview URLs     |

## Customising the wedding details

Edit [`src/config/wedding.ts`](src/config/wedding.ts). Every placeholder is marked **`✎ REPLACE`**.

| Area                    | Config key                                           |
| ----------------------- | ---------------------------------------------------- |
| Names & monogram        | `couple`                                             |
| Date & timezone         | `weddingDate` (every guest's countdown target), `timeZone`, `timeZoneLabel` |
| Bismillah               | `invitation.bismillah` (remove it to hide the line)   |
| Invitation cover text   | `invitation`                                         |
| Hero text               | `hero.message` (the line above the names lists the guest's events) |
| Verse & families        | `blessing` (verse, reference); parents via `couple.partnerOne/Two.family` — the families block shows once set |
| Events (any number)     | [`src/config/events.ts`](src/config/events.ts) — name, start/end, optional venue, description, optional `schedule[]` (e.g. Bidai) |
| Plain link's events     | `defaultInviteEvents` in `src/config/events.ts` |
| Music                   | `music.youtubeId`, `music.volume` |
| Google Maps links       | `events[].venue.mapsUrl` (optional; otherwise built from name + address) |
| Countdown copy          | `countdown`                                          |
| Save the Date calendar  | `saveTheDate` (the month comes from the guest's main event; every invited day gets a heart) |
| Personalised links      | the admin page — see *Invite links* |
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

## Invite links

Different guests can be invited to different events, for example Haldi and Nikah for one guest and only the Walima for another.

1. Open your private admin page: `https://<your-site>/admin/<INVITE_SECRET>`. Locally with `npm run dev` it is `/admin/local-dev-secret`, but those links only work on your computer.
2. Tick the events for the guest. Optionally type their name.
3. **Copy link** or **Send on WhatsApp** (opens WhatsApp with a ready message).

The guest's link shows only those events: the cover, hero, timeline, cards, calendar hearts, RSVP and link preview. **Other events' details are not in their page at all**, not even in the code, because pages are built on the server per invite. The same ticks always give the same link, and links cannot be guessed without `INVITE_SECRET`. Every guest's countdown runs to the Nikah (`weddingDate`).

The plain link (`/`) shows `defaultInviteEvents`. To add an event, add it to `src/config/events.ts`. Links for every combination are built automatically, and existing links keep working.

## RSVP: sent on WhatsApp

There is no backend. The form (React Hook Form + Zod) collects the guest's name, whether they can attend, the number of guests and an optional note. The message lists the events on the guest's invite automatically. It then shows the reply as a ready-written message with a **Send on WhatsApp** button. That button opens `https://wa.me/<contact.phone>?text=…`, and the guest presses send in WhatsApp.

- Replies arrive in the WhatsApp chat of `contact.phone`. Nothing is stored by the site.
- The site never claims a reply was sent. It says the reply reaches the couple once the guest presses send in WhatsApp.
- Guests can edit their reply before sending, or start a new one for another guest.
- An optional `rsvp.deadline` replaces the form with a "replies closed" message after that moment.

The message is built in [`src/lib/whatsapp.ts`](src/lib/whatsapp.ts).

## Music

`music.youtubeId` plays a YouTube video's sound in the background. Browsers only allow sound after a tap, so the music starts when the guest taps the wax seal, fading in. A floating button lets them pause or resume it. "Skip intro" does not start music.

- It uses YouTube's embedded player, loaded from `youtube-nocookie.com` a moment after the page opens. YouTube's embed policy expects its player to be visible; this one is hidden, which YouTube could object to or block.
- iPhone/Safari may refuse to start a YouTube player from a tap outside it. In that case the button simply shows "Play music". An MP3 you have the rights to would be more reliable; ask for the file-based player.

## Project structure

```
src/
  app/                 page (plain link), i/[code] (invite links), admin/[key], metadata routes, 404, error
  config/wedding.ts    ← wording, couple, dates, music, contact
  config/events.ts     ← events (server-only) + what the plain link shows
  types/               config types
  sections/            Hero, Blessing (verse + families), Celebrations, Countdown, SaveTheDate, Rsvp, Closing
  components/
    invitation/        InvitationGate (cover, seal, curtain reveal)
    layout/            InvitationPage, InviteProvider, ExperienceProvider, SiteNav, MainContent
    admin/             InviteBuilder (tick events → link)
    music/             MusicProvider (YouTube player), MusicToggle
    animations/        Reveal, ScriptName (ink reveal), PetalField, SakuraBurst
    art/               CrimsonMoon, WaxSeal, Bismillah, Ornament/SectionHeading, Illustration
    events/            EventComposition
    rsvp/              RsvpForm, Zod schema
  hooks/               countdown, active section, scroll lock
  lib/                 invites (server), timezone maths, calendar, maps, WhatsApp messages, OG card/icons
scripts/generate-art.mjs
public/illustrations
```

## Design system

- **Palette** (Tailwind tokens in `globals.css`): `obsidian #090708`, `burgundy #400D20`, `wine #5C1029`, `crimson #741D35`, `gold #D5B98A`, `ivory #F1E7D9`, `rose #A77B82`
- **Type:** Pinyon Script (calligraphy) for the couple's names, Cormorant Garamond for display text, Playfair Display for dates and venue names, Inter for UI and body text, Amiri for the Arabic Bismillah. All are self-hosted through `next/font`; Pinyon and Cormorant are also embedded in `src/assets/fonts` for the share image.
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

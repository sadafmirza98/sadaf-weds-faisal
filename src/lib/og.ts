import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Shared assets for generated images (OG card, icons). Server-only. */
export async function loadOgAssets() {
  const root = process.cwd();
  const [italic, medium, script, floral] = await Promise.all([
    readFile(join(root, "src/assets/fonts/CormorantGaramond-Italic.ttf")),
    readFile(join(root, "src/assets/fonts/CormorantGaramond-Medium.ttf")),
    readFile(join(root, "src/assets/fonts/MonsieurLaDoulaise-Regular.ttf")),
    readFile(join(root, "public/illustrations/floral-corner.svg"), "utf8"),
  ]);
  return {
    fonts: [
      { name: "Cormorant", data: italic, style: "italic" as const, weight: 400 as const },
      { name: "Cormorant", data: medium, style: "normal" as const, weight: 500 as const },
      { name: "RoyalScript", data: script, style: "normal" as const, weight: 400 as const },
    ],
    floralDataUri: `data:image/svg+xml;base64,${Buffer.from(floral).toString("base64")}`,
  };
}

/** The crescent and star from components/art/Moon.tsx, as an SVG data URI for generated images. */
export function moonDataUri() {
  const sparkle = "M0 -1C0.12 -0.3 0.3 -0.12 1 0C0.3 0.12 0.12 0.3 0 1C-0.12 0.3 -0.3 0.12 -1 0C-0.3 -0.12 -0.12 -0.3 0 -1Z";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
<defs>
<linearGradient id="b" x1="0.15" y1="0.85" x2="0.85" y2="0.15"><stop offset="0" stop-color="#C99A5B"/><stop offset="0.35" stop-color="#EBCF9C"/><stop offset="0.7" stop-color="#FBEFD8"/><stop offset="1" stop-color="#FFF8EC"/></linearGradient>
<mask id="m"><circle cx="100" cy="100" r="72" fill="#fff"/><circle cx="128" cy="80" r="62" fill="#000"/></mask>
<filter id="h" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
</defs>
<circle cx="100" cy="100" r="72" fill="#F3E3C3" opacity="0.45" mask="url(#m)" filter="url(#h)"/>
<g mask="url(#m)"><circle cx="100" cy="100" r="72" fill="url(#b)"/><circle cx="100" cy="100" r="71.3" fill="none" stroke="#FFF8EC" stroke-opacity="0.7" stroke-width="1.2"/></g>
<path d="${sparkle}" transform="translate(142 92) scale(15)" fill="#FFF8EC"/>
<path d="${sparkle}" transform="translate(166 58) scale(6)" fill="#F3E3C3" opacity="0.8"/>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** A five-petal cherry blossom (favicon and home-screen icon) as an SVG data URI. */
export function blossomDataUri() {
  const petal = "M0 0C6 -2 6.4 -9 2.3 -10.9L0 -9.1L-2.3 -10.9C-6.4 -9 -6 -2 0 0Z";
  const petals = [0, 72, 144, 216, 288]
    .map((r) => `<path transform="rotate(${r})" d="${petal}" fill="url(#p)" stroke="#9C3550" stroke-width="0.45" stroke-linejoin="round"/>`)
    .join("");
  const stamens = [36, 108, 180, 252, 324]
    .map((a) => {
      const x = (Math.sin((a * Math.PI) / 180) * 3.4).toFixed(2);
      const y = (-Math.cos((a * Math.PI) / 180) * 3.4).toFixed(2);
      return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#B8455A" stroke-width="0.35"/><circle cx="${x}" cy="${y}" r="0.62" fill="#E7C98F"/>`;
    })
    .join("");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -12 24 24">` +
    `<defs><radialGradient id="p" cx="0" cy="0" r="11.5" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0.1" stop-color="#C2546A"/><stop offset="0.5" stop-color="#EBA9B7"/><stop offset="1" stop-color="#FDE7EC"/></radialGradient></defs>` +
    `${petals}<circle r="1.9" fill="#741D35"/>${stamens}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

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

export const moonBackground =
  "radial-gradient(circle at 40% 36%, #F0C3B2 0%, #C4566A 30%, #7A1F38 70%, #350917 100%)";

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

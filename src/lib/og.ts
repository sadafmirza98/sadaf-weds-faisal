import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Shared assets for generated images (OG card, icons). Server-only. */
export async function loadOgAssets() {
  const root = process.cwd();
  const [italic, medium, floral] = await Promise.all([
    readFile(join(root, "src/assets/fonts/CormorantGaramond-Italic.ttf")),
    readFile(join(root, "src/assets/fonts/CormorantGaramond-Medium.ttf")),
    readFile(join(root, "public/illustrations/floral-corner.svg"), "utf8"),
  ]);
  return {
    fonts: [
      { name: "Cormorant", data: italic, style: "italic" as const, weight: 400 as const },
      { name: "Cormorant", data: medium, style: "normal" as const, weight: 500 as const },
    ],
    floralDataUri: `data:image/svg+xml;base64,${Buffer.from(floral).toString("base64")}`,
  };
}

export const moonBackground =
  "radial-gradient(circle at 40% 36%, #F0C3B2 0%, #C4566A 30%, #7A1F38 70%, #350917 100%)";

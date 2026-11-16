import { ImageResponse } from "next/og";
import { wedding } from "@/config/wedding";
import { loadOgAssets } from "@/lib/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Loaded once at module evaluation so the image is prerendered at build time.
const { fonts } = await loadOgAssets();

/** Favicon: the couple's monogram on a crimson wax disc. */
export default async function Icon() {
  const [a, b] = wedding.couple.monogram;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 9999,
          background: "radial-gradient(circle at 38% 32%, #B23A55 0%, #741D35 45%, #2E0713 100%)",
          border: "2px solid rgba(213,185,138,0.7)",
          fontFamily: "Cormorant",
          fontStyle: "italic",
          fontSize: 34,
          color: "#F3E3C3",
          letterSpacing: -1,
        }}
      >
        {a}
        {b}
      </div>
    ),
    { ...size, fonts },
  );
}

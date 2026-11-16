import { ImageResponse } from "next/og";
import { wedding } from "@/config/wedding";
import { loadOgAssets, moonBackground } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Loaded once at module evaluation so the image is prerendered at build time.
const { fonts } = await loadOgAssets();

/** Home-screen icon: monogram over a crimson moon. */
export default async function AppleIcon() {
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
          background: "#090708",
          position: "relative",
          fontFamily: "Cormorant",
        }}
      >
        <div style={{ position: "absolute", width: 130, height: 130, borderRadius: 9999, background: moonBackground, opacity: 0.9 }} />
        <div style={{ display: "flex", alignItems: "baseline", fontStyle: "italic", fontSize: 70, color: "#F1E7D9" }}>
          {a}
          <span style={{ fontSize: 38, color: "#F3E3C3", margin: "0 4px" }}>&amp;</span>
          {b}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}

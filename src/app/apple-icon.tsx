import { ImageResponse } from "next/og";
import { blossomDataUri } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: a cherry blossom on the site's night background. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 50%, #3A0D1D 0%, #16070C 60%, #090708 100%)",
        }}
      >
        <img src={blossomDataUri()} width={138} height={138} alt="" />
      </div>
    ),
    size,
  );
}

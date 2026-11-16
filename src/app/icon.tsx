import { ImageResponse } from "next/og";
import { blossomDataUri } from "@/lib/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: a cherry blossom. */
export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={blossomDataUri()} width={62} height={62} alt="" />
      </div>
    ),
    size,
  );
}

/* eslint-disable @next/next/no-img-element -- ImageResponse (Satori) renders plain <img>; next/image does not apply. */
import { ImageResponse } from "next/og";
import { wedding } from "@/config/wedding";
import type { Invite } from "@/types/wedding";
import { loadOgAssets, moonBackground } from "@/lib/og";
import { formatFullDate } from "@/lib/time";

export const ogSize = { width: 1200, height: 630 };

// Loaded once at module evaluation so images are prerendered at build time.
const { fonts, floralDataUri } = await loadOgAssets();

/** The social preview card for one invite: names, its events and its main date. */
export function renderInviteCard(invite: Invite) {
  const { couple } = wedding;
  const size = ogSize;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "radial-gradient(ellipse at 50% 70%, #2b0915 0%, #14060b 45%, #090708 80%)",
          fontFamily: "Cormorant",
          color: "#F1E7D9",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -90,
            top: -150,
            width: 300,
            height: 300,
            borderRadius: 9999,
            background: moonBackground,
            boxShadow: "0 0 120px 40px rgba(184,69,90,0.35)",
          }}
        />
        <img src={floralDataUri} width={420} height={420} style={{ position: "absolute", left: -60, top: -60 }} alt="" />
        <img src={floralDataUri} width={360} height={360} style={{ position: "absolute", right: -50, bottom: -50, transform: "rotate(180deg)" }} alt="" />
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1px solid rgba(213,185,138,0.35)",
            display: "flex",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ fontSize: 24, letterSpacing: 10, color: "#D5B98A", fontStyle: "normal", fontWeight: 500, textTransform: "uppercase" }}>
            {wedding.invitation.eyebrow}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 148, marginTop: 10, lineHeight: 1.15 }}>
            <span style={{ fontFamily: "RoyalScript" }}>{couple.partnerOne.firstName}</span>
            <span style={{ fontSize: 80, fontStyle: "italic", color: "#D5B98A", margin: "0 26px" }}>&amp;</span>
            <span style={{ fontFamily: "RoyalScript" }}>{couple.partnerTwo.firstName}</span>
          </div>
          <div style={{ fontSize: 22, letterSpacing: 8, marginTop: 22, fontStyle: "normal", fontWeight: 500, textTransform: "uppercase", color: "#D5B98A" }}>
            {invite.events.map((e) => e.name).join("  ·  ")}
          </div>
          <div style={{ width: 260, height: 1, background: "linear-gradient(90deg, transparent, #D5B98A, transparent)", marginTop: 30 }} />
          <div style={{ fontSize: 30, letterSpacing: 8, marginTop: 26, fontStyle: "normal", fontWeight: 500, textTransform: "uppercase", color: "rgba(241,231,217,0.85)" }}>
            {formatFullDate(invite.primary.start)}
          </div>
          <div style={{ fontSize: 26, fontStyle: "italic", marginTop: 10, color: "rgba(241,231,217,0.6)" }}>{wedding.locationLine}</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}

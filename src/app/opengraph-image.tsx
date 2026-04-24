import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { color } from "@/tokens";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} — Sparkling Wine House`;

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: `linear-gradient(180deg, ${color.chalk} 0%, ${color.paper} 60%, ${color.stone} 100%)`,
          color: color.graphite,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: color.oxide }}>
          Invinity · Est. Vancouver Island
        </div>
        <div style={{ fontSize: 96, lineHeight: 1.02, letterSpacing: -2, maxWidth: 900 }}>
          A sparkling house on the edge of the Pacific.
        </div>
        <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: color.champagne }}>
          Traditional method · Naturally made · North Saanich, BC
        </div>
      </div>
    ),
    { ...size }
  );
}

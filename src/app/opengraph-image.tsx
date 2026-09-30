import { ImageResponse } from "next/og";

export const alt = "Yussif Sare — Frontend Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NIGHT = "#0c0c11";
const PAPER = "#f3f0e8";
const ACID = "#d8ff4f";
const LINE = "rgba(243, 240, 232, 0.09)";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        background: NIGHT,
        color: PAPER,
        padding: "72px 80px",
        fontFamily: "sans-serif",
      }}
    >
      {/* grid backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
        }}
      >
        <div style={{ flex: 1, borderRight: `1px solid ${LINE}` }} />
        <div style={{ flex: 1, borderRight: `1px solid ${LINE}` }} />
        <div style={{ flex: 1, borderRight: `1px solid ${LINE}` }} />
        <div style={{ flex: 1 }} />
      </div>

      {/* top meta row */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "monospace",
          fontSize: 22,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        <span style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.8em" }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: ACID,
              display: "block",
            }}
          />
          Accra, Ghana
        </span>
        <span>yussifsare.is-a.dev</span>
      </div>

      {/* name + role */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 28 }}>
        <span
          style={{
            fontSize: 118,
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: "-0.045em",
            textTransform: "uppercase",
          }}
        >
          Yussif Sare
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 26,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: ACID,
          }}
        >
          Frontend Developer
        </span>
      </div>

      {/* bottom row */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 24, opacity: 0.72, maxWidth: "70%" }}>
          Interfaces with weight, motion and intent.
        </span>
        <span
          style={{
            width: 180,
            height: 10,
            background: ACID,
            display: "block",
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}

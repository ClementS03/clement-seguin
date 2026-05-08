import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Clément Seguin — Digital Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#07080a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 80px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Ambient glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 600,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(45,158,107,0.18) 0%, transparent 70%)",
          }}
        />

        {/* Bottom-left subtle glow */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: 200,
            width: 400,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(78,203,168,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Domain pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(45,158,107,0.12)",
            border: "1px solid rgba(45,158,107,0.3)",
            borderRadius: 100,
            padding: "8px 20px",
            marginBottom: 40,
            color: "#4ecba8",
            fontSize: 16,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 500,
          }}
        >
          clement-seguin.fr
        </div>

        {/* Headline line 1 */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 400,
            color: "#edf2ed",
            lineHeight: 1.05,
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Your expertise is real.
        </div>

        {/* Headline line 2 — accent */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 400,
            color: "#2d9e6b",
            lineHeight: 1.05,
            marginBottom: 36,
            letterSpacing: "-0.02em",
          }}
        >
          Your website should say so.
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: 22,
            color: "#8a9a8b",
            lineHeight: 1.5,
            marginBottom: 56,
            fontFamily: "system-ui, sans-serif",
            fontWeight: 400,
            maxWidth: 680,
          }}
        >
          Premium sites, tools, and digital products — delivered in 5 days.
        </div>

        {/* Author row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2d9e6b, #4ecba8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 20,
              fontWeight: 700,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            CS
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div
              style={{
                color: "#edf2ed",
                fontSize: 18,
                fontWeight: 600,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Clément Seguin
            </div>
            <div
              style={{
                color: "#8a9a8b",
                fontSize: 15,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Web Builder & Indie Maker
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

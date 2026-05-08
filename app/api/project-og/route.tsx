import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name     = searchParams.get("name")     || "Project";
  const category = searchParams.get("category") || "";
  const tagline  = searchParams.get("tagline")  || "";
  const tags     = searchParams.get("tags")?.split(",").filter(Boolean) || [];
  const accent   = searchParams.get("accent")   || "#2d9e6b";
  const url      = searchParams.get("url")      || "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#07080a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -60,
            width: 500,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: 100,
            width: 350,
            height: 280,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}10 0%, transparent 70%)`,
          }}
        />

        {/* Browser chrome bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "14px 24px",
            background: "#0c0f0d",
            borderBottom: "1px solid #1a2a1c",
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: accent }} />
          <div
            style={{
              marginLeft: 12,
              flex: 1,
              background: "#141a15",
              borderRadius: 6,
              padding: "5px 14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#8a9a8b", fontSize: 13, fontFamily: "system-ui, sans-serif" }}>
              {url || `clement-seguin.fr`}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 64px",
          }}
        >
          {/* Category badge */}
          {category && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: `${accent}18`,
                border: `1px solid ${accent}40`,
                borderRadius: 100,
                padding: "6px 16px",
                marginBottom: 24,
                width: "fit-content",
                color: accent,
                fontSize: 14,
                fontFamily: "system-ui, sans-serif",
                fontWeight: 500,
              }}
            >
              {category}
            </div>
          )}

          {/* Project name */}
          <div
            style={{
              fontSize: 68,
              fontWeight: 400,
              color: "#edf2ed",
              lineHeight: 1.05,
              marginBottom: 20,
              letterSpacing: "-0.02em",
            }}
          >
            {name}
          </div>

          {/* Tagline */}
          {tagline && (
            <div
              style={{
                fontSize: 22,
                color: "#8a9a8b",
                lineHeight: 1.5,
                marginBottom: 32,
                fontFamily: "system-ui, sans-serif",
                fontWeight: 400,
                maxWidth: 680,
              }}
            >
              {tagline}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tags.slice(0, 5).map((tag, i) => (
                <div
                  key={i}
                  style={{
                    background: "#141a15",
                    border: "1px solid #1a2a1c",
                    borderRadius: 6,
                    padding: "6px 14px",
                    color: "#8a9a8b",
                    fontSize: 14,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {tag.trim()}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 64px",
            borderTop: "1px solid #1a2a1c",
          }}
        >
          <div
            style={{
              color: "#8a9a8b",
              fontSize: 14,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            clement-seguin.fr
          </div>
          <div
            style={{
              color: accent,
              fontSize: 14,
              fontFamily: "system-ui, sans-serif",
              fontWeight: 500,
            }}
          >
            View project →
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

import { ImageResponse } from "next/og";

export const dynamic = "force-dynamic";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr";

async function fetchPost(slug: string) {
  if (process.env.NOTION_TOKEN && process.env.NOTION_DB_ID) {
    try {
      const { getNotionPost } = await import("@/lib/notion");
      return await getNotionPost(slug);
    } catch { /* fallback */ }
  }
  const { getPost } = await import("@/lib/i18n");
  return getPost(slug);
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);

  const title    = post?.title    ?? "Clément Seguin";
  const excerpt  = post?.excerpt  ?? "Premium sites for independent professionals — delivered in 5 days.";
  const category = post?.category ?? "Blog";

  const titleSize = title.length > 70 ? "44px" : title.length > 50 ? "52px" : "60px";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#07080A",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />

        {/* Top-right glow */}
        <div
          style={{
            position: "absolute", top: "-160px", right: "-160px",
            width: "640px", height: "640px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45,158,107,0.22) 0%, transparent 65%)",
          }}
        />

        {/* Bottom-left glow */}
        <div
          style={{
            position: "absolute", bottom: "-120px", left: "-80px",
            width: "480px", height: "480px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45,158,107,0.1) 0%, transparent 65%)",
          }}
        />

        {/* Top row: category badge */}
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <div
            style={{
              background: "rgba(45,158,107,0.15)",
              border: "1px solid rgba(45,158,107,0.45)",
              borderRadius: "100px",
              padding: "7px 18px",
              color: "#2D9E6B",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {category}
          </div>
        </div>

        {/* Center: title + excerpt */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            position: "relative",
          }}
        >
          <div
            style={{
              color: "#EDF2ED",
              fontSize: titleSize,
              fontWeight: "700",
              lineHeight: "1.1",
              letterSpacing: "-0.025em",
              maxWidth: "960px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: "rgba(237,242,237,0.48)",
              fontSize: "21px",
              lineHeight: "1.55",
              maxWidth: "820px",
            }}
          >
            {excerpt.length > 140 ? excerpt.slice(0, 137) + "…" : excerpt}
          </div>
        </div>

        {/* Bottom row: domain + author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "7px", height: "7px", borderRadius: "50%",
                background: "#2D9E6B",
                boxShadow: "0 0 10px 3px rgba(45,158,107,0.5)",
              }}
            />
            <span
              style={{
                color: "#2D9E6B",
                fontSize: "16px",
                fontWeight: "600",
                letterSpacing: "0.04em",
              }}
            >
              {SITE.replace("https://", "")}
            </span>
          </div>
          <span style={{ color: "rgba(237,242,237,0.2)", fontSize: "15px" }}>
            Clément Seguin
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

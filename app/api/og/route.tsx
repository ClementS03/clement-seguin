import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

// ── clement-seguin.fr ────────────────────────────────────────────────────────
function ClementSeguin() {
  return (
    <div style={{ background: "#07080a", width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "Georgia, serif", position: "relative", overflow: "hidden" }}>
      {/* Ambient glow */}
      <div style={{ position: "absolute", top: -80, right: -40, width: 500, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(45,158,107,0.20) 0%, transparent 70%)" }} />
      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ color: "#edf2ed", fontSize: 22, fontWeight: 700, fontFamily: "system-ui, sans-serif", letterSpacing: "-0.02em" }}>CS.</span>
        <div style={{ display: "flex", gap: 28, color: "#8a9a8b", fontSize: 13, fontFamily: "system-ui, sans-serif" }}>
          <span>Offers</span><span>Shop</span><span>Projects</span><span>Blog</span>
        </div>
        <div style={{ background: "#2d9e6b", color: "white", fontSize: 12, fontFamily: "system-ui, sans-serif", padding: "8px 18px", borderRadius: 100, fontWeight: 600 }}>Book a free call</div>
      </div>
      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(45,158,107,0.12)", border: "1px solid rgba(45,158,107,0.3)", borderRadius: 100, padding: "7px 16px", maxWidth: 400, marginBottom: 28 }}>
          <span style={{ color: "#2d9e6b", fontSize: 8 }}>●</span>
          <span style={{ color: "#4ecba8", fontSize: 13, fontFamily: "system-ui, sans-serif", fontWeight: 500 }}>3 slots available this month</span>
        </div>
        <div style={{ fontSize: 62, color: "#edf2ed", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 6 }}>Your expertise is real.</div>
        <div style={{ fontSize: 62, color: "#2d9e6b", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24 }}>Your website should say so.</div>
        <div style={{ fontSize: 18, color: "#8a9a8b", fontFamily: "system-ui, sans-serif", marginBottom: 36, maxWidth: 560 }}>Premium sites, tools, and digital products — design, copy, and SEO, delivered in 5 days.</div>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ background: "#2d9e6b", color: "white", fontSize: 15, fontFamily: "system-ui, sans-serif", padding: "13px 26px", borderRadius: 10, fontWeight: 600 }}>Book my free call →</div>
          <div style={{ border: "1px solid rgba(255,255,255,0.15)", color: "#edf2ed", fontSize: 15, fontFamily: "system-ui, sans-serif", padding: "13px 26px", borderRadius: 10 }}>See offers</div>
        </div>
      </div>
    </div>
  );
}

// ── PawFect Studio ───────────────────────────────────────────────────────────
function PawFact() {
  return (
    <div style={{ background: "#FFFAF3", width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div style={{ position: "absolute", top: -60, right: 80, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,79,31,0.12) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -40, left: 60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,185,46,0.15) 0%, transparent 70%)" }} />
      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 44px", borderBottom: "1px solid #F2E4D2" }}>
        <span style={{ color: "#160C04", fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em" }}>PawFect<span style={{ color: "#FF4F1F" }}>.</span></span>
        <div style={{ display: "flex", gap: 24, color: "#6B4F35", fontSize: 13 }}>
          <span>Services</span><span>À propos</span><span>Contact</span>
        </div>
        <div style={{ background: "linear-gradient(135deg, #FF4F1F, #FF8C42)", color: "white", fontSize: 13, padding: "9px 20px", borderRadius: 100, fontWeight: 600 }}>Réserver</div>
      </div>
      {/* Hero */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 44px", gap: 40 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,79,31,0.09)", border: "1px solid rgba(255,79,31,0.2)", borderRadius: 100, padding: "6px 14px", maxWidth: 400, marginBottom: 16 }}>
            <span style={{ fontSize: 9, color: "#FF4F1F" }}>●</span>
            <span style={{ color: "#FF4F1F", fontSize: 12, fontWeight: 600 }}>Salon de toilettage premium</span>
          </div>
          <div style={{ color: "#A8896C", fontSize: 15, marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Toilettage · Soin · Amour</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 0, fontSize: 58, fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: 20 }}>
            <span style={{ color: "#FF4F1F" }}>Paw</span><span style={{ color: "#FF8C42" }}>Fect</span><span style={{ color: "#160C04" }}> Studio</span>
          </div>
          <div style={{ fontSize: 16, color: "#6B4F35", lineHeight: 1.6, marginBottom: 28, maxWidth: 440 }}>Votre compagnon mérite le meilleur. Soins personnalisés avec passion, dans un espace conçu pour son bien-être.</div>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ background: "linear-gradient(135deg, #FF4F1F, #FF8C42)", color: "white", fontSize: 14, padding: "12px 22px", borderRadius: 50, fontWeight: 600 }}>Prendre rendez-vous →</div>
            <div style={{ border: "1px solid #F2E4D2", color: "#160C04", fontSize: 14, padding: "12px 22px", borderRadius: 50 }}>Voir les services</div>
          </div>
        </div>
        {/* Right visual */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
          <div style={{ background: "white", border: "1px solid #F2E4D2", borderRadius: 16, padding: "14px 20px", display: "flex", flexDirection: "column", gap: 4, boxShadow: "0 4px 24px rgba(160,80,20,0.08)" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
              {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#FFB92E", fontSize: 16 }}>★</span>)}
            </div>
            <div style={{ color: "#160C04", fontSize: 13, fontWeight: 600 }}>Top-noté à Paris</div>
            <div style={{ color: "#A8896C", fontSize: 11 }}>2 000+ animaux choyés</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", background: "linear-gradient(135deg, #05C4A0, #4ecba8)", borderRadius: 16, padding: "14px 20px" }}>
            <div style={{ color: "white", fontSize: 22, fontWeight: 800 }}>98%</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>Clients satisfaits</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Kinetic Infrastructure ───────────────────────────────────────────────────
function KineticInfra() {
  const bars = [28, 45, 38, 70, 52, 85, 42, 68, 35, 90, 58, 48, 75, 82, 40, 62, 78, 55, 92, 65];
  return (
    <div style={{ background: "#060e20", width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, right: -40, width: 400, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(129,236,255,0.08) 0%, transparent 70%)" }} />
      {/* Nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 36px", borderBottom: "1px solid rgba(64,72,93,0.4)" }}>
        <span style={{ color: "#81ecff", fontSize: 16, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>KINETIC</span>
        <div style={{ display: "flex", gap: 6 }}>
          {["OVERVIEW", "INGESTION", "LATENCY"].map(t => (
            <div key={t} style={{ background: t === "OVERVIEW" ? "rgba(129,236,255,0.12)" : "transparent", border: "1px solid rgba(64,72,93,0.4)", borderRadius: 6, padding: "5px 12px", color: t === "OVERVIEW" ? "#81ecff" : "#6d758c", fontSize: 10, fontWeight: 600, letterSpacing: "0.06em" }}>{t}</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3cffa0" }} />
          <span style={{ color: "#3cffa0", fontSize: 10, fontWeight: 600 }}>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>
      {/* Metrics */}
      <div style={{ display: "flex", gap: 10, padding: "12px 36px 8px" }}>
        {[
          { label: "THROUGHPUT", value: "4.2 TB/s", sub: "↑ +12.4%", accent: true },
          { label: "GLOBAL LATENCY", value: "1.2ms", sub: "↓ P99 optimal" },
          { label: "UPTIME", value: "99.999%", sub: "30-day avg" },
          { label: "ACTIVE NODES", value: "12,402", sub: "↑ +104 this hour" },
        ].map(m => (
          <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", background: "#141f38", border: "1px solid rgba(64,72,93,0.4)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ color: "#6d758c", fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: m.accent ? "#81ecff" : "#dee5ff", letterSpacing: "-0.02em" }}>{m.value}</div>
            <div style={{ fontSize: 8, color: "#3cffa0", marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div style={{ flex: 1, background: "#0f1930", border: "1px solid rgba(64,72,93,0.4)", borderRadius: 12, margin: "0 36px 10px", padding: "12px 16px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ color: "#6d758c", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}>INGESTION VOLUME — 24H</span>
          <span style={{ color: "#81ecff", fontSize: 9, fontWeight: 600 }}>4.2 TB/S PEAK</span>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 3 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, borderRadius: 3, height: `${h}%`, background: i < 14 ? "#81ecff" : "#141f38", opacity: i < 14 ? 0.5 + (h / 100) * 0.5 : 1, boxShadow: i < 14 ? "0 0 6px rgba(129,236,255,0.4)" : "none" }} />
          ))}
        </div>
      </div>
      {/* Logs */}
      <div style={{ background: "#060e20", borderTop: "1px solid rgba(64,72,93,0.4)", padding: "8px 36px", display: "flex", flexDirection: "column", gap: 3 }}>
        {[
          { t: "09:42:01", l: "INFO", c: "#81ecff", m: "INGEST_NODE_04: PACKET_RECEIVED (4.2kb) — CHECKSUM OK" },
          { t: "09:42:01", l: "OK",   c: "#3cffa0", m: "TRANSFORM_WORKER_12: GEO_IP_MAPPING... SUCCESS" },
          { t: "09:42:02", l: "INFO", c: "#81ecff", m: "RE-ROUTE: EDGE_09 → EDGE_14 — LOAD_BALANCE" },
        ].map((line, i) => (
          <div key={i} style={{ display: "flex", gap: 14, fontSize: 10 }}>
            <span style={{ color: "#6d758c", fontFamily: "monospace", width: 52 }}>{line.t}</span>
            <span style={{ color: line.c, fontWeight: 700, fontFamily: "monospace", width: 30 }}>[{line.l}]</span>
            <span style={{ color: "#a3aac4", fontFamily: "monospace" }}>{line.m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const p = new URL(req.url).searchParams.get("p") || "";

  let content: React.ReactElement;
  if (p === "paw-fact")  content = <PawFact />;
  else if (p === "kinetic") content = <KineticInfra />;
  else content = <ClementSeguin />;

  return new ImageResponse(content, { width: 1200, height: 630 });
}

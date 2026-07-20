import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,

  // ── Next.js 15.5.x dev mode bug workaround ────────────────
  // Les nouveaux DevTools (segment-explorer-node.js) ne trouvent
  // pas leur module dans le React Client Manifest → crash webpack.
  // Désactiver les dev indicators règle le problème en dev.
  devIndicators: false,

  // ── Optimisation images ────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
    ],
  },

  async redirects() {
    return [
      // ── Anciennes routes i18n ─────────────────────────────
      // /fr et /fr/:path* volontairement absents — le middleware
      // rewrite / → /fr en interne, un redirect /fr → / créerait
      // une boucle infinie sur Netlify.
      { source: "/en/fr/:path*", destination: "/en/:path*", permanent: true },

      // ── Pages désactivées → homepage ─────────────────────
      { source: "/shop",            destination: "/", permanent: true },
      { source: "/shop/:path*",     destination: "/", permanent: true },
      { source: "/projects",        destination: "/", permanent: true },
      { source: "/projects/:path*", destination: "/", permanent: true },
      { source: "/blog",            destination: "/", permanent: true },
      { source: "/blog/:path*",     destination: "/", permanent: true },
      { source: "/open",            destination: "/", permanent: true },
      { source: "/uses",            destination: "/", permanent: true },

      // ── Anciennes URLs déjà existantes ────────────────────
      { source: "/projets",         destination: "/",    permanent: true },
      { source: "/projets/:slug",   destination: "/",    permanent: true },
      { source: "/terms",           destination: "/cgv", permanent: true },
      // /en → /en/ volontairement absent — même raison que /fr, crée une boucle sur Netlify
    ];
  },

  async headers() {
    return [
      // ── HTML pages — jamais mises en cache ─────────────
      // Empêche le navigateur de servir du HTML périmé
      // qui référencerait d'anciens chunks JS
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-XSS-Protection",          value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
          // CSP : script unsafe-inline requis par Next.js (JSON-LD + hydration chunks)
          // img-src https: couvre microlink et placehold.co
          // cal.com : booking widget (script, frame, connect)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.cal.com https://embed.cal.com https://analytics.ahrefs.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://app.cal.com https://*.cal.com https://analytics.ahrefs.com",
              "frame-src 'self' https://app.cal.com https://*.cal.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // Pas de cache sur le HTML — le JS et CSS sont content-hashed eux-mêmes
          { key: "Cache-Control",             value: "public, max-age=0, must-revalidate" },
        ],
      },
      // ── JS/CSS chunks — cache immutable (content-hashed) ─
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // ── Images publiques ───────────────────────────────
      {
        source: "/(.*)\\.(png|jpg|jpeg|webp|avif|svg|ico|gif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // ── Manifest PWA ──────────────────────────────────
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Content-Type",  value: "application/manifest+json" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;

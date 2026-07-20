// app/robots.ts
import { MetadataRoute } from "next"

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/en/", "/about", "/en/about", "/legal", "/cgv", "/privacy", "/merci"],
        disallow: [
          "/admin", "/api/",
          "/shop", "/en/shop",
          "/projects", "/en/projects",
          "/blog", "/en/blog",
          "/open", "/en/open",
          "/uses", "/en/uses",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}

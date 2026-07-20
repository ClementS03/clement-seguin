// app/sitemap.ts
import { MetadataRoute } from "next"

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/en/`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/en/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ]
}

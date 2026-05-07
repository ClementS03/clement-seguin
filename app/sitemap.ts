import { MetadataRoute } from "next";
import { getPosts } from "@/lib/i18n";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE,          lastModified: new Date(), changeFrequency: "weekly",  priority: 1   },
    { url: `${BASE}/blog`,lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  ];

  for (const post of getPosts()) {
    entries.push({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}

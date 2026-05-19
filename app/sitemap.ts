import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE,            lastModified: new Date(), changeFrequency: "weekly",  priority: 1   },
    { url: `${BASE}/blog`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
  ];

  let posts: { slug: string; publishedAt: string }[] = [];

  if (process.env.NOTION_TOKEN && process.env.NOTION_DB_ID) {
    try {
      const { getNotionPosts } = await import("@/lib/notion");
      posts = await getNotionPosts();
    } catch {
      const { getPosts } = await import("@/lib/i18n");
      posts = getPosts();
    }
  } else {
    const { getPosts } = await import("@/lib/i18n");
    posts = getPosts();
  }

  for (const post of posts) {
    entries.push({
      url: `${BASE}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}

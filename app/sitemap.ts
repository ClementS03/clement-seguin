import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: BASE,                  lastModified: now, changeFrequency: "weekly",  priority: 1    },
    { url: `${BASE}/shop`,        lastModified: now, changeFrequency: "weekly",  priority: 0.8  },
    { url: `${BASE}/projects`,    lastModified: now, changeFrequency: "monthly", priority: 0.8  },
    { url: `${BASE}/blog`,        lastModified: now, changeFrequency: "weekly",  priority: 0.7  },
    { url: `${BASE}/open`,        lastModified: now, changeFrequency: "weekly",  priority: 0.5  },
    { url: `${BASE}/uses`,        lastModified: now, changeFrequency: "monthly", priority: 0.4  },
    // /about is noindex until photos are added — excluded intentionally
    // /legal, /cgv, /privacy are noindex — excluded intentionally
  ];

  // Blog posts
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

  // Shop products
  try {
    const { getProducts } = await import("@/lib/airtable");
    const products = await getProducts();
    for (const product of products) {
      if (product.slug) {
        entries.push({
          url: `${BASE}/shop/${product.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.75,
        });
      }
    }
  } catch {
    // Airtable unavailable at build time — skip product URLs
  }

  // Projects (individual pages)
  try {
    const { getProjects } = await import("@/lib/airtable");
    const projects = await getProjects();
    for (const project of projects) {
      if (project.slug) {
        entries.push({
          url: `${BASE}/projects/${project.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // Airtable unavailable at build time — skip project URLs
  }

  return entries;
}

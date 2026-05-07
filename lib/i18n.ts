import content from "@/data/content.json";
import posts from "@/data/posts.json";

export type Post = (typeof posts)[number];
export type SiteContent = typeof content;

export function getContent(): SiteContent {
  return content;
}

export function getPosts(): Post[] {
  return posts;
}

export function getPost(slug: string): Post | null {
  return posts.find((p) => p.slug === slug) ?? null;
}

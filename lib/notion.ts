/**
 * lib/notion.ts
 * ─────────────────────────────────────────────────────────────
 * Fetches blog posts from Notion database (English only).
 *
 * DATABASE SETUP:
 * | Property      | Type         | Notes                        |
 * |---------------|--------------|------------------------------|
 * | Title         | Title        | Article title (required)     |
 * | Slug          | Text         | URL slug, e.g. "my-article"  |
 * | Published     | Checkbox     | ✅ = visible on site         |
 * | Publish Date  | Date         | Auto-publishes on this date  |
 * | Excerpt       | Text         | Short description, 155 chars |
 * | Category      | Select       | e.g. "Design & UX", "SEO"   |
 * | Read Time     | Text         | e.g. "5 min"                 |
 * | Featured      | Checkbox     | Show at top of blog list     |
 * | Tags          | Multi-select | e.g. "webflow", "seo"        |
 *
 * ENV VARIABLES NEEDED:
 * NOTION_TOKEN      → your Notion integration secret
 * NOTION_DB_ID      → your database ID (from the URL)
 * ─────────────────────────────────────────────────────────────
 */
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

export type ContentBlock =
  | { type: "intro" | "h2" | "h3" | "text"; text: string }
  | { type: "cta"; text: string; link: string; label: string };

export type NotionPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
  content: ContentBlock[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getText(prop: any): string {
  if (!prop) return "";
  if (prop.type === "rich_text") return prop.rich_text?.[0]?.plain_text ?? "";
  if (prop.type === "title") return prop.title?.[0]?.plain_text ?? "";
  return "";
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSelect(prop: any): string { return prop?.select?.name ?? ""; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMultiSelect(prop: any): string[] { return prop?.multi_select?.map((s: { name: string }) => s.name) ?? []; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDate(prop: any): string { return prop?.date?.start ?? ""; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCheckbox(prop: any): boolean { return prop?.checkbox ?? false; }

function markdownToBlocks(markdown: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let isFirst = true;

  for (const line of markdown.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    if (t === "---" || t === "***" || t === "___") continue;
    if (t.startsWith("# ") && !t.startsWith("## ")) continue;

    if (t.startsWith("## ")) {
      blocks.push({ type: "h2", text: t.slice(3) });
    } else if (t.startsWith("### ")) {
      blocks.push({ type: "h3", text: t.slice(4) });
    } else if (t.startsWith("> **CTA**")) {
      const inner = t.replace(/^> \*\*CTA\*\*\s*/, "");
      const [text, label, link] = inner.split("|").map((p) => p.trim());
      blocks.push({
        type: "cta",
        text: text ?? "",
        label: label ?? "Book a free call",
        link: link ?? "/#contact",
      });
    } else if (isFirst) {
      blocks.push({ type: "intro", text: t });
      isFirst = false;
    } else {
      blocks.push({ type: "text", text: t });
    }
  }

  return blocks;
}

export async function getNotionPosts(): Promise<NotionPost[]> {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DB_ID;

  if (!token || !dbId) throw new Error("NOTION_TOKEN or NOTION_DB_ID is missing");

  const notion = new Client({ auth: token });
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const today = new Date().toISOString().split("T")[0];

  const response = await notion.databases.query({
    database_id: dbId,
    filter: {
      and: [
        { property: "Published",     checkbox: { equals: true } },
        { property: "Publish Date",  date:     { on_or_before: today } },
      ],
    },
    sorts: [{ property: "Publish Date", direction: "descending" }],
  });

  const posts: NotionPost[] = [];

  for (const page of response.results) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = page as any;
    const props = p.properties;
    const slug = getText(props["Slug"]);
    if (!slug) continue;

    let content: ContentBlock[] = [];
    try {
      const mdBlocks = await n2m.pageToMarkdown(p.id);
      const markdown = n2m.toMarkdownString(mdBlocks).parent;
      content = markdownToBlocks(markdown);
    } catch (err) {
      console.warn(`[Notion] Failed to fetch content for slug "${slug}":`, err);
    }

    posts.push({
      slug,
      title:       getText(props["Title"]),
      excerpt:     getText(props["Excerpt"]),
      category:    getSelect(props["Category"]),
      readTime:    getText(props["Read Time"]),
      publishedAt: getDate(props["Publish Date"]),
      featured:    getCheckbox(props["Featured"]),
      tags:        getMultiSelect(props["Tags"]),
      content,
    });
  }

  return posts;
}

export async function getNotionPost(slug: string): Promise<NotionPost | null> {
  const posts = await getNotionPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

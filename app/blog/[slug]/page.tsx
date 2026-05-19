import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, getPosts, getPost } from "@/lib/i18n";
import { Newsletter } from "@/components/sections/Newsletter";

export const dynamic = "force-dynamic";

async function fetchPosts() {
  if (process.env.NOTION_TOKEN && process.env.NOTION_DB_ID) {
    try {
      const { getNotionPosts } = await import("@/lib/notion");
      return await getNotionPosts();
    } catch { /* fallback */ }
  }
  return getPosts();
}

async function fetchPost(slug: string) {
  if (process.env.NOTION_TOKEN && process.env.NOTION_DB_ID) {
    try {
      const { getNotionPost } = await import("@/lib/notion");
      return await getNotionPost(slug);
    } catch { /* fallback */ }
  }
  return getPost(slug);
}

export async function generateStaticParams() {
  const posts = await fetchPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr";
  const c = getContent();
  const post = await fetchPost(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type:          "article",
      url,
      title:         post.title,
      description:   post.excerpt,
      siteName:      c.meta.siteName,
      publishedTime: post.publishedAt,
      authors:       ["Clément Seguin"],
      tags:          post.tags ?? [],
    },
    twitter: {
      card:        "summary_large_image",
      title:       post.title,
      description: post.excerpt,
      creator:     "@clembuild",
      site:        "@clembuild",
    },
  };
}

type ContentBlock =
  | { type: "intro" | "h2" | "h3" | "text"; text: string }
  | { type: "cta"; text: string; link: string; label: string };

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr";
  const c = getContent();
  const t = c.blog;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const allPosts = await fetchPosts();
  const otherPosts = allPosts.filter((p) => p.slug !== slug);
  const byTags = otherPosts.filter((p) => p.tags?.some((tag) => post.tags?.includes(tag)));
  const related = (byTags.length > 0 ? byTags : otherPosts).slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    url: `${SITE_URL}/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Clément Seguin",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Clément Seguin",
      url: SITE_URL,
    },
    image: `${SITE_URL}/blog/${post.slug}/opengraph-image`,
    keywords: post.tags?.join(", ") ?? "",
    inLanguage: "en-US",
    isPartOf: {
      "@type": "Blog",
      name: "Clément Seguin — Blog",
      url: `${SITE_URL}/blog`,
    },
  };

  return (
    <div className="pt-28 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="section-container max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-10"
        >
          {t.backLabel}
        </Link>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge-accent text-xs">{post.category}</span>
            <span className="text-xs text-text-tertiary">{post.readTime} {t.readTimeLabel}</span>
            <span className="text-xs text-text-tertiary">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl tracking-tight text-text-primary leading-[1.1] mb-6">
            {post.title}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">{post.excerpt}</p>
        </div>

        <div className="glow-line mb-10" />

        <article className="prose-custom">
          {(post.content as ContentBlock[]).map((block, i) => {
            if (block.type === "intro")
              return <p key={i} className="text-lg text-text-secondary leading-relaxed mb-8 font-medium">{renderInline(block.text)}</p>;
            if (block.type === "h2")
              return <h2 key={i} className="font-display text-2xl md:text-3xl text-text-primary mt-12 mb-4">{block.text}</h2>;
            if (block.type === "h3")
              return <h3 key={i} className="font-body font-semibold text-xl text-text-primary mt-8 mb-3">{block.text}</h3>;
            if (block.type === "text")
              return <p key={i} className="text-base text-text-secondary leading-relaxed mb-5">{renderInline(block.text)}</p>;
            if (block.type === "cta")
              return (
                <div key={i} className="my-10 p-6 rounded-2xl bg-accent/8 border border-accent/20">
                  <p className="text-base text-text-primary mb-4 font-medium">{block.text}</p>
                  <Link href={block.link} className="btn-primary inline-flex">{block.label}</Link>
                </div>
              );
            return null;
          })}
        </article>

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10">
            {post.tags.map((tag) => <span key={tag} className="pill text-xs">#{tag}</span>)}
          </div>
        )}

        <div className="mt-12 p-6 rounded-2xl bg-bg-surface border border-bg-border">
          <div className="flex items-start gap-4">
            <img src="/icon-192.png" alt={c.meta.siteName} width={48} height={48} className="w-12 h-12 rounded-xl flex-shrink-0 object-cover" />
            <div>
              <p className="font-body font-semibold text-text-primary mb-1">{c.meta.siteName}</p>
              <p className="text-xs text-text-secondary mb-3">{c.meta.tagline}</p>
              <Link href="/#contact" className="btn-primary btn-sm inline-flex">{t.authorCta}</Link>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t border-bg-border">
            <h3 className="font-body font-semibold text-text-primary mb-6">{t.relatedTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="card card-hover group block p-5">
                  <span className="badge text-xs mb-3 inline-block">{p.category}</span>
                  <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors leading-snug">{p.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Newsletter content={c.newsletter} />
      </div>
    </div>
  );
}

// lib/i18n.ts
import contentFr from "@/data/content.fr.json"
import contentEn from "@/data/content.en.json"

export type Locale = "fr" | "en"
export type SiteContent = typeof contentFr

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  publishedAt: string
  featured?: boolean
  tags?: string[]
}

export function getContent(locale: Locale = "fr"): SiteContent {
  return locale === "en" ? (contentEn as SiteContent) : contentFr
}

// Blog désactivé — restaurer depuis app/_disabled/ si nécessaire
export function getPosts(): Post[] { return [] }
export function getPost(_slug: string): Post | null { return null }

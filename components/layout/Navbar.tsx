// components/layout/Navbar.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher"
import type { getContent, Locale } from "@/lib/i18n"

type NavContent  = ReturnType<typeof getContent>["nav"]
type MetaContent = ReturnType<typeof getContent>["meta"]

interface NavbarProps {
  content: NavContent
  meta: MetaContent
  locale: Locale
}

function resolveHref(href: string, locale: Locale): string {
  const prefix = locale === "en" ? "/en" : ""
  if (href.startsWith("#")) return `${prefix}/${href}`
  if (href.startsWith("/") && !href.startsWith("/en") && locale === "en") {
    return `/en${href}`
  }
  return href
}

export function Navbar({ content, meta, locale }: NavbarProps) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-bg-base/90 backdrop-blur-xl border-b border-bg-border shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "bg-transparent"
      )}
    >
      <nav className="section-container flex items-center justify-between h-16 lg:h-[70px]">
        <Link
          href={locale === "en" ? "/en/" : "/"}
          className="font-display text-xl text-text-primary hover:text-accent transition-colors duration-200"
        >
          {content.logo}
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {content.links.map((link) => (
            <li key={link.href}>
              <Link
                href={resolveHref(link.href, locale)}
                className="px-4 py-2 rounded-lg text-sm font-body text-text-secondary
                           hover:text-text-primary hover:bg-bg-surface transition-all duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <LocaleSwitcher locale={locale} />
          <Link href={resolveHref(content.cta.href, locale)} className="btn-primary btn-sm">
            {content.cta.label}
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={cn("block h-px bg-current transition-all duration-300", menuOpen ? "rotate-45 translate-y-2" : "")} />
            <span className={cn("block h-px bg-current transition-all duration-300", menuOpen ? "opacity-0" : "")} />
            <span className={cn("block h-px bg-current transition-all duration-300", menuOpen ? "-rotate-45 -translate-y-2" : "")} />
          </div>
        </button>
      </nav>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-400 bg-bg-surface border-b border-bg-border",
          menuOpen ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <div className="section-container py-4 flex flex-col gap-1">
          {content.links.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link.href, locale)}
              className="px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary
                         hover:bg-bg-elevated transition-all"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-bg-border flex items-center justify-between gap-3">
            <LocaleSwitcher locale={locale} />
            <Link
              href={resolveHref(content.cta.href, locale)}
              className="btn-primary flex-1 text-center"
              onClick={() => setMenuOpen(false)}
            >
              {content.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

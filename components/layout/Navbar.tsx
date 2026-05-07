"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { getContent } from "@/lib/i18n";

type NavContent = ReturnType<typeof getContent>["nav"];
type MetaContent = ReturnType<typeof getContent>["meta"];

interface NavbarProps {
  content: NavContent;
  meta: MetaContent;
}

function resolveHref(href: string): string {
  // Prefix anchor links with / so they work from any page (e.g. /blog → /#contact)
  if (href.startsWith("#")) return "/" + href;
  return href;
}

export function Navbar({ content, meta }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-bg-base/90 backdrop-blur-xl border-b border-bg-border shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "bg-transparent",
      )}
    >
      <nav className="section-container flex items-center justify-between h-16 lg:h-[70px]">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl text-text-primary hover:text-accent transition-colors duration-200"
        >
          {content.logo}
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
          {content.links.map((link) => (
            <li key={link.href}>
              <Link
                href={resolveHref(link.href)}
                className="px-4 py-2 rounded-lg text-sm font-body text-text-secondary
                           hover:text-text-primary hover:bg-bg-surface transition-all duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href={resolveHref(content.cta.href)}
            className="btn-primary btn-sm"
          >
            {content.cta.label}
          </Link>
        </div>

        {/* Mobile burger */}
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

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-400 bg-bg-surface border-b border-bg-border",
          menuOpen ? "max-h-[500px]" : "max-h-0",
        )}
      >
        <div className="section-container py-4 flex flex-col gap-1">
          {content.links.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link.href)}
              className="px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary
                         hover:bg-bg-elevated transition-all"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-bg-border">
            <Link
              href={resolveHref(content.cta.href)}
              className="btn-primary w-full text-center block"
              onClick={() => setMenuOpen(false)}
            >
              {content.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

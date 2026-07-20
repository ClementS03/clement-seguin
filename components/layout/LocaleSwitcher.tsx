// components/layout/LocaleSwitcher.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n"

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname()

  const getFrPath = () => {
    if (pathname === "/en" || pathname.startsWith("/en/")) {
      return pathname.replace(/^\/en/, "") || "/"
    }
    return pathname
  }

  const getEnPath = () => {
    if (pathname === "/en" || pathname.startsWith("/en/")) return pathname
    return `/en${pathname === "/" ? "" : pathname}`
  }

  return (
    <div className="flex items-center gap-1 text-sm font-body">
      <Link
        href={getFrPath()}
        className={cn(
          "px-1.5 py-0.5 rounded transition-colors duration-200",
          locale === "fr" ? "text-text-primary font-medium" : "text-text-secondary hover:text-text-primary"
        )}
        aria-label="Version française"
      >
        FR
      </Link>
      <span className="text-text-tertiary text-xs">/</span>
      <Link
        href={getEnPath()}
        className={cn(
          "px-1.5 py-0.5 rounded transition-colors duration-200",
          locale === "en" ? "text-text-primary font-medium" : "text-text-secondary hover:text-text-primary"
        )}
        aria-label="English version"
      >
        EN
      </Link>
    </div>
  )
}

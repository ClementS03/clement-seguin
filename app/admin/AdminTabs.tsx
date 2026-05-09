"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const TABS = [
  { label: "Products", href: "/admin/products" },
  { label: "Projects", href: "/admin/projects" },
]

export function AdminTabs() {
  const pathname = usePathname()

  return (
    <div className="border-b border-bg-border">
      <div className="max-w-3xl mx-auto px-6 flex gap-1 pt-2">
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors border-b-2 -mb-px ${
                active
                  ? "text-accent border-accent bg-bg-elevated"
                  : "text-text-secondary border-transparent hover:text-text-primary hover:bg-bg-elevated/50"
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

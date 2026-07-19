import type { ReactNode } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { AdminTabs } from "./AdminTabs"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-accent font-semibold text-sm">← clement-seguin.fr</Link>
        <span className="text-text-tertiary text-xs">Admin</span>
      </header>
      <AdminTabs />
      <main className="max-w-3xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}

import type { ReactNode } from "react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border px-6 py-4 flex items-center gap-6">
        <Link href="/" className="text-accent font-semibold text-sm">CS</Link>
        <span className="text-text-tertiary">/</span>
        <nav className="flex items-center gap-4">
          <Link href="/admin/products" className="text-text-secondary text-sm hover:text-text-primary transition-colors">
            Produits
          </Link>
          <Link href="/admin/projects" className="text-text-secondary text-sm hover:text-text-primary transition-colors">
            Projets
          </Link>
        </nav>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">{children}</main>
    </div>
  )
}

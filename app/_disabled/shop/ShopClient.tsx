"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "./ProductCard"
import type { Product } from "@/lib/airtable"

export function ShopClient({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const seen = new Set<string>()
    products.forEach(p => { if (p.category) seen.add(p.category) })
    return Array.from(seen)
  }, [products])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return products.filter(p => {
      const matchesCategory = !activeCategory || p.category === activeCategory
      const matchesQuery = !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [products, query, activeCategory])

  return (
    <div>
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          type="search"
          placeholder="Search products…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input flex-1"
        />
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={`pill text-xs transition-colors ${!activeCategory ? "border-accent/60 text-accent bg-accent/10" : ""}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`pill text-xs transition-colors ${activeCategory === cat ? "border-accent/60 text-accent bg-accent/10" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-bg-border rounded-2xl">
          <p className="text-text-secondary text-lg mb-2">No products match.</p>
          <button onClick={() => { setQuery(""); setActiveCategory(null) }}
            className="text-accent text-sm hover:underline mt-1">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { ProductForm, type FormValues } from "../../ProductForm"
import type { Product } from "@/lib/airtable"

export function EditProductClient({ product }: { product: Product }) {
  const [saved, setSaved] = useState(false)
  const [buyUrl, setBuyUrl] = useState(product.buyUrl)

  const initial: FormValues = {
    name: product.name,
    slug: product.slug,
    tagline: product.tagline,
    description: product.description,
    price: product.price !== null ? String(product.price) : "",
    category: product.category,
    imageUrl: product.imageUrl ?? "",
    featured: product.featured,
    status: (product.draft ? "Draft" : "Active") as "Draft" | "Active",
    downloadUrl: product.downloadUrl ?? "",
  }

  async function handleSubmit(values: FormValues) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, price: Number(values.price), downloadUrl: values.downloadUrl }),
    })
    const data = await res.json() as { buyUrl?: string; error?: string }
    if (res.ok) {
      if (data.buyUrl) setBuyUrl(data.buyUrl)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      return {}
    }
    return { error: data.error ?? "Something went wrong." }
  }

  return (
    <div className="flex flex-col gap-6">
      {saved && (
        <div className="card flex items-center gap-2"
          style={{ borderColor: "rgba(45,158,107,0.2)", background: "rgba(45,158,107,0.05)" }}>
          <span className="text-accent">✓</span>
          <p className="text-text-primary text-sm font-medium">Saved</p>
          {buyUrl && (
            <a href={buyUrl} target="_blank" rel="noopener noreferrer"
              className="text-accent text-xs hover:underline ml-2">{buyUrl}</a>
          )}
        </div>
      )}

      <ProductForm initial={initial} onSubmit={handleSubmit} submitLabel="Save →" />

      {product.stripeProductId && (
        <div className="card flex flex-col gap-1">
          <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">Stripe</p>
          <p className="text-text-secondary text-xs">Product ID: {product.stripeProductId}</p>
          <p className="text-text-secondary text-xs">Price ID: {product.stripePriceId}</p>
          {buyUrl && (
            <a href={buyUrl} target="_blank" rel="noopener noreferrer"
              className="text-accent text-xs hover:underline mt-1 break-all">{buyUrl}</a>
          )}
        </div>
      )}
    </div>
  )
}

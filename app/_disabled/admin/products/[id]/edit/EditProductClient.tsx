"use client"

import { useState } from "react"
import { ProductForm, type FormValues } from "../../ProductForm"
import type { Product } from "@/lib/airtable"

export function EditProductClient({ product }: { product: Product }) {
  const [saved, setSaved] = useState(false)
  const [buyUrl, setBuyUrl] = useState(product.buyUrl)

  // Promo code state
  const [promoCode, setPromoCode] = useState("")
  const [promoType, setPromoType] = useState<"percent" | "fixed">("percent")
  const [promoAmount, setPromoAmount] = useState("")
  const [promoMax, setPromoMax] = useState("")
  const [generatingPromo, setGeneratingPromo] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [promoError, setPromoError] = useState("")

  const initial: FormValues = {
    name: product.name,
    slug: product.slug,
    tagline: product.tagline,
    description: product.description,
    features: product.features.join("\n"),
    price: product.price !== null ? String(product.price) : "",
    category: product.category,
    imageUrl: product.imageUrl ?? "",
    featured: product.featured,
    status: (product.draft ? "Draft" : product.stripeProductId ? "Active" : "External") as FormValues["status"],
    downloadUrl: product.downloadUrl ?? "",
    buyLinks: product.buyLinks.map(l => `${l.label}|${l.url}`).join("\n"),
  }

  async function handleSubmit(values: FormValues) {
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, price: Number(values.price), downloadUrl: values.downloadUrl, buyLinks: values.buyLinks }),
    })
    const data = await res.json() as { buyUrl?: string; error?: string }
    if (res.ok) {
      if (data.buyUrl) setBuyUrl(data.buyUrl)
      setSaved(true)
      return {}
    }
    return { error: data.error ?? "Something went wrong." }
  }

  async function handleGeneratePromo() {
    setGeneratingPromo(true)
    setPromoError("")
    setGeneratedCode("")
    const res = await fetch(`/api/admin/products/${product.id}/promo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: promoCode || undefined,
        type: promoType,
        amount: Number(promoAmount),
        maxRedemptions: promoMax ? Number(promoMax) : undefined,
      }),
    })
    const data = await res.json() as { code?: string; error?: string }
    if (res.ok && data.code) {
      setGeneratedCode(data.code)
    } else {
      setPromoError(data.error ?? "Failed to generate code")
    }
    setGeneratingPromo(false)
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

      {product.stripeProductId && (
        <div className="card flex flex-col gap-4">
          <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">Generate Promo Code</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Discount type</label>
              <select className="input w-full mt-1" value={promoType}
                onChange={e => setPromoType(e.target.value as "percent" | "fixed")}>
                <option value="percent">Percent off (%)</option>
                <option value="fixed">Fixed amount (€)</option>
              </select>
            </div>
            <div>
              <label className="label">Amount *</label>
              <input type="number" min="1" className="input w-full mt-1"
                value={promoAmount} onChange={e => setPromoAmount(e.target.value)}
                placeholder={promoType === "percent" ? "20" : "10"} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Code (optional)</label>
              <input className="input w-full mt-1 font-mono uppercase" value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                placeholder="LAUNCH20" />
              <p className="text-text-tertiary text-xs mt-1">Leave blank to auto-generate</p>
            </div>
            <div>
              <label className="label">Max uses (optional)</label>
              <input type="number" min="1" className="input w-full mt-1"
                value={promoMax} onChange={e => setPromoMax(e.target.value)}
                placeholder="unlimited" />
            </div>
          </div>

          <button type="button" onClick={handleGeneratePromo}
            disabled={generatingPromo || !promoAmount}
            className="btn-primary self-start">
            {generatingPromo ? "Generating..." : "Generate →"}
          </button>

          {generatedCode && (
            <div className="flex items-center gap-3 p-3 rounded-lg"
              style={{ background: "rgba(45,158,107,0.08)", border: "1px solid rgba(45,158,107,0.25)" }}>
              <span className="text-accent text-sm">✓</span>
              <span className="font-mono font-bold text-text-primary tracking-wider">{generatedCode}</span>
              <button type="button" onClick={() => navigator.clipboard.writeText(generatedCode)}
                className="text-text-tertiary hover:text-text-primary text-xs ml-auto transition-colors">
                Copy
              </button>
            </div>
          )}

          {promoError && (
            <p className="text-red-400 text-xs">⚠️ {promoError}</p>
          )}
        </div>
      )}
    </div>
  )
}

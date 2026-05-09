"use client"

import { useState } from "react"
import Link from "next/link"
import { ProductForm, type FormValues } from "../ProductForm"

export default function NewProductPage() {
  const [result, setResult] = useState<{ buyUrl?: string; isDraft: boolean } | null>(null)

  async function handleSubmit(values: FormValues) {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, price: Number(values.price) }),
    })
    const data = await res.json() as { buyUrl?: string; error?: string }
    if (res.ok) {
      setResult({ buyUrl: data.buyUrl, isDraft: values.status === "Draft" })
      return {}
    }
    return { error: data.error ?? "Something went wrong." }
  }

  if (result) {
    return (
      <div className="flex flex-col gap-6">
        <div className="card flex flex-col gap-3"
          style={{ borderColor: "rgba(45,158,107,0.2)", background: "rgba(45,158,107,0.05)" }}>
          <h2 className="text-text-primary font-medium">
            {result.isDraft ? "Draft saved ✓" : "Product published ✓"}
          </h2>
          {result.buyUrl && (
            <>
              <p className="text-text-secondary text-sm">Checkout URL:</p>
              <a href={result.buyUrl} target="_blank" rel="noopener noreferrer"
                className="text-accent text-sm break-all hover:underline">{result.buyUrl}</a>
              <p className="text-text-tertiary text-xs">
                Attach the deliverable file in LemonSqueezy before promoting this product.
              </p>
            </>
          )}
          {result.isDraft && (
            <p className="text-text-secondary text-sm">
              Saved as draft — not yet in LemonSqueezy. Edit it to publish.
            </p>
          )}
        </div>
        <Link href="/admin/products" className="btn-primary self-start">← Back to products</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary mb-2">New product</h1>
          <p className="text-text-secondary text-sm">
            Draft = Airtable only · Publish = Airtable + LemonSqueezy
          </p>
        </div>
        <Link href="/admin/products" className="text-text-secondary text-sm hover:text-text-primary">← Products</Link>
      </div>
      <ProductForm onSubmit={handleSubmit} submitLabel="Create product →" />
    </div>
  )
}

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
    return { error: data.error ?? "Une erreur s'est produite." }
  }

  if (result) {
    return (
      <div className="flex flex-col gap-6">
        <div className="card flex flex-col gap-3"
          style={{ borderColor: "rgba(45,158,107,0.2)", background: "rgba(45,158,107,0.05)" }}>
          <h2 className="text-text-primary font-medium">
            {result.isDraft ? "Draft sauvegardé ✓" : "Produit publié ✓"}
          </h2>
          {result.buyUrl && (
            <>
              <p className="text-text-secondary text-sm">URL de checkout :</p>
              <a href={result.buyUrl} target="_blank" rel="noopener noreferrer"
                className="text-accent text-sm break-all hover:underline">{result.buyUrl}</a>
              <p className="text-text-tertiary text-xs">
                Attache le fichier livrable dans LemonSqueezy avant de mettre en avant ce produit.
              </p>
            </>
          )}
          {result.isDraft && (
            <p className="text-text-secondary text-sm">
              Sauvegardé en draft — pas encore dans LemonSqueezy. Édite-le pour le publier.
            </p>
          )}
        </div>
        <Link href="/admin/products" className="btn-primary self-start">← Retour aux produits</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary mb-2">Nouveau produit</h1>
          <p className="text-text-secondary text-sm">
            Draft = Airtable uniquement · Publier = Airtable + LemonSqueezy
          </p>
        </div>
        <Link href="/admin/products" className="text-text-secondary text-sm hover:text-text-primary">← Produits</Link>
      </div>
      <ProductForm onSubmit={handleSubmit} submitLabel="Créer le produit →" />
    </div>
  )
}

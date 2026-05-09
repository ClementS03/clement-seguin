"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function DeleteButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Supprimer "${productName}" ? Cette action est irréversible.`)) return
    setLoading(true)
    const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" })
    const data = await res.json() as { lsWarning?: string }
    if (data.lsWarning) alert(`Airtable supprimé, mais LS a retourné une erreur : ${data.lsWarning}`)
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-text-tertiary hover:text-red-400 text-sm transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Supprimer"}
    </button>
  )
}

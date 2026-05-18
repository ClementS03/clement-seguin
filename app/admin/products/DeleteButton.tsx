"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function DeleteButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete "${productName}"? This cannot be undone.`)) return
    setLoading(true)
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" })
    router.refresh()
    setLoading(false)
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="text-text-tertiary hover:text-red-400 text-sm transition-colors disabled:opacity-50">
      {loading ? "..." : "Delete"}
    </button>
  )
}

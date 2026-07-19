"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function DeleteButton({ projectId, projectName }: { projectId: string; projectName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete "${projectName}"?`)) return
    setLoading(true)
    await fetch(`/api/admin/projects/${projectId}`, { method: "DELETE" })
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

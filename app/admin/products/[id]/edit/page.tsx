import { getProductById } from "@/lib/airtable"
import { notFound } from "next/navigation"
import Link from "next/link"
import { EditProductClient } from "./EditProductClient"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary mb-1">{product.name}</h1>
          <p className="text-text-secondary text-sm">
            {product.draft
              ? "Draft — not yet in LemonSqueezy"
              : product.lsVariantId
              ? "Active · synced with LS"
              : "Active · no LS sync"}
          </p>
        </div>
        <Link href="/admin/products" className="text-text-secondary text-sm hover:text-text-primary">← Products</Link>
      </div>
      <EditProductClient product={product} />
    </div>
  )
}

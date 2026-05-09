import Link from "next/link"
import { getProductsAdmin } from "@/lib/airtable"
import { DeleteButton } from "./DeleteButton"

const STATUS_STYLE: Record<string, string> = {
  Active: "badge-accent",
  "Coming Soon": "badge-teal",
  Archived: "text-text-tertiary text-xs",
}

export default async function AdminProductsPage() {
  const products = await getProductsAdmin()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary mb-1">Products</h1>
          <p className="text-text-secondary text-sm">{products.length} product{products.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary btn-sm">+ New</Link>
      </div>

      {products.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-text-secondary">No products yet. <Link href="/admin/products/new" className="text-accent hover:underline">Create the first one →</Link></p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <div key={p.id} className="card flex items-center gap-4">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name}
                  className="w-16 h-10 object-cover rounded border border-bg-border flex-shrink-0" />
              ) : (
                <div className="w-16 h-10 bg-bg-elevated rounded border border-bg-border flex-shrink-0 flex items-center justify-center">
                  <span className="text-text-tertiary text-xs">—</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-text-primary font-medium text-sm truncate">{p.name}</span>
                  {p.draft
                    ? <span className="badge-teal">Draft</span>
                    : <span className={STATUS_STYLE[p.status] ?? "badge-accent"}>{p.status}</span>
                  }
                  {!p.draft && !p.lsVariantId && (
                    <span className="text-text-tertiary text-xs">· not in LS</span>
                  )}
                </div>
                <p className="text-text-tertiary text-xs mt-0.5">{p.tagline}</p>
              </div>

              <span className="text-text-primary font-display text-lg flex-shrink-0">
                {p.price !== null ? `€${p.price}` : "Free"}
              </span>

              <div className="flex items-center gap-4 flex-shrink-0">
                <Link href={`/admin/products/${p.id}/edit`} className="text-accent text-sm hover:underline">Edit</Link>
                <DeleteButton productId={p.id} productName={p.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

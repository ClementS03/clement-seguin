import Link from "next/link"
import { getProductsAdmin } from "@/lib/airtable"
import { DeleteButton } from "./DeleteButton"

const STATUS_STYLE: Record<string, string> = {
  Active: "badge-accent",
  Draft: "badge-teal",
  "Coming Soon": "badge-teal",
  Archived: "text-text-tertiary text-xs",
}

export default async function AdminProductsPage() {
  const products = await getProductsAdmin()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary mb-1">Produits</h1>
          <p className="text-text-secondary text-sm">{products.length} produit{products.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary btn-sm">+ Nouveau</Link>
      </div>

      {products.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-text-secondary">Aucun produit. <Link href="/admin/products/new" className="text-accent hover:underline">Créer le premier →</Link></p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((p) => (
            <div key={p.id} className="card flex items-center gap-4">
              {/* Thumbnail */}
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name}
                  className="w-16 h-10 object-cover rounded border border-bg-border flex-shrink-0" />
              ) : (
                <div className="w-16 h-10 bg-bg-elevated rounded border border-bg-border flex-shrink-0 flex items-center justify-center">
                  <span className="text-text-tertiary text-xs">—</span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-text-primary font-medium text-sm truncate">{p.name}</span>
                  <span className={STATUS_STYLE[p.status] ?? "text-text-tertiary text-xs"}>
                    {p.status}
                  </span>
                  {!p.lsVariantId && p.status !== "Draft" && (
                    <span className="text-text-tertiary text-xs">· pas dans LS</span>
                  )}
                </div>
                <p className="text-text-tertiary text-xs mt-0.5">{p.tagline}</p>
              </div>

              {/* Price */}
              <span className="text-text-primary font-display text-lg flex-shrink-0">
                {p.price !== null ? `€${p.price}` : "Free"}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <Link href={`/admin/products/${p.id}/edit`}
                  className="text-accent text-sm hover:underline">
                  Éditer
                </Link>
                <DeleteButton productId={p.id} productName={p.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

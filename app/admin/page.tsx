import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-2">Admin</h1>
        <p className="text-text-secondary text-sm">Gestion des produits.</p>
      </div>

      <div className="grid gap-4">
        <Link
          href="/admin/products/new"
          className="card card-hover flex items-center justify-between group"
        >
          <div>
            <h2 className="text-text-primary font-medium">Nouveau produit</h2>
            <p className="text-text-secondary text-sm mt-1">
              Crée dans LemonSqueezy + Airtable en un clic
            </p>
          </div>
          <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  )
}

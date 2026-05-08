import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/airtable";
import type { Product } from "@/lib/airtable";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop — Templates & Tools",
  description:
    "Templates and tools I built and use myself — to help creators and freelancers grow online.",
};

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/boutique/${product.slug}`}
      className="card card-hover group flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {product.category && (
            <span className="badge-accent text-xs mb-3 inline-block">
              {product.category}
            </span>
          )}
          <h2 className="font-display text-xl text-text-primary group-hover:text-accent transition-colors duration-200">
            {product.name}
          </h2>
        </div>
        {product.status === "Coming Soon" && (
          <span className="badge-teal shrink-0">Soon</span>
        )}
      </div>

      <p className="text-text-secondary text-sm leading-relaxed flex-1">
        {product.tagline}
      </p>

      {product.stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {product.stack.map((s) => (
            <span key={s} className="pill text-xs">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-bg-border">
        <span className="font-display text-2xl text-text-primary">
          {product.price !== null ? `€${product.price}` : "Free"}
        </span>
        <span className="text-accent text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
          View →
        </span>
      </div>
    </Link>
  );
}

export default async function BoutiquePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container">
          <header className="text-center mb-16 reveal">
            <div className="badge-accent mb-6 inline-block">Shop</div>
            <h1 className="section-headline mb-4">Templates &amp; Tools</h1>
            <p className="section-subheadline max-w-xl mx-auto">
              Resources I built and use myself — templates, automations, and tools
              to help creators grow online.
            </p>
          </header>

          {products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-text-secondary text-lg mb-2">Products coming soon.</p>
              <p className="text-text-tertiary text-sm">
                Follow me for updates as I build and release new tools.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

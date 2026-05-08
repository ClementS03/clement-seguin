import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/airtable";
import type { Product } from "@/lib/airtable";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop — Templates & Tools",
  description:
    "Resources I built and use myself — templates, automations, and tools to help creators grow online.",
};

const STATUS_BADGE: Record<string, { label: string; cls: string } | null> = {
  "Coming Soon": { label: "Soon", cls: "badge-teal" },
  Active: null,
};

function ProductCard({ product }: { product: Product }) {
  const badge = STATUS_BADGE[product.status];

  return (
    <Link
      href={`/boutique/${product.slug}`}
      className="card card-hover group flex flex-col gap-0 !p-0 overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-video bg-bg-elevated overflow-hidden relative">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full hero-glow flex items-center justify-center">
            <span className="text-text-tertiary text-xs tracking-widest uppercase">
              {product.category || "Product"}
            </span>
          </div>
        )}
        {/* Status pill over image */}
        {badge && (
          <span className={`absolute top-3 right-3 ${badge.cls}`}>{badge.label}</span>
        )}
        {!badge && (
          <span className="absolute top-3 right-3 text-xs text-accent font-medium bg-bg-base/80 backdrop-blur-sm px-2 py-1 rounded-full border border-accent-border">
            ● Available
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {product.category && (
          <span className="badge-accent text-xs self-start">{product.category}</span>
        )}

        <h2 className="font-display text-xl text-text-primary group-hover:text-accent transition-colors duration-200 leading-snug">
          {product.name}
        </h2>

        <p className="text-text-secondary text-sm leading-relaxed flex-1">
          {product.tagline}
        </p>

        {product.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.stack.map((s) => (
              <span key={s} className="pill text-xs">{s}</span>
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
      </div>
    </Link>
  );
}

export default async function BoutiquePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);
  const rest = products.filter((p) => !p.featured);
  const ordered = [...featured, ...rest];

  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container">
          {/* Header */}
          <header className="mb-16">
            <div className="badge-accent mb-5 inline-block">Shop</div>
            <h1 className="section-headline mb-4">Templates &amp; Tools</h1>
            <p className="section-subheadline max-w-xl">
              Resources I built and use myself — to help independent professionals grow
              faster online.
            </p>
          </header>

          {ordered.length === 0 ? (
            <div className="text-center py-32 border border-bg-border rounded-2xl">
              <p className="text-text-secondary text-lg mb-2">First products coming soon.</p>
              <p className="text-text-tertiary text-sm">
                Follow me on{" "}
                <a href="https://x.com/clembuild" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  X / Twitter
                </a>{" "}
                for updates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ordered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/airtable";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const isSoon = product.status === "Coming Soon";

  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container max-w-3xl">
          <Link
            href="/boutique"
            className="text-text-secondary hover:text-text-primary text-sm transition-colors mb-10 inline-flex items-center gap-2"
          >
            ← Back to shop
          </Link>

          <div className="mb-5 flex items-center gap-3 flex-wrap">
            {product.category && (
              <span className="badge-accent">{product.category}</span>
            )}
            {isSoon && <span className="badge-teal">Coming Soon</span>}
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            {product.name}
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            {product.tagline}
          </p>

          <div className="flex items-center gap-5 mb-14">
            <span className="font-display text-4xl text-text-primary">
              {product.price !== null ? `€${product.price}` : "Free"}
            </span>
            {product.buyUrl && !isSoon ? (
              <a
                href={product.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Buy now →
              </a>
            ) : (
              <span className="btn-secondary opacity-60 cursor-default pointer-events-none">
                Coming soon
              </span>
            )}
          </div>

          {product.description && (
            <div className="card mb-10">
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {product.stack.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-3">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.stack.map((s) => (
                  <span key={s} className="pill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span key={t} className="badge-accent text-xs">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

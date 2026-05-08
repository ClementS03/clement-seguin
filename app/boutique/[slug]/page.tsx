import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/airtable";
import { MediaGallery } from "../MediaGallery";

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
    openGraph: product.imageUrl
      ? { images: [{ url: product.imageUrl }] }
      : undefined,
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
  const hasMedia =
    product.videoUrl || product.gallery.length > 0 || product.imageUrl;

  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container max-w-4xl">
          <Link
            href="/boutique"
            className="text-text-secondary hover:text-text-primary text-sm transition-colors mb-10 inline-flex items-center gap-2"
          >
            ← Back to shop
          </Link>

          <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
            {/* Left — media + description */}
            <div>
              {/* Media gallery */}
              {hasMedia && (
                <MediaGallery
                  imageUrl={product.imageUrl}
                  gallery={product.gallery}
                  videoUrl={product.videoUrl}
                  productName={product.name}
                />
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-4">
                    About this product
                  </h2>
                  <div className="card">
                    <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {product.tags.map((t) => (
                    <span key={t} className="badge-accent text-xs">{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Right — sticky sidebar */}
            <div className="lg:sticky lg:top-28 flex flex-col gap-5">
              {/* Badges */}
              <div className="flex items-center gap-3 flex-wrap">
                {product.category && (
                  <span className="badge-accent">{product.category}</span>
                )}
                {isSoon && <span className="badge-teal">Coming Soon</span>}
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl text-text-primary leading-tight">
                {product.name}
              </h1>

              <p className="text-text-secondary leading-relaxed">{product.tagline}</p>

              {/* Price + CTA */}
              <div className="card flex flex-col gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl text-text-primary">
                    {product.price !== null ? `€${product.price}` : "Free"}
                  </span>
                  {product.price !== null && (
                    <span className="text-text-tertiary text-sm">excl. VAT</span>
                  )}
                </div>

                {product.buyUrl && !isSoon ? (
                  <a
                    href={product.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full text-center"
                  >
                    Buy now →
                  </a>
                ) : (
                  <span className="btn-secondary w-full text-center opacity-60 cursor-default pointer-events-none">
                    Coming soon
                  </span>
                )}

                {product.price !== null && product.price > 0 && (
                  <p className="text-text-tertiary text-xs text-center">
                    One-time purchase · Instant download
                  </p>
                )}
              </div>

              {/* Stack */}
              {product.stack.length > 0 && (
                <div>
                  <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-3">
                    Stack
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {product.stack.map((s) => (
                      <span key={s} className="pill">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

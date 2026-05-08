import type { Metadata } from "next";
import { getProducts } from "@/lib/airtable";
import { ProductCard } from "./ProductCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop — Templates & Tools",
  description:
    "Resources I built and use myself — templates, automations, and tools to help creators grow online.",
};

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

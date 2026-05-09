"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/airtable";

const STATUS_BADGE: Record<string, { label: string; cls: string } | null> = {
  "Coming Soon": { label: "Soon", cls: "badge-teal" },
  Active: null,
};

export function ProductCard({ product }: { product: Product }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const badge = STATUS_BADGE[product.status];

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="card card-hover group flex flex-col gap-0 !p-0 overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-video bg-bg-elevated overflow-hidden relative">
        {/* Placeholder while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 hero-glow flex items-center justify-center">
            <span className="text-text-tertiary text-xs tracking-widest uppercase">
              {product.category || "Product"}
            </span>
          </div>
        )}

        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
          />
        )}

        {/* Status pill */}
        {badge ? (
          <span className={`absolute top-3 right-3 ${badge.cls}`}>{badge.label}</span>
        ) : (
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

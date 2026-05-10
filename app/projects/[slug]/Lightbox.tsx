"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export function Lightbox({ images }: { images: string[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(() => setOpen(i => i !== null ? (i - 1 + images.length) % images.length : null), [images.length]);
  const next = useCallback(() => setOpen(i => i !== null ? (i + 1) % images.length : null), [images.length]);

  useEffect(() => {
    if (open === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, close, prev, next]);

  useEffect(() => {
    document.body.style.overflow = open !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Thumbnails grid */}
      <div className={`grid gap-3 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
        {images.map((src, i) => (
          <button key={i} onClick={() => setOpen(i)}
            className="relative aspect-video overflow-hidden rounded-lg border border-bg-border hover:border-accent/40 transition-colors cursor-zoom-in group">
            <Image src={src} alt={`Screenshot ${i + 1}`} fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {open !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}>
          <button onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-xl">
                ‹
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-xl">
                ›
              </button>
            </>
          )}

          <div className="relative w-full max-w-5xl max-h-[85vh] aspect-video" onClick={e => e.stopPropagation()}>
            <Image src={images[open]} alt={`Screenshot ${open + 1}`} fill
              className="object-contain" sizes="100vw" priority />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setOpen(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === open ? "bg-white" : "bg-white/30"}`} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

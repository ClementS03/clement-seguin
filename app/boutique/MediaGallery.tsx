"use client";

import { useState } from "react";
import Image from "next/image";

type MediaItem =
  | { type: "video"; url: string; embedUrl: string }
  | { type: "image"; url: string };

function toEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

function buildItems(
  imageUrl: string | null,
  gallery: string[],
  videoUrl: string | null,
): MediaItem[] {
  const items: MediaItem[] = [];

  if (videoUrl) {
    items.push({ type: "video", url: videoUrl, embedUrl: toEmbedUrl(videoUrl) });
  }

  const images = [
    ...(imageUrl ? [imageUrl] : []),
    ...gallery.filter((u) => u !== imageUrl),
  ];
  items.push(...images.map((url): MediaItem => ({ type: "image", url })));

  return items;
}

interface MediaGalleryProps {
  imageUrl: string | null;
  gallery: string[];
  videoUrl: string | null;
  productName: string;
}

export function MediaGallery({
  imageUrl,
  gallery,
  videoUrl,
  productName,
}: MediaGalleryProps) {
  const items = buildItems(imageUrl, gallery, videoUrl);
  const [current, setCurrent] = useState(0);

  if (items.length === 0) return null;

  const active = items[current];

  return (
    <div className="mb-10">
      {/* Main viewer */}
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-bg-elevated border border-bg-border mb-3 relative">
        {active.type === "video" ? (
          <iframe
            src={active.embedUrl}
            title={productName}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Image
            src={active.url}
            alt={productName}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
            priority
          />
        )}
      </div>

      {/* Thumbnails — only if more than one item */}
      {items.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 relative ${
                i === current
                  ? "border-accent opacity-100"
                  : "border-bg-border opacity-50 hover:opacity-80"
              }`}
            >
              {item.type === "video" ? (
                <div className="w-full h-full bg-bg-elevated flex items-center justify-center">
                  <span className="text-accent text-lg">▶</span>
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

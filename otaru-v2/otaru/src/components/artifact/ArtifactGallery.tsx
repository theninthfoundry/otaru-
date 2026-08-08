"use client";

import Image from "next/image";
import { useState } from "react";
import type { ArtifactImage } from "@/types/shopify";
import { cn } from "@/lib/utils";

export function ArtifactGallery({ images, title }: { images: ArtifactImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="grid grid-cols-[80px_1fr] gap-4">
      <div className="flex flex-col gap-3">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-[4/5] overflow-hidden rounded-sm bg-surface-alt transition-opacity duration-1",
              i === active ? "opacity-100 ring-1 ring-otaru-ink" : "opacity-60 hover:opacity-100"
            )}
          >
            <Image src={img.url} alt={img.altText ?? `${title} thumbnail ${i + 1}`} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-surface-alt">
        {current && (
          <Image src={current.url} alt={current.altText ?? title} fill sizes="(min-width: 1024px) 50vw, 90vw" className="object-cover" priority />
        )}
      </div>
    </div>
  );
}

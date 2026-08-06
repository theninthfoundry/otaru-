'use client';

import { useState } from 'react';
import type { ShopifyImage } from '@/lib/shopify/types';

/**
 * Image gallery with thumbnail selection.
 */
interface ArtifactGalleryProps {
  images: ShopifyImage[];
  artifactName: string;
}

export function ArtifactGallery({ images, artifactName }: ArtifactGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-otaru-cream flex items-center justify-center">
        <span className="text-body-sm text-otaru-ink-subtle">No images</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div id="artifact-gallery-inner">
      {/* Main Image */}
      <div className="aspect-[3/4] overflow-hidden bg-otaru-cream">
        {selectedImage && (
          <img
            src={selectedImage.url}
            alt={selectedImage.altText ?? `${artifactName} - Image ${selectedIndex + 1}`}
            width={selectedImage.width}
            height={selectedImage.height}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          className="mt-3 flex gap-2 overflow-x-auto"
          role="tablist"
          aria-label="Image thumbnails"
        >
          {images.map((image, index) => (
            <button
              key={image.url}
              onClick={() => setSelectedIndex(index)}
              className={`aspect-square w-16 flex-shrink-0 overflow-hidden ${
                index === selectedIndex
                  ? 'ring-2 ring-otaru-ink'
                  : 'opacity-60 hover:opacity-100'
              }`}
              role="tab"
              aria-selected={index === selectedIndex}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image.url}
                alt=""
                width={64}
                height={64}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';

interface LookbookImage {
  id: string;
  url: string;
  caption?: string;
  artifactHandle?: string;
}

interface LookbookSliderProps {
  images: LookbookImage[];
  chapterTitle?: string;
}

export function LookbookSlider({ images, chapterTitle = 'Chapter Lookbook' }: LookbookSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const currentImage = images[activeIndex] || images[0];
  if (!currentImage) return null;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-overline uppercase tracking-widest text-otaru-ink-subtle text-[11px] font-semibold">
          {chapterTitle} &bull; Archival Lookbook
        </span>
        <div className="flex items-center gap-2 font-mono text-caption text-xs text-otaru-ink">
          <span>{String(activeIndex + 1).padStart(2, '0')}</span>
          <span className="text-otaru-ink-subtle">/</span>
          <span className="text-otaru-ink-subtle">{String(images.length).padStart(2, '0')}</span>
        </div>
      </div>

      <div className="relative aspect-[16/9] md:aspect-[21/9] bg-otaru-cream overflow-hidden rounded-sm group">
        <img
          src={currentImage.url}
          alt={currentImage.caption || `Lookbook image ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-700 ease-out"
        />

        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-otaru-ink/70 backdrop-blur-md text-otaru-chalk rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-otaru-ink"
          aria-label="Previous Lookbook Frame"
        >
          &larr;
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-otaru-ink/70 backdrop-blur-md text-otaru-chalk rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-otaru-ink"
          aria-label="Next Lookbook Frame"
        >
          &rarr;
        </button>

        {currentImage.caption && (
          <div className="absolute bottom-4 left-4 right-4 p-4 bg-otaru-ink/80 backdrop-blur-md text-otaru-chalk rounded-xs text-caption text-xs font-light max-w-md">
            {currentImage.caption}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(i)}
            className={`w-16 h-12 rounded-xs overflow-hidden border-2 transition-all shrink-0 ${
              i === activeIndex
                ? 'border-otaru-ink scale-105'
                : 'border-transparent opacity-50 hover:opacity-100'
            }`}
          >
            <img src={img.url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/lib/catalog';
import { useCurrency } from '@/lib/currency';
import { ImagePlaceholder, AspectRatio } from '@/components/ui/ImagePlaceholder';

interface ObjectCardProps {
  id: string;
  product: Product;
  ratio?: AspectRatio;
  priority?: boolean;
}

const KANJI_MAP: Record<string, string> = {
  '041': '山', // Yama (Mountain)
  '042': '織', // Weave (Kiryū)
  '043': '風', // Wind (Biratori)
  '044': '舟', // Boat (Ōmi)
  '038': '港', // Harbor
  '037': '川', // River
  '036': '雪', // Snow
  '035': '野', // Field
  '034': '雨', // Rain
  '033': '霜', // Frost
};

/**
 * ObjectCard — Archival Object Presentation
 * 
 * Replaces commercial ecommerce card patterns with an intentional,
 * quiet archival record: sharp edges, tactile imagery, visible origin & price,
 * and seamless secondary study on hover.
 */
export function ObjectCard({ id, product, ratio = 'portrait' }: ObjectCardProps) {
  const { formatPrice } = useCurrency();
  const kanji = KANJI_MAP[id] || '物';
  const remainingCount = product.sizes.reduce((sum, s) => sum + s[1], 0);

  return (
    <article className="group flex flex-col justify-between h-full bg-[var(--paper)] text-[var(--ink)]">
      <div>
        {/* Archival Image Frame */}
        <Link 
          href={`/product/${id}`}
          className="block relative overflow-hidden border border-hairline bg-[var(--paper-2)] transition-colors hover:border-[var(--ink)]/40"
          aria-label={`View ${product.name} (${product.objectNumber})`}
        >
          <ImagePlaceholder
            ratio={ratio}
            label={`Artifact ${id} — ${product.name}`}
            alt={`${product.name} — ${product.material.split(',')[0]}`}
            enableHoverSwap={true}
          />

          {/* Top Archival Header Bar */}
          <div className="absolute top-0 left-0 right-0 p-3.5 flex items-center justify-between pointer-events-none z-10 bg-gradient-to-b from-black/40 via-black/10 to-transparent text-white/90">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
              {product.objectNumber}
            </span>
            <span className="w-5 h-5 flex items-center justify-center font-serif text-xs border border-white/20 bg-black/30 backdrop-blur-xs">
              {kanji}
            </span>
          </div>

          {/* Bottom Hover Drawer */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5 flex items-center justify-between z-10 bg-gradient-to-t from-[var(--ink)]/90 via-[var(--ink)]/60 to-transparent text-[var(--paper)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--paper)]/80">
              {product.origin.split('·')[0].trim()}
            </span>
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--paper)] flex items-center gap-1">
              <span>View Object</span>
              <span>→</span>
            </span>
          </div>
        </Link>

        {/* Object Typography & Provenance */}
        <div className="pt-4 flex flex-col">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-lg sm:text-xl text-[var(--ink)] group-hover:text-[var(--indigo)] transition-colors">
              <Link href={`/product/${id}`}>
                {product.name}
              </Link>
            </h3>
            <span className="font-mono text-sm font-medium text-[var(--ink)] whitespace-nowrap">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="text-xs text-[var(--ink-muted)] mt-1.5 line-clamp-1 font-sans">
            {product.material.split(',')[0]}
          </p>

          <div className="mt-3 pt-3 border-t border-hairline flex items-center justify-between text-[11px] font-mono text-[var(--ink-muted)]">
            <span className="uppercase tracking-wider">{product.firstRelease}</span>
            <span>{remainingCount > 0 ? `${remainingCount} pieces left` : 'Archived'}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

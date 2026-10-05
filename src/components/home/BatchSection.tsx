'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useCurrency } from '@/lib/currency';
import { useCart } from '@/lib/cart';
import { PRODUCT_CATALOG } from '@/lib/catalog';

const BATCH_IDS = ['041', '042', '043', '044'];

export function BatchSection() {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const item = PRODUCT_CATALOG[id];
    if (!item) return;

    addToCart({
      id: `${id}-M`,
      name: item.name,
      meta: item.material.split(',')[0] || '',
      price: item.price,
      size: item.sizes[0] ? item.sizes[0][0] : 'One Size',
    });

    setAddedId(id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <section className="section-pad bg-[var(--paper)] text-[var(--ink)]" id="batch" aria-labelledby="batch-heading">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-hairline">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
              Batch 01 · Hand-Numbered
            </span>
            <h2 id="batch-heading" className="display-l text-[var(--ink)]">
              This week's batch.
            </h2>
          </div>
          <p className="text-sm text-[var(--ink)]/65 max-w-[38ch] leading-relaxed">
            Cut and botanical-dyed in small numbers. Once the run allocation concludes, the pattern enters permanent archive.
          </p>
        </div>

        {/* Asymmetric 12-Col Layout: Large (7) / Tall (5) / Small (6) / Small (6) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pt-12">
          
          {BATCH_IDS.map((id, index) => {
            const item = PRODUCT_CATALOG[id];
            if (!item) return null;

            // Extract total pieces and calculate live remaining count from sizes
            const totalPieces = item.runQuantity ? parseInt(item.runQuantity.split(' ')[0] ?? '44', 10) || 44 : 44;
            const remainingCount = item.sizes.reduce((sum, s) => sum + s[1], 0);
            const isJustAdded = addedId === id;

            // Assign asymmetric 12-column spans
            const colSpan =
              index === 0
                ? 'col-span-full lg:col-span-7' // Large
                : index === 1
                ? 'col-span-full lg:col-span-5' // Tall
                : 'col-span-full sm:col-span-6 lg:col-span-6'; // Small

            const ratio = index === 1 ? 'tall' : 'portrait';

            return (
              <div key={id} className={`group ${colSpan} flex flex-col justify-between`}>
                <Link href={`/product/${id}`} className="block relative overflow-hidden border border-hairline bg-[var(--paper-2)]">
                  <ImagePlaceholder ratio={ratio} label={`Artifact ${id} — ${item.name}`} />
                  
                  {/* Subtle Quick-Add Button appearing on hover */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, id)}
                    className="absolute bottom-4 right-4 z-10 text-xs font-mono tracking-wider uppercase px-4 py-2 bg-[var(--indigo)] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[var(--indigo-hover)] shadow-sm"
                    aria-label={`Quick add ${item.name} to archive bag`}
                  >
                    {isJustAdded ? 'Added ✓' : '+ Add to Archive'}
                  </button>
                </Link>

                {/* Single Mono Line: Price + Pieces Remaining */}
                <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl text-[var(--ink)] group-hover:opacity-75 transition-opacity">
                      <Link href={`/product/${id}`}>{item.name}</Link>
                    </h3>
                    <p className="text-xs text-[var(--ink-muted)] mt-1 line-clamp-1">
                      {item.material.split(',')[0]}
                    </p>
                  </div>
                  
                  {/* The strict single mono line specification */}
                  <div className="font-mono text-xs tracking-wider text-[var(--ink-muted)] whitespace-nowrap">
                    {formatPrice(item.price)} · {remainingCount} of {totalPieces} REMAIN
                  </div>
                </div>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

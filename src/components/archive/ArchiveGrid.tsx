'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useCurrency } from '@/lib/currency';
import { useCart } from '@/lib/cart';
import { Product } from '@/lib/catalog';

interface ArchiveGridProps {
  products: { id: string; product: Product }[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onResetFilters?: () => void;
}

export function ArchiveGrid({ products, page, totalPages, onPageChange, onResetFilters }: ArchiveGridProps) {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleQuickAdd = (e: React.MouseEvent, id: string, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: `${id}-M`,
      name: product.name,
      meta: product.material.split(',')[0] || '',
      price: product.price,
      size: product.sizes[0] ? product.sizes[0][0] : 'One Size',
    });

    setAddedId(id);
    setTimeout(() => setAddedId(null), 1800);
  };

  if (products.length === 0) {
    return (
      <div className="py-20 text-center border border-hairline bg-[var(--paper-2)] p-12 max-w-lg mx-auto my-12">
        <span className="font-mono text-2xl text-[var(--ink-muted)] block mb-3">◇</span>
        <h3 className="font-display text-2xl text-[var(--ink)] mb-2">No matching objects</h3>
        <p className="text-sm text-[var(--ink)]/65 leading-relaxed mb-6">
          The permanent archive holds records for past runs even when exhausted. Try resetting category or sorting filters.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-6 py-2.5 bg-[var(--indigo)] text-white font-mono text-xs uppercase tracking-wider hover:bg-[var(--indigo-hover)] transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* 2-col mobile / 4-col desktop grid per Prompt 4 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mt-10">
        {products.map(({ id, product }) => {
          const isSoldOut = product.sizes.every((s) => s[1] === 0);
          const isJustAdded = addedId === id;

          return (
            <div key={id} className="group flex flex-col justify-between">
              <div className="relative overflow-hidden border border-hairline bg-[var(--paper-2)]">
                <Link href={`/product/${id}`} className="block">
                  <ImagePlaceholder ratio="portrait" label={`No. ${id} — ${product.name}`} />
                </Link>

                {/* Sold out badge */}
                {isSoldOut ? (
                  <span className="absolute top-2 left-2 z-10 font-mono text-[9px] uppercase tracking-wider bg-[var(--paper)]/90 border border-hairline px-2 py-0.5 text-[var(--ink-muted)]">
                    Exhausted
                  </span>
                ) : (
                  /* Quick-Add on Hover */
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(e, id, product)}
                    className="absolute bottom-2 right-2 z-10 font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 bg-[var(--indigo)] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[var(--indigo-hover)]"
                    aria-label={`Quick add ${product.name}`}
                  >
                    {isJustAdded ? 'Added ✓' : '+ Add'}
                  </button>
                )}
              </div>

              {/* Card Meta */}
              <div className="pt-3">
                <div className="flex items-baseline justify-between font-mono text-[10px] uppercase text-[var(--ink-muted)]">
                  <span>No. {id}</span>
                  <span>{formatPrice(product.price)}</span>
                </div>
                <h3 className="font-display text-base sm:text-lg text-[var(--ink)] mt-1 group-hover:opacity-75 transition-opacity line-clamp-1">
                  <Link href={`/product/${id}`}>{product.name}</Link>
                </h3>
                <p className="text-xs text-[var(--ink)]/60 line-clamp-1 mt-0.5">
                  {product.material.split(',')[0]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Archive pagination" className="mt-16 flex justify-center items-center gap-2">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 font-mono text-xs flex items-center justify-center border transition-colors ${
                p === page
                  ? 'bg-[var(--indigo)] text-white border-[var(--indigo)]'
                  : 'bg-[var(--paper)] text-[var(--ink)] border-hairline hover:border-[var(--ink)]'
              }`}
            >
              {p}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

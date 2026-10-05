'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/catalog';
import { useCurrency } from '@/lib/currency';
import { useCart } from '@/lib/cart';
import clsx from 'clsx';

interface ArchiveQuickViewProps {
  productId: string | null;
  product: Product | null;
  onClose: () => void;
}

/**
 * ArchiveQuickView — Quick-inspect side panel for the archive grid
 */
export function ArchiveQuickView({ productId, product, onClose }: ArchiveQuickViewProps) {
  const { formatPrice } = useCurrency();
  const { addToCart, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  if (!productId || !product) return null;

  const isOneSize = product.sizes.length === 1 && product.sizes[0]?.[0] === 'One Size';
  const effectiveSize = selectedSize || (isOneSize ? 'One Size' : null);

  const handleAdd = () => {
    if (!effectiveSize) return;

    addToCart({
      id: `${productId}-${effectiveSize}`,
      name: product.name,
      meta: `${product.material.split(',')[0]} · Size ${effectiveSize}`,
      price: product.price,
      size: effectiveSize,
    });

    setIsAdded(true);
    openCart();
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[115] bg-[var(--ink)]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Quick View Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} quick view`}
        className="fixed top-0 right-0 bottom-0 z-[125] w-full max-w-[480px] bg-[var(--paper)] text-[var(--ink)] border-l border-hairline flex flex-col shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-hairline flex items-center justify-between bg-[var(--paper)] sticky top-0 z-10">
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-[var(--indigo)] font-semibold block">
              {product.objectNumber}
            </span>
            <h3 className="font-display text-xl text-[var(--ink)]">{product.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 font-mono text-xs uppercase hover:opacity-60 transition-opacity"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Image */}
          <div className="relative aspect-[4/5] w-full border border-hairline bg-[var(--paper-2)] overflow-hidden">
            <Image
              src={`/api/images/${productId}`}
              alt={product.name}
              fill
              unoptimized
              className="object-cover object-center"
            />
          </div>

          {/* Details */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider">
                {product.origin.split('·')[0].trim()}
              </span>
              <span className="font-mono text-lg font-medium text-[var(--ink)]">
                {formatPrice(product.price)}
              </span>
            </div>
            <p className="text-xs text-[var(--ink)]/80 leading-relaxed font-sans">
              {product.story}
            </p>
          </div>

          {/* Material & Construction */}
          <div className="border-t border-hairline pt-4 space-y-2 font-mono text-xs">
            <div className="flex justify-between py-1 border-b border-hairline/60">
              <span className="text-[var(--ink-muted)]">Material</span>
              <span className="text-[var(--ink)] text-right max-w-[24ch] truncate">{product.material.split(',')[0]}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--ink-muted)]">Allocation</span>
              <span className="text-[var(--ink)]">{product.runQuantity}</span>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)] block mb-2">
              Select Allocation Size:
            </span>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map(([s, count]) => {
                const isSoldOut = count === 0;
                const isSelected = effectiveSize === s;
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={isSoldOut}
                    onClick={() => setSelectedSize(s)}
                    className={clsx(
                      'py-2 border font-mono text-xs transition-colors text-center',
                      isSelected && 'bg-[var(--indigo)] text-white border-[var(--indigo)] font-bold',
                      !isSelected && !isSoldOut && 'bg-[var(--paper)] text-[var(--ink)] border-hairline hover:border-[var(--ink)]',
                      isSoldOut && 'bg-[var(--paper-2)]/60 text-[var(--ink-muted)]/40 cursor-not-allowed border-hairline'
                    )}
                  >
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-hairline bg-[var(--paper-2)] space-y-3 sticky bottom-0">
          <button
            type="button"
            disabled={!effectiveSize}
            onClick={handleAdd}
            className="w-full py-3.5 bg-[var(--indigo)] text-white text-xs font-mono uppercase tracking-widest hover:bg-[var(--indigo-hover)] disabled:opacity-50 transition-colors shadow-sm"
          >
            {isAdded ? 'Added to Bag ✓' : effectiveSize ? `Add Size ${effectiveSize} to Archive` : 'Select Size'}
          </button>

          <Link
            href={`/product/${productId}`}
            onClick={onClose}
            className="block text-center py-2.5 border border-hairline text-xs font-mono uppercase tracking-widest text-[var(--ink)] hover:bg-[var(--paper)] transition-colors"
          >
            View Full Object Dossier →
          </Link>
        </div>
      </div>
    </>
  );
}

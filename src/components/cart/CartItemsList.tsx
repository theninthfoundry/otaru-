'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart, CartLineItem } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { useCurrency } from '@/lib/currency';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { PRODUCT_CATALOG, Product } from '@/lib/catalog';
import { PRODUCT_IMAGES } from '@/lib/images';
import { CartGarmentCareModal } from './CartGarmentCareModal';

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

interface CartItemsListProps {
  onSuggestItem?: (id: string) => void;
}

export function CartItemsList({ onSuggestItem }: CartItemsListProps) {
  const { items, updateQty, removeFromCart, addToCart } = useCart();
  const { moveCartToWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [undoItem, setUndoItem] = useState<CartLineItem | null>(null);
  const [activeCareProduct, setActiveCareProduct] = useState<Product | null>(null);

  const handleRemove = (line: CartLineItem) => {
    setUndoItem(line);
    removeFromCart(line.id);
  };

  const handleUndo = () => {
    if (undoItem) {
      addToCart({
        id: undoItem.id,
        name: undoItem.name,
        meta: undoItem.meta,
        price: undoItem.price,
        size: undoItem.size,
        qty: undoItem.qty,
      });
      setUndoItem(null);
    }
  };

  const handleSizeChange = (line: CartLineItem, newSize: string) => {
    const baseId = line.id.split('-')[0] || line.id;
    const newId = `${baseId}-${newSize}`;
    if (newId === line.id) return;

    // Remove old size and re-insert with new size preserving qty
    removeFromCart(line.id);
    addToCart({
      id: newId,
      name: line.name,
      meta: line.meta,
      price: line.price,
      size: newSize,
      qty: line.qty,
    });
  };

  const handleQuickAdd = (catalogId: string) => {
    const prod = PRODUCT_CATALOG[catalogId];
    if (!prod) return;
    addToCart({
      id: `${catalogId}-M`,
      name: prod.name,
      meta: prod.material.split(',')[0] || prod.material,
      price: prod.price,
      size: 'M',
      qty: 1,
    });
    if (onSuggestItem) onSuggestItem(catalogId);
  };

  if (items.length === 0) {
    return (
      <div className="border border-hairline bg-[var(--paper)] p-8 sm:p-14 text-center relative overflow-hidden">
        {/* Subtle Archival Seal Watermark */}
        <div className="absolute right-6 top-6 font-mono text-[9px] tracking-[0.24em] uppercase text-[var(--ink-muted)] opacity-40 select-none">
          SESSION ALLOCATION: VACANT
        </div>

        <div className="max-w-lg mx-auto">
          <span className="font-mono text-2xl text-[var(--gold)] block mb-3">⟡</span>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--ink-muted)] block mb-2">
            Archival Tray
          </span>
          <h2 className="font-display text-2xl sm:text-3xl text-[var(--ink)] mb-3 font-normal">
            Your acquisition tray is empty.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed mb-10 font-sans max-w-[42ch] mx-auto">
            No hand-loomed garments are currently reserved under your session. Explore the current batch releases below or retrieve from your saved archive.
          </p>

          <div className="text-left border-t border-hairline pt-8">
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)] font-semibold">
                Signature Batch 01 Allocations
              </span>
              <span className="font-mono text-[10px] text-[var(--gold)]">
                STRICT 44-PIECE RUNS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(['041', '042', '043'] as const).map((id) => {
                const prod = PRODUCT_CATALOG[id];
                if (!prod) return null;
                const kanji = KANJI_MAP[id] || '物';

                return (
                  <div
                    key={id}
                    className="border border-hairline bg-[var(--paper-2)]/60 p-4 flex flex-col justify-between hover:border-[var(--ink)] transition-colors group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--gold)]">
                          {prod.objectNumber}
                        </span>
                        <span className="font-serif text-xs text-[var(--ink-muted)]/70">
                          {kanji}
                        </span>
                      </div>
                      <h3 className="font-display text-base text-[var(--ink)] mb-1 leading-snug">
                        {prod.name}
                      </h3>
                      <p className="font-mono text-xs text-[var(--ink)] font-medium mb-4">
                        {formatPrice(prod.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(id)}
                      className="w-full py-2.5 bg-[var(--ink)] text-[var(--paper)] text-[10px] font-mono uppercase tracking-[0.18em] hover:bg-[var(--indigo)] transition-colors"
                    >
                      + Accession
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/archive"
                className="inline-block px-7 py-3 border border-[var(--ink)] text-[var(--ink)] font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-all"
              >
                Browse All 10 Archive Holdings →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Undo Toast */}
      {undoItem && (
        <div className="p-3 bg-[var(--ink)] text-[var(--paper)] text-xs font-mono flex items-center justify-between border border-[var(--hairline-strong)] animate-in fade-in slide-in-from-top-2 duration-200">
          <span>Relinquished {undoItem.name} ({undoItem.size || 'M'}) from allocation.</span>
          <button
            type="button"
            onClick={handleUndo}
            className="text-[var(--gold)] underline uppercase tracking-wider font-semibold hover:opacity-80"
          >
            Undo Restore
          </button>
        </div>
      )}

      {/* Tray Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-hairline">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--ink)] font-semibold">
            Allocation Holdings ({items.reduce((s, i) => s + i.qty, 0)})
          </span>
          <span className="text-[var(--hairline-strong)]">·</span>
          <span className="font-mono text-[10px] text-[var(--ink-muted)] uppercase tracking-wider">
            BATCH 01/26
          </span>
        </div>
        <span className="font-mono text-[10px] text-[var(--gold)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse" />
          SESSION ALLOCATION SECURED
        </span>
      </div>

      {/* Itemized Cards */}
      <div className="divide-y divide-hairline border border-hairline bg-[var(--paper)]">
        {items.map((line: CartLineItem) => {
          const baseId = line.id.split('-')[0] || line.id;
          const catalogItem = PRODUCT_CATALOG[baseId];
          const kanji = KANJI_MAP[baseId] || '物';
          const primaryImg = PRODUCT_IMAGES[baseId]?.primary;

          const currentSize = line.size || 'M';
          const availableSizes = catalogItem?.sizes || [['S', 4], ['M', 12], ['L', 8], ['XL', 2]];
          const selectedSizeStock = availableSizes.find(([s]) => s === currentSize)?.[1] ?? 8;
          const isScarcity = selectedSizeStock <= 4;

          return (
            <article
              key={line.id}
              className="p-4 sm:p-7 flex gap-3.5 sm:gap-7 hover:bg-[var(--paper-2)]/30 transition-colors relative"
            >
              {/* Garment Mount Thumbnail */}
              <div className="w-20 h-28 sm:w-28 sm:h-36 flex-shrink-0 bg-[var(--paper-2)] border border-hairline overflow-hidden relative group">
                <ImagePlaceholder
                  label={`Artifact ${baseId} — ${line.name}`}
                  src={primaryImg}
                  ratio="portrait"
                  alt={`${line.name} — Hand-loomed Archival Textile`}
                />
                {/* Kanji Seal Badge */}
                <span className="absolute top-1 left-1 font-serif text-[10px] sm:text-[11px] bg-[var(--ink)]/85 text-[var(--paper)] w-4.5 h-4.5 sm:w-5 sm:h-5 flex items-center justify-center select-none shadow-sm">
                  {kanji}
                </span>
                <span className="absolute bottom-1 right-1 font-mono text-[7px] sm:text-[8px] bg-[var(--paper)] text-[var(--ink)] px-1 py-0.5 tracking-wider uppercase border border-hairline">
                  {baseId}
                </span>
              </div>

              {/* Garment Information & Steppers */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] font-medium">
                          {catalogItem?.objectNumber || `OBJECT ${baseId}`}
                        </span>
                        <span className="text-[var(--hairline-strong)]">·</span>
                        <span className="font-mono text-[10px] text-[var(--ink-muted)] uppercase tracking-wider">
                          {catalogItem?.specs?.find(([k]) => k.toLowerCase().includes('object id'))?.[1] || `ARC-${baseId}-STD`}
                        </span>
                      </div>
                      <h3 className="font-display text-lg sm:text-xl text-[var(--ink)] leading-snug">
                        {line.name}
                      </h3>
                    </div>

                    {/* Price Calculation (Unit vs Line Total) */}
                    <div className="text-left sm:text-right">
                      <div className="font-display text-lg sm:text-xl text-[var(--ink)] font-normal">
                        {formatPrice(line.price * line.qty)}
                      </div>
                      {line.qty > 1 && (
                        <div className="font-mono text-[11px] text-[var(--ink-muted)] mt-0.5">
                          {formatPrice(line.price)} × {line.qty}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Material / Provenance Narrative */}
                  <p className="text-xs text-[var(--ink-muted)] line-clamp-2 mb-3 font-sans leading-relaxed">
                    {line.meta || catalogItem?.material || 'Hand-loomed archival textile'}
                  </p>

                  {/* Archival Specification Badges & Live Size Selector */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {/* Live Size Switcher */}
                    <div className="flex items-center gap-1.5 border border-hairline bg-[var(--paper-2)] px-2 py-1 font-mono text-[10px]">
                      <span className="text-[var(--ink-muted)] uppercase">Size:</span>
                      <select
                        value={currentSize}
                        onChange={(e) => handleSizeChange(line, e.target.value)}
                        className="bg-transparent font-mono text-[10px] font-semibold text-[var(--ink)] uppercase focus:outline-none cursor-pointer"
                        aria-label={`Select size for ${line.name}`}
                      >
                        {availableSizes.map(([sizeKey, stockCount]) => (
                          <option key={sizeKey} value={sizeKey} className="bg-[var(--paper)] text-[var(--ink)]">
                            {sizeKey} ({stockCount} in batch)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Loom Specification */}
                    <span className="inline-flex items-center px-2 py-1 border border-hairline bg-[var(--paper-2)] font-mono text-[10px] text-[var(--ink-muted)]">
                      Loom: {catalogItem?.specs?.find(([k]) => k.toLowerCase().includes('loom'))?.[1] || 'Toyoda G3 Vintage'}
                    </span>

                    {/* Scarcity Notice */}
                    {isScarcity ? (
                      <span className="inline-flex items-center px-2 py-1 border border-[var(--otaru-torii)]/30 bg-[var(--otaru-torii)]/10 font-mono text-[10px] text-[var(--otaru-torii)]">
                        ⚠ Low Cut: Only {selectedSizeStock} left in {currentSize}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 border border-emerald-900/20 bg-emerald-500/5 font-mono text-[10px] text-emerald-800">
                        ✓ Reserved from 44-piece run
                      </span>
                    )}

                    {/* Care Protocol Trigger */}
                    {catalogItem && (
                      <button
                        type="button"
                        onClick={() => setActiveCareProduct(catalogItem)}
                        className="inline-flex items-center gap-1 px-2 py-1 border border-hairline font-mono text-[10px] text-[var(--indigo)] hover:bg-[var(--paper-2)] transition-colors underline"
                      >
                        Care &amp; Wash Dossier
                      </button>
                    )}
                  </div>
                </div>

                {/* Stepper & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-hairline">
                  {/* Quantity Stepper */}
                  <div
                    className="flex items-center border border-[var(--ink)] bg-[var(--paper)]"
                    role="group"
                    aria-label={`Adjust quantity for ${line.name}`}
                  >
                    <button
                      type="button"
                      onClick={() => updateQty(line.id, -1)}
                      aria-label="Decrease quantity"
                      className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center font-mono text-sm text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] active:scale-90 transition-all select-none"
                    >
                      −
                    </button>
                    <span className="w-9 sm:w-10 text-center font-mono text-xs font-semibold text-[var(--ink)] select-none">
                      {line.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(line.id, 1)}
                      aria-label="Increase quantity"
                      className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center font-mono text-sm text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)] active:scale-90 transition-all select-none"
                    >
                      +
                    </button>
                  </div>

                  {/* Actions: Save to Wishlist & Remove */}
                  <div className="flex items-center gap-3 sm:gap-4 py-1">
                    <button
                      type="button"
                      onClick={() => moveCartToWishlist(line)}
                      className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[var(--ink-muted)] hover:text-[var(--indigo)] hover:underline active:opacity-75 transition-colors flex items-center gap-1.5 py-1"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Move to Saved
                    </button>
                    <span className="text-[var(--hairline-strong)]">|</span>
                    <button
                      type="button"
                      onClick={() => handleRemove(line)}
                      className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[var(--ink-muted)] hover:text-red-700 active:opacity-75 transition-colors py-1"
                    >
                      Relinquish
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Garment Care Modal Dialog */}
      {activeCareProduct && (
        <CartGarmentCareModal
          product={activeCareProduct}
          isOpen={Boolean(activeCareProduct)}
          onClose={() => setActiveCareProduct(null)}
        />
      )}
    </div>
  );
}

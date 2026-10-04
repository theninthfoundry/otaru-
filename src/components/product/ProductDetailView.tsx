'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { useCurrency } from '@/lib/currency';
import { useCart } from '@/lib/cart';
import { useSizeGuide } from '@/lib/size-guide';
import { PRODUCT_CATALOG, CARE_SETS, Product } from '@/lib/catalog';
import clsx from 'clsx';

interface ProductDetailViewProps {
  productId: string;
}

export function ProductDetailView({ productId }: ProductDetailViewProps) {
  const product: Product | undefined = PRODUCT_CATALOG[productId];
  const { formatPrice } = useCurrency();
  const { addToCart, openCart } = useCart();
  const { openSizeGuide } = useSizeGuide();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [isKept, setIsKept] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>('materials');
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  const isOneSize = Boolean(product && product.sizes.length === 1 && product.sizes[0]?.[0] === 'One Size');

  useEffect(() => {
    if (!product) return;
    if (isOneSize) setSelectedSize('One Size');
    else setSelectedSize(null);
    setSizeError(false);

    // Track recently viewed in localStorage
    try {
      const stored = localStorage.getItem('otaru_recently_viewed');
      const list: string[] = stored ? JSON.parse(stored) : [];
      const updated = [productId, ...list.filter((id) => id !== productId)].slice(0, 6);
      localStorage.setItem('otaru_recently_viewed', JSON.stringify(updated));
      setRecentlyViewed(updated.filter((id) => id !== productId).slice(0, 3));
    } catch {
      // Ignore storage errors
    }
  }, [productId, product, isOneSize]);

  if (!product) {
    return (
      <div className="wrap py-32 text-center">
        <h1 className="display-l text-[var(--ink)] mb-4">Object Not Found</h1>
        <p className="text-sm text-[var(--ink-muted)] mb-8">
          This object has concluded its archival run or does not exist in the active catalogue.
        </p>
        <Link href="/archive" className="btn-primary">
          Return to Archive
        </Link>
      </div>
    );
  }

  // Calculate live inventory numbers
  const totalRun = product.runQuantity ? parseInt(product.runQuantity.split(' ')[0], 10) || 44 : 44;
  const remainingStock = product.sizes.reduce((acc, curr) => acc + curr[1], 0);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    addToCart({
      id: `${productId}-${selectedSize}`,
      name: product.name,
      meta: `${product.material.split(',')[0]} · Size ${selectedSize}`,
      price: product.price,
      size: selectedSize,
    });

    setIsAdded(true);
    openCart();
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length >= 5) {
      // Calculate realistic delivery date (4-6 days from today)
      const d = new Date();
      d.setDate(d.getDate() + 5);
      setDeliveryDate(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }));
    }
  };

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  // Complementary "Worn with" objects
  const wornWithIds = Object.keys(PRODUCT_CATALOG)
    .filter((id) => id !== productId)
    .slice(0, 2);

  return (
    <div className="bg-[var(--paper)] text-[var(--ink)] pt-24 pb-20">
      <div className="wrap">
        
        {/* Breadcrumb row */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--ink-muted)] mb-8 uppercase tracking-widest">
          <Link href="/archive" className="hover:text-[var(--ink)] transition-colors">Archive</Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-[var(--ink)]">No. {productId}</span>
        </div>

        {/* 12-Column Layout: Left 7 Cols Gallery, Right 5 Cols Sticky Purchase Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* =========================================================================
              LEFT (7 Cols): Scrolling Gallery (Full-bleed, detail crops, macro weave)
              ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 1. Main Full-Bleed Portrait */}
            <div className="border border-hairline overflow-hidden bg-[var(--paper-2)]">
              <ImagePlaceholder ratio="tall" label={`Artifact ${productId} — Primary Portrait`} />
            </div>

            {/* 2. Detail Seam & Hardware Crop */}
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-hairline overflow-hidden bg-[var(--paper-2)]">
                <ImagePlaceholder ratio="square" label={`Artifact ${productId} — Seam Detail`} />
              </div>
              <div className="border border-hairline overflow-hidden bg-[var(--paper-2)]">
                <ImagePlaceholder ratio="square" label={`Artifact ${productId} — Macro Weave`} />
              </div>
            </div>

            {/* 3. On-Body Styling Silhouette */}
            <div className="border border-hairline overflow-hidden bg-[var(--paper-2)]">
              <ImagePlaceholder ratio="wide" label={`Artifact ${productId} — On-Body Atelier Study`} />
            </div>

          </div>

          {/* =========================================================================
              RIGHT (5 Cols): Sticky Purchase Panel (Psychology-Driven Order)
              ========================================================================= */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
            
            {/* 1. Header: Name, Price, One-line material */}
            <div className="border-b border-hairline pb-6">
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                  {product.objectNumber || `OBJECT ${productId}`}
                </span>
                <span className="font-display text-2xl text-[var(--ink)] font-normal">
                  {formatPrice(product.price)}
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl text-[var(--ink)] tracking-tight mb-2">
                {product.name}
              </h1>

              <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                {product.material}
              </p>
            </div>

            {/* 2. Honest Scarcity: "X of Y remain" (Live count) + Batch Number */}
            <div className="p-3.5 bg-[var(--paper-2)] border border-hairline flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--indigo)] animate-pulse" />
                <span className="text-[var(--ink)] font-medium">
                  {remainingStock} of {totalRun} pieces remain
                </span>
              </div>
              <span className="text-[var(--ink-muted)] uppercase tracking-wider">
                Batch 01 · First Release
              </span>
            </div>

            {/* 3. Size Selector with large tap targets (48px) + Size Guide Drawer trigger */}
            <div className="border-b border-hairline pb-6">
              <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase tracking-wider">
                <span className="text-[var(--ink-muted)]">Select Size</span>
                {!isOneSize && (
                  <button
                    type="button"
                    onClick={() => openSizeGuide(productId)}
                    className="text-[var(--indigo)] hover:underline flex items-center gap-1"
                  >
                    Size Guide & Fit Notes ↗
                  </button>
                )}
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map(([sizeName, count]) => {
                  const isSoldOut = count === 0;
                  const isSelected = selectedSize === sizeName;

                  return (
                    <button
                      key={sizeName}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => {
                        setSelectedSize(sizeName);
                        setSizeError(false);
                      }}
                      className={clsx(
                        'h-12 flex flex-col items-center justify-center border font-mono text-xs transition-colors relative',
                        isSelected && 'border-[var(--indigo)] bg-[var(--indigo)] text-white font-medium',
                        !isSelected && !isSoldOut && 'border-hairline bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--ink)]',
                        isSoldOut && 'border-hairline bg-[var(--paper-2)]/60 text-[var(--ink-muted)]/40 cursor-not-allowed'
                      )}
                    >
                      <span>{sizeName}</span>
                      {isSoldOut ? (
                        <span className="text-[9px] uppercase tracking-tighter line-through opacity-70">Sold</span>
                      ) : (
                        <span className="text-[9px] opacity-60">{count} left</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {sizeError && (
                <p className="mt-2 text-xs font-mono text-[var(--indigo)]">
                  Please select a size to allocate this garment.
                </p>
              )}
            </div>

            {/* 4. Primary CTA: "Add to archive" (Indigo) + "Keep" Wishlist */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-[var(--indigo)] text-white text-xs font-mono uppercase tracking-widest hover:bg-[var(--indigo-hover)] transition-colors flex items-center justify-center gap-2"
              >
                <span>{isAdded ? 'Added to Bag ✓' : 'Add to Archive'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsKept(!isKept)}
                aria-label="Keep in personal wishlist"
                className={clsx(
                  'px-5 py-4 border border-hairline font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-2',
                  isKept ? 'bg-[var(--paper-2)] text-[var(--indigo)] border-[var(--indigo)]' : 'bg-[var(--paper)] text-[var(--ink)] hover:border-[var(--ink)]'
                )}
              >
                <span>{isKept ? 'Kept ♥' : 'Keep'}</span>
              </button>
            </div>

            {/* 5. Trust Row: Lifetime repair, dispatch from Hokkaido, delivery pincode */}
            <div className="border border-hairline p-4 bg-[var(--paper-2)] space-y-3 text-xs">
              <div className="flex items-center gap-2 text-[var(--ink)]">
                <span className="font-mono text-sm">✦</span>
                <span><strong>Lifetime Atelier Repair:</strong> Registered under studio repair ledger.</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--ink)]">
                <span className="font-mono text-sm">⟳</span>
                <span><strong>Complimentary Dispatch:</strong> Direct from Hokkaido canal workshop.</span>
              </div>

              {/* Delivery Date Estimator */}
              <form onSubmit={handlePincodeCheck} className="pt-2 border-t border-hairline flex items-center gap-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter postal pincode"
                  className="bg-[var(--paper)] border border-hairline px-3 py-1.5 text-xs font-mono text-[var(--ink)] flex-1 focus:outline-none focus:border-[var(--indigo)]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-[var(--paper)] border border-hairline font-mono text-[11px] uppercase hover:bg-[var(--paper-subtle)]"
                >
                  Estimate
                </button>
              </form>
              {deliveryDate && (
                <p className="text-[11px] font-mono text-[var(--indigo)]">
                  ✓ Estimated dispatch arrival: <strong>{deliveryDate}</strong>
                </p>
              )}
            </div>

            {/* 6. Accordions: Materials & weave, Care, Provenance, Shipping & returns */}
            <div className="border-t border-hairline divide-y divide-hairline text-sm">
              
              {/* Accordion 1: Materials & Weave */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('materials')}
                  className="w-full py-4 flex items-center justify-between font-display text-base text-left hover:text-[var(--indigo)] transition-colors"
                >
                  <span>Materials & Weave</span>
                  <span className="font-mono text-xs">{openAccordion === 'materials' ? '−' : '+'}</span>
                </button>
                {openAccordion === 'materials' && (
                  <div className="pb-4 text-xs font-mono space-y-2 text-[var(--ink-muted)]">
                    {product.specs?.map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1 border-b border-hairline/40">
                        <span>{k}</span>
                        <span className="text-[var(--ink)]">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 2: Care Rituals */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-4 flex items-center justify-between font-display text-base text-left hover:text-[var(--indigo)] transition-colors"
                >
                  <span>Care & Longevity</span>
                  <span className="font-mono text-xs">{openAccordion === 'care' ? '−' : '+'}</span>
                </button>
                {openAccordion === 'care' && (
                  <div className="pb-4 text-xs text-[var(--ink-muted)] space-y-2 leading-relaxed">
                    <p>{product.longevityStory || 'Every piece is crafted to soften and crease gracefully.'}</p>
                    <ul className="list-disc list-inside space-y-1 pt-1 font-mono text-[11px]">
                      {CARE_SETS[product.care]?.map((instruction, idx) => (
                        <li key={idx}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3: Provenance */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('provenance')}
                  className="w-full py-4 flex items-center justify-between font-display text-base text-left hover:text-[var(--indigo)] transition-colors"
                >
                  <span>Provenance & Origin</span>
                  <span className="font-mono text-xs">{openAccordion === 'provenance' ? '−' : '+'}</span>
                </button>
                {openAccordion === 'provenance' && (
                  <div className="pb-4 text-xs text-[var(--ink-muted)] leading-relaxed space-y-2">
                    <p><strong>Origin Mill:</strong> {product.origin}</p>
                    <p><strong>First Release:</strong> {product.firstRelease}</p>
                    <p><strong>Construction:</strong> {product.construction}</p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Shipping & Returns */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-4 flex items-center justify-between font-display text-base text-left hover:text-[var(--indigo)] transition-colors"
                >
                  <span>Shipping & Returns</span>
                  <span className="font-mono text-xs">{openAccordion === 'shipping' ? '−' : '+'}</span>
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pb-4 text-xs text-[var(--ink-muted)] leading-relaxed space-y-2">
                    <p>Direct courier dispatch from Otaru canal studio. 14-day archival return window in original unworn condition with hand-pressed seal intact.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* =========================================================================
            BELOW: "Worn with" (2 items) & Recently Viewed
            ========================================================================= */}
        <div className="mt-28 pt-12 border-t border-hairline">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--ink-muted)] block mb-6">
            Recommended Pairing
          </span>
          <h2 className="display-l text-[var(--ink)] mb-8">
            Worn with.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl">
            {wornWithIds.map((id) => {
              const item = PRODUCT_CATALOG[id];
              if (!item) return null;
              return (
                <Link key={id} href={`/product/${id}`} className="group border border-hairline bg-[var(--paper-2)] p-4 flex flex-col justify-between">
                  <div className="border border-hairline overflow-hidden mb-4">
                    <ImagePlaceholder ratio="portrait" label={`No. ${id} — ${item.name}`} />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-[var(--ink-muted)]">No. {id}</span>
                    <h3 className="font-display text-lg text-[var(--ink)] group-hover:text-[var(--indigo)] transition-colors">{item.name}</h3>
                    <span className="font-mono text-xs text-[var(--ink-muted)]">{formatPrice(item.price)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--paper)]/95 backdrop-blur-md border-t border-hairline p-3 flex items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase text-[var(--ink-muted)] block">Total</span>
          <span className="font-display text-lg text-[var(--ink)]">{formatPrice(product.price)}</span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 bg-[var(--indigo)] text-white text-xs font-mono uppercase tracking-wider hover:bg-[var(--indigo-hover)]"
        >
          {isAdded ? 'Added ✓' : selectedSize ? `Add Size ${selectedSize}` : 'Select Size to Add'}
        </button>
      </div>

    </div>
  );
}

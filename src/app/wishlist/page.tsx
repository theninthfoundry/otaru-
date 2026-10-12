'use client';

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/lib/wishlist';
import { useCurrency } from '@/lib/currency';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import { ArchiveTextureOverlay } from '@/components/ui/ArchiveTextureOverlay';

export default function WishlistPage() {
  const { wishlist, moveToCart, removeFromWishlist, itemCount } = useWishlist();
  const { formatPrice } = useCurrency();

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pt-28 pb-20 relative selection:bg-[var(--ink)] selection:text-[var(--paper)]">
      <ArchiveTextureOverlay />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--ink-muted)]">
            <li>
              <Link href="/" className="hover:text-[var(--ink)] transition-colors">
                Maison
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/archive" className="hover:text-[var(--ink)] transition-colors">
                Archive
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--ink)] font-semibold" aria-current="page">
              Saved Artifacts
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="pb-6 mb-8 border-b border-hairline flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--gold)] block mb-1">
              COLLECTOR SANCTUARY
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-[var(--ink)]">
              Saved Archival Artifacts
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[var(--ink-muted)] mt-1.5">
              Pieces held under personal study. Move directly to your acquisition tray when ready for loom allocation.
            </p>
          </div>

          <Link
            href="/cart"
            className="inline-flex items-center px-4 py-2 bg-[var(--ink)] text-[var(--paper)] font-mono text-xs uppercase tracking-wider hover:bg-[var(--indigo)] transition-colors"
          >
            View Acquisition Tray →
          </Link>
        </div>

        {/* Wishlist Items List */}
        {wishlist.length === 0 ? (
          <div className="border border-hairline bg-[var(--paper-2)]/60 p-12 text-center">
            <span className="font-mono text-3xl text-[var(--ink-muted)] block mb-3">◇</span>
            <h2 className="font-display text-2xl text-[var(--ink)] mb-2">
              Your wishlist is tranquil
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-muted)] max-w-md mx-auto mb-6 leading-relaxed">
              You haven&apos;t saved any archival pieces yet. You can save garments from the archive catalog or from your cart tray.
            </p>
            <Link
              href="/archive"
              className="inline-block px-6 py-3 border border-[var(--ink)] text-[var(--ink)] font-mono text-xs uppercase tracking-widest hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-all"
            >
              Explore the Archive →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlist.map((item) => {
              const prod = PRODUCT_CATALOG[item.productId || item.id];

              return (
                <div
                  key={item.id}
                  className="border border-hairline bg-[var(--paper)] p-4 flex gap-4 hover:border-[var(--ink-muted)] transition-colors relative"
                >
                  <div className="w-20 h-28 flex-shrink-0 bg-[var(--paper-2)] border border-hairline overflow-hidden relative">
                    <ImagePlaceholder label={item.name} ratio="portrait" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--gold)] block">
                            {prod?.objectNumber || `OBJECT ${item.id}`}
                          </span>
                          <h3 className="font-display text-base text-[var(--ink)] leading-snug">
                            {item.name}
                          </h3>
                        </div>
                        <span className="font-display text-base text-[var(--ink)] font-medium">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="font-mono text-[10px] text-[var(--ink-muted)] mt-1 line-clamp-1">
                        {item.meta || prod?.material}
                      </p>
                      {item.size && (
                        <span className="inline-block mt-1 font-mono text-[9px] text-[var(--ink)] uppercase">
                          Size: {item.size}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-hairline mt-3">
                      <button
                        type="button"
                        onClick={() => moveToCart(item.id)}
                        className="px-3.5 py-1.5 bg-[var(--ink)] text-[var(--paper)] font-mono text-[10px] uppercase tracking-wider hover:bg-[var(--indigo)] transition-colors"
                      >
                        + Move to Tray
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(item.id)}
                        className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

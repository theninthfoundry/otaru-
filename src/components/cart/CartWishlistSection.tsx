'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/lib/wishlist';
import { useCurrency } from '@/lib/currency';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import { PRODUCT_IMAGES } from '@/lib/images';

const KANJI_MAP: Record<string, string> = {
  '041': '山',
  '042': '織',
  '043': '風',
  '044': '舟',
  '038': '港',
  '037': '川',
  '036': '雪',
  '035': '野',
  '034': '雨',
  '033': '霜',
};

export function CartWishlistSection() {
  const { wishlist, moveToCart, removeFromWishlist, addToWishlist, itemCount } = useWishlist();
  const { formatPrice } = useCurrency();
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [notifiedArchiveId, setNotifiedArchiveId] = useState<string | null>(null);

  const curatedArchive = [
    { id: '041', name: 'Yama Field Jacket', price: 480, material: '14.5oz raw indigo cotton canvas' },
    { id: '042', name: 'Kiryū Wrap Trouser', price: 340, material: 'High-density Deccan limestone twill' },
    { id: '043', name: 'Biratori Overshirt', price: 290, material: 'Hand-spun river-washed cotton' },
    { id: '044', name: 'Ōmi Hemp Tote', price: 180, material: 'Raw heavy-gauge Ōmi bast fiber' },
  ];

  const handleShareWishlist = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/wishlist`;
      navigator.clipboard?.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleMoveAll = () => {
    wishlist.forEach((item) => moveToCart(item.id));
  };

  const handleNotifyMe = (id: string) => {
    setNotifiedArchiveId(id);
    setTimeout(() => setNotifiedArchiveId(null), 3000);
  };

  return (
    <section className="border border-hairline bg-[var(--paper)] mt-10" aria-label="Collector Saved Pieces">
      {/* Header bar with toggle */}
      <div
        className="p-4 sm:p-5 border-b border-hairline bg-[var(--paper-2)]/60 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <div className="flex items-center gap-3">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[var(--gold)]">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <div>
            <h3 className="font-display text-base sm:text-lg text-[var(--ink)]">
              Collector Wishlist &amp; Saved Artifacts
            </h3>
            <span className="font-mono text-[10px] text-[var(--ink-muted)] block uppercase tracking-[0.16em]">
              {itemCount} {itemCount === 1 ? 'holding' : 'holdings'} saved for study
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {wishlist.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleShareWishlist();
              }}
              className="font-mono text-[10px] uppercase tracking-wider text-[var(--indigo)] hover:underline hidden sm:inline-block"
            >
              {copiedLink ? '✓ Link Copied' : 'Share Curation'}
            </button>
          )}

          <button
            type="button"
            className="p-1 font-mono text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
            aria-label={isExpanded ? 'Collapse saved items tray' : 'Expand saved items tray'}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 sm:p-7">
          {wishlist.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-xs sm:text-sm text-[var(--ink-muted)] max-w-md mx-auto mb-6 leading-relaxed font-sans">
                Your saved ledger is tranquil. Reserve pieces here to preserve size preferences and follow weave schedules without active allocation lock.
              </p>

              <div className="text-left border-t border-hairline pt-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink-muted)] block mb-4">
                  Quick Save from Archival Holding
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {curatedArchive.map((item) => {
                    const kanji = KANJI_MAP[item.id] || '物';
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 border border-hairline bg-[var(--paper-2)]/40 flex items-center justify-between gap-3 hover:border-[var(--ink)]/40 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--gold)]">
                              OBJECT {item.id}
                            </span>
                            <span className="font-serif text-[10px] text-[var(--ink-muted)]">
                              · {kanji}
                            </span>
                          </div>
                          <h4 className="font-display text-sm text-[var(--ink)] leading-snug">
                            {item.name}
                          </h4>
                          <span className="font-mono text-[11px] text-[var(--ink-muted)]">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            addToWishlist({
                              id: item.id,
                              productId: item.id,
                              name: item.name,
                              meta: item.material,
                              price: item.price,
                              size: 'M',
                            })
                          }
                          className="px-3 py-1.5 border border-hairline bg-[var(--paper)] text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--ink)] hover:border-[var(--ink)] transition-colors flex items-center gap-1"
                        >
                          + Save
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Batch Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-hairline text-xs font-mono">
                <span className="text-[var(--ink-muted)]">
                  {itemCount} {itemCount === 1 ? 'piece' : 'pieces'} preserved in personal study
                </span>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={handleMoveAll}
                    className="text-[var(--indigo)] uppercase tracking-wider font-semibold hover:underline"
                  >
                    + Accession All to Tray
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={handleShareWishlist}
                    className="text-[var(--ink-muted)] uppercase tracking-wider hover:text-[var(--ink)]"
                  >
                    {copiedLink ? '✓ Link Copied' : 'Copy Private Curation URL'}
                  </button>
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishlist.map((item) => {
                  const prod = PRODUCT_CATALOG[item.productId || item.id];
                  const kanji = KANJI_MAP[item.productId || item.id] || '物';
                  const primaryImg = PRODUCT_IMAGES[item.productId || item.id]?.primary;
                  const isNotified = notifiedArchiveId === item.id;

                  return (
                    <article
                      key={item.id}
                      className="border border-hairline bg-[var(--paper-2)]/30 p-4 flex gap-4 hover:border-[var(--ink-muted)] transition-colors relative"
                    >
                      <div className="w-18 h-24 sm:w-20 sm:h-26 flex-shrink-0 bg-[var(--paper-2)] border border-hairline overflow-hidden relative">
                        <ImagePlaceholder
                          label={`Artifact ${item.productId || item.id} — ${item.name}`}
                          src={primaryImg}
                          ratio="portrait"
                          alt={item.name}
                        />
                        <span className="absolute top-1 left-1 font-serif text-[10px] bg-[var(--ink)]/85 text-[var(--paper)] w-4 h-4 flex items-center justify-center select-none">
                          {kanji}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--gold)] block">
                                {prod?.objectNumber || `OBJECT ${item.id}`}
                              </span>
                              <h4 className="font-display text-sm sm:text-base text-[var(--ink)] leading-snug">
                                {item.name}
                              </h4>
                            </div>
                            <span className="font-display text-sm text-[var(--ink)] font-normal">
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

                        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-3 border-t border-hairline mt-3">
                          <button
                            type="button"
                            onClick={() => moveToCart(item.id)}
                            className="px-3 py-1.5 bg-[var(--ink)] text-[var(--paper)] font-mono text-[10px] uppercase tracking-[0.16em] hover:bg-[var(--indigo)] active:scale-95 transition-all"
                          >
                            + Accession to Tray
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNotifyMe(item.id)}
                            className="font-mono text-[10px] uppercase tracking-wider text-[var(--gold)] hover:underline active:opacity-75"
                          >
                            {isNotified ? '✓ Alert Set' : 'Loom Alert'}
                          </button>
                          <span className="text-[var(--hairline-strong)]">|</span>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(item.id)}
                            className="font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)] hover:text-red-700 active:opacity-75 transition-colors"
                          >
                            Relinquish
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[var(--ink-muted)]">
            <span>Holdings preserved in wishlist do not decrement numbered batch allotments.</span>
            <Link href="/archive" className="underline hover:text-[var(--ink)]">
              All 10 Archival Volumes →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

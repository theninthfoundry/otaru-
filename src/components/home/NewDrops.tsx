'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ScrollZoomImage } from '@/components/ui/ScrollZoomImage';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';
import { useCurrency } from '@/lib/currency';
import { useCart } from '@/lib/cart';
import { PRODUCT_CATALOG } from '@/lib/catalog';

const DROP_IDS = ['041', '042', '043', '044'];

export function NewDrops() {
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
      size: item.sizes[0] ? item.sizes[0][0] : 'M',
    });

    setAddedId(id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section className="block on-ink" id="new-drops" aria-labelledby="new-drops-heading" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Japanese Great Wave Art Plate */}
      <ArtBackgroundPlate artName="great-wave" position="top-left" opacity={0.18} maxWidth="780px" maxHeight="560px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.035} />

      {/* Vertical Japanese Calligraphy Watermarks */}
      <VerticalKanjiStamp text="初出織物" subtext="BATCH LIVE RECORD MMXXVI" top="8%" right="2.5%" opacity={0.045} />
      <VerticalKanjiStamp text="限定四十" subtext="44 PIECES WORLDWIDE" top="55%" left="2%" opacity={0.04} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <RevealOnScroll>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <span className="eyebrow">Archive Ledger · Live Run</span>
              <h2 className="section-title" id="new-drops-heading">What arrived this week.</h2>
            </div>
            <p className="section-lede">
              Four objects, cut and botanical-dyed between the last full moon and this one. Once the run is exhausted, it does not return.
            </p>
          </div>
        </RevealOnScroll>

        <div
          className="reveal-stagger"
          style={{
            marginTop: '3.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '2.4rem 1.8rem',
          }}
        >
          {DROP_IDS.map((id, i) => {
            const item = PRODUCT_CATALOG[id];
            if (!item) return null;
            const isJustAdded = addedId === id;

            return (
              <RevealOnScroll key={id} staggerIndex={i}>
                <div
                  className="artifact-card group object-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <Link href={`/product/${id}`} className="block" style={{ textDecoration: 'none' }}>
                    <div className="ph-frame" style={{ position: 'relative' }}>
                      <ScrollZoomImage intensity="subtle" direction="out-to-in">
                        <ImagePlaceholder ratio="portrait" label={`${item.objectNumber} — ${item.name}`} />
                      </ScrollZoomImage>

                      {/* Quick Add Button */}
                      <button
                        type="button"
                        className="quick-add"
                        onClick={(e) => handleQuickAdd(e, id)}
                        aria-label={`Add ${item.name} to archive`}
                        title="Add to Your Archive"
                      >
                        {isJustAdded ? '✓' : '+'}
                      </button>

                      {/* Micro Provenance Tag */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '0.8rem',
                          left: '0.8rem',
                          fontSize: '0.58rem',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: 'var(--otaru-parchment)',
                          backgroundColor: 'rgba(11,20,32,0.7)',
                          backdropFilter: 'blur(4px)',
                          padding: '0.2rem 0.5rem',
                          border: '1px solid rgba(244,239,226,0.15)',
                          zIndex: 3,
                        }}
                      >
                        {item.runQuantity.split(' ')[0]} {item.runQuantity.split(' ')[1]}
                      </div>
                    </div>

                    {/* Metadata Layer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.9rem' }}>
                      <span style={{ fontSize: '0.64rem', letterSpacing: '0.14em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                        {item.objectNumber}
                      </span>
                      <span style={{ fontSize: '0.62rem', letterSpacing: '0.1em', color: 'var(--otaru-parchment-dim)', textTransform: 'uppercase' }}>
                        {item.origin.split('·')[0]}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', marginTop: '0.3rem', color: 'var(--otaru-parchment)', lineHeight: 1.2 }}>
                      {item.name}
                    </h3>

                    <div style={{ fontSize: '0.82rem', color: 'var(--otaru-parchment-dim)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '0.4rem', borderTop: '1px solid var(--otaru-line)', paddingTop: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', maxWidth: '18ch', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.material.split(',')[0]}
                      </span>
                      <span style={{ color: 'var(--otaru-parchment)', fontWeight: 500 }}>
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </Link>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll className="text-center" style={{ marginTop: '3.8rem', textAlign: 'center' }}>
          <Link
            href="/archive"
            className="cta-link"
          >
            Enter the Complete Archive <span aria-hidden="true">→</span>
          </Link>
        </RevealOnScroll>
      </div>

      <style jsx>{`
        .quick-add {
          position: absolute;
          right: 0.8rem;
          bottom: 0.8rem;
          z-index: 2;
          width: 2.3rem;
          height: 2.3rem;
          border-radius: 50%;
          background: var(--otaru-parchment);
          color: var(--otaru-ink);
          font-size: 1.15rem;
          font-weight: 500;
          display: grid;
          place-items: center;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity var(--duration-fast) var(--ease-otaru),
                      transform var(--duration-fast) var(--ease-otaru),
                      background var(--duration-fast);
          border: none;
          cursor: pointer;
        }
        .artifact-card:hover .quick-add,
        .quick-add:focus-visible {
          opacity: 1;
          transform: none;
        }
        .quick-add:hover {
          background: var(--otaru-gold);
        }
      `}</style>
    </section>
  );
}

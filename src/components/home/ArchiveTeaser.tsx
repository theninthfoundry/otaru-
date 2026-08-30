'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ScrollZoomImage } from '@/components/ui/ScrollZoomImage';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import { useCurrency } from '@/lib/currency';
import clsx from 'clsx';

const CATEGORIES = ['All', 'Outerwear', 'Tops', 'Trousers', 'Accessories'];
const ARTIFACT_IDS = ['038', '037', '036', '035', '034', '033'];

export function ArchiveTeaser() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { formatPrice } = useCurrency();

  const filteredIds = ARTIFACT_IDS.filter((id) => {
    if (activeCategory === 'All') return true;
    const item = PRODUCT_CATALOG[id];
    return item?.category === activeCategory;
  });

  return (
    <section className="block on-dusk" id="archive" aria-labelledby="archive-heading" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Japanese Cherry Blossom Art Plate */}
      <ArtBackgroundPlate artName="cherry-blossom" position="top-right" opacity={0.12} maxWidth="500px" maxHeight="500px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.03} />

      {/* Vertical Japanese Watermark */}
      <VerticalKanjiStamp text="永久目録" subtext="PERMANENT RECORD INDEX" top="10%" left="2%" opacity={0.04} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <RevealOnScroll>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="eyebrow">The Permanent Archive</span>
              <h2 className="section-title" id="archive-heading">412 objects. Nothing reprinted.</h2>
            </div>
            <p className="section-lede" style={{ margin: 0 }}>
              Every piece we have ever cut, cataloged as a permanent record of Hokkaido material exploration.
            </p>
          </div>
        </RevealOnScroll>

        <div
          className="reveal"
          role="group"
          aria-label="Filter the archive"
          style={{ display: 'flex', gap: '0.65rem', marginTop: '2.5rem', flexWrap: 'wrap' }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={clsx('filter-chip', activeCategory === cat && 'is-active')}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div
          className="reveal-stagger"
          style={{
            marginTop: '2.8rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.2rem 1.6rem',
          }}
        >
          {filteredIds.map((id, i) => {
            const item = PRODUCT_CATALOG[id];
            if (!item) return null;

            return (
              <RevealOnScroll key={id} staggerIndex={i}>
                <Link
                  href={`/product/${id}`}
                  className="block group artifact-card object-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="ph-frame" style={{ position: 'relative', overflow: 'hidden', borderRadius: '2px' }}>
                    <ScrollZoomImage intensity="subtle" direction="out-to-in">
                      <ImagePlaceholder ratio="portrait" label={`${item.objectNumber} — ${item.name}`} />
                    </ScrollZoomImage>
                  </div>

                  <div style={{ marginTop: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                        {item.objectNumber}
                      </span>
                      <span style={{ fontSize: '0.62rem', letterSpacing: '0.08em', color: 'var(--otaru-parchment-dim)', textTransform: 'uppercase' }}>
                        {item.origin.split('·')[0]}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--otaru-parchment)', margin: '0.25rem 0 0', lineHeight: 1.25 }}>
                      {item.name}
                    </h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.8rem', color: 'var(--otaru-parchment-dim)', borderTop: '1px solid var(--otaru-line)', paddingTop: '0.35rem' }}>
                      <span>{item.category}</span>
                      <span style={{ color: 'var(--otaru-parchment)', fontWeight: 500 }}>{formatPrice(item.price)}</span>
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>

        <RevealOnScroll className="text-center" style={{ marginTop: '3.8rem', textAlign: 'center' }}>
          <Link
            href="/archive"
            className="cta-link"
          >
            Enter the Complete Archive Index <span aria-hidden="true">→</span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}

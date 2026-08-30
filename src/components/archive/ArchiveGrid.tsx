'use client';

import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { useCurrency } from '@/lib/currency';
import { Product } from '@/lib/catalog';

interface ArchiveGridProps {
  products: { id: string; product: Product }[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ArchiveGrid({ products, page, totalPages, onPageChange }: ArchiveGridProps) {
  const { formatPrice } = useCurrency();

  if (products.length === 0) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--otaru-parchment-dim)' }}>
        Nothing matches those filters. The archive keeps sold-out listings as a record — try clearing one.
      </div>
    );
  }

  return (
    <div>
      <div
        className="archive-full-grid reveal-stagger"
        style={{
          marginTop: '2.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.8rem',
        }}
      >
        {products.map(({ id, product }, i) => {
          const isSoldOut = product.sizes.every((s) => s[1] === 0);

          return (
            <RevealOnScroll key={id} staggerIndex={i % 4}>
              <div className="artifact-card group" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <Link href={`/product/${id}`} className="block">
                  <div style={{ position: 'relative' }}>
                    <ImagePlaceholder ratio="portrait" label={`No. ${id} — 1200×1500`} />
                    {isSoldOut && (
                      <span
                        style={{
                          position: 'absolute',
                          left: '0.7rem',
                          top: '0.7rem',
                          zIndex: 1,
                          backgroundColor: 'rgba(11, 20, 32, 0.82)',
                          border: '1px solid var(--otaru-line-strong)',
                          color: 'var(--otaru-parchment-dim)',
                          fontSize: '0.62rem',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '20px',
                        }}
                      >
                        Sold out
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                    <span style={{ fontSize: '0.66rem', letterSpacing: '0.1em', color: 'var(--otaru-gold-dim)' }}>
                      No. {id}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--otaru-parchment)', margin: '0.1rem 0 0' }}>
                    {product.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--otaru-parchment-dim)', display: 'flex', justifyContent: 'space-between', marginTop: '0.15rem' }}>
                    <span>{product.material.split(',')[0]}</span>
                    <span>{formatPrice(product.price)}</span>
                  </div>
                </Link>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="Archive pagination"
          style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
        >
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={p === page ? 'is-active' : ''}
              style={{
                width: '2.25rem',
                height: '2.25rem',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid var(--otaru-line-strong)',
                color: p === page ? 'var(--otaru-ink)' : 'var(--otaru-parchment-dim)',
                backgroundColor: p === page ? 'var(--otaru-parchment)' : 'transparent',
                fontSize: '0.86rem',
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

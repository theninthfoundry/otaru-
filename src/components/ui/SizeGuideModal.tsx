'use client';

import React, { useEffect } from 'react';
import { useSizeGuide } from '@/lib/size-guide';
import { PRODUCT_CATALOG, SIZE_CHARTS } from '@/lib/catalog';

export function SizeGuideModal() {
  const { isOpen, productId, closeSizeGuide } = useSizeGuide();

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && isOpen) {
        closeSizeGuide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeSizeGuide]);

  if (!isOpen || !productId) return null;

  const product = PRODUCT_CATALOG[productId];
  if (!product) return null;

  const isTrouser = product.category === 'Trousers';
  const chart = isTrouser ? SIZE_CHARTS.bottom : SIZE_CHARTS.top;
  const fitSpec = product.specs.find((s) => s[0] === 'Fit');
  const fitText = fitSpec ? fitSpec[1] : 'Regular fit';

  return (
    <div
      className="sizeguide-overlay is-open"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeSizeGuide();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <div
        className="sizeguide-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '84vh',
          overflowY: 'auto',
          backgroundColor: 'var(--otaru-dusk)',
          border: '1px solid var(--otaru-line-strong)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
          padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--otaru-parchment)', margin: 0 }}>
              Size guide
            </h2>
            <p style={{ marginTop: '0.6rem', fontSize: '0.86rem', color: 'var(--otaru-parchment-dim)' }}>
              This piece: {fitText}. Measurements are for the garment, laid flat.
            </p>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={closeSizeGuide}
            aria-label="Close size guide"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
        </div>

        <table
          style={{
            width: '100%',
            marginTop: '1.5rem',
            borderCollapse: 'collapse',
            fontSize: '0.84rem',
          }}
        >
          <thead>
            <tr>
              {chart.headers.map((h, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: 'left',
                    padding: '0.6rem 0.5rem',
                    borderBottom: '1px solid var(--otaru-line)',
                    color: 'var(--otaru-gold-dim)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    fontSize: '0.68rem',
                    letterSpacing: '0.06em',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    style={{
                      padding: '0.6rem 0.5rem',
                      borderBottom: '1px solid var(--otaru-line)',
                      color: cIdx === 0 ? 'var(--otaru-parchment)' : 'var(--otaru-parchment-dim)',
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--otaru-line)' }}>
          <h3 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--otaru-parchment-dim)' }}>
            How to measure
          </h3>
          <ul style={{ margin: '0.9rem 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <li style={{ fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--otaru-parchment-dim)' }}>
              <strong style={{ color: 'var(--otaru-parchment)', fontWeight: 500 }}>Chest — </strong>
              measure under the arms, around the fullest part of the chest, keeping the tape level.
            </li>
            <li style={{ fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--otaru-parchment-dim)' }}>
              <strong style={{ color: 'var(--otaru-parchment)', fontWeight: 500 }}>Waist — </strong>
              measure around the narrowest part of your natural waistline.
            </li>
            <li style={{ fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--otaru-parchment-dim)' }}>
              <strong style={{ color: 'var(--otaru-parchment)', fontWeight: 500 }}>Sleeve — </strong>
              from the center back of the neck, over the shoulder, to the wrist.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

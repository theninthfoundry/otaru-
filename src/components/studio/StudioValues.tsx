import React from 'react';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { STUDIO_VALUES } from '@/lib/catalog';

const NUMERALS = ['一', '二', '三', '四'];

export function StudioValues() {
  return (
    <dl
      className="values-grid reveal-stagger"
      style={{
        marginTop: '3rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.5rem 2rem',
      }}
    >
      {STUDIO_VALUES.map((val, i) => (
        <RevealOnScroll key={val.title} staggerIndex={i}>
          <div
            className="value-item"
            style={{
              borderTop: '1px dashed rgba(217, 189, 131, 0.4)',
              paddingTop: '1.4rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
              <dt style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--otaru-parchment)' }}>
                {val.title}
              </dt>
              <span style={{ fontSize: '0.9rem', color: 'var(--otaru-gold-dim)', fontFamily: 'var(--font-display)' }}>
                {NUMERALS[i] || '・'}
              </span>
            </div>
            <dd style={{ margin: '0.4rem 0 0', lineHeight: 1.75, color: 'var(--otaru-parchment-dim)', fontSize: '0.92rem' }}>
              {val.text}
            </dd>
          </div>
        </RevealOnScroll>
      ))}
    </dl>
  );
}

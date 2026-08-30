import React from 'react';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { MILESTONES } from '@/lib/catalog';

export function MilestonesGrid() {
  return (
    <div
      className="milestones-section"
      style={{
        marginTop: '6.5rem',
        paddingTop: '4rem',
        borderTop: '1px solid var(--otaru-line)',
      }}
    >
      <RevealOnScroll>
        <span className="eyebrow">Kept, not sold</span>
        <h2 className="section-title">A few pieces we&apos;ve never let go of.</h2>
        <p className="section-lede">
          Not the archive you can buy from — the one we keep for ourselves. Milestones, not merchandise.
        </p>
      </RevealOnScroll>

      <div
        className="milestones-grid reveal-stagger"
        style={{
          marginTop: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.6rem',
        }}
      >
        {MILESTONES.map((m, i) => (
          <RevealOnScroll key={m.name} staggerIndex={i}>
            <div
              className="milestone-card"
              style={{
                position: 'relative',
                backgroundColor: 'var(--otaru-dusk)',
                border: '1px solid var(--otaru-line)',
                padding: '1rem',
              }}
            >
              <div style={{ position: 'relative' }}>
                <ImagePlaceholder ratio="portrait" label={m.name} />
                <span
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '0.75rem',
                    zIndex: 1,
                    backgroundColor: 'rgba(11, 20, 32, 0.82)',
                    border: '1px solid var(--otaru-gold-dim)',
                    color: 'var(--otaru-gold)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '20px',
                  }}
                >
                  {m.badge}
                </span>
              </div>
              <p style={{ marginTop: '0.9rem', fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--otaru-gold)' }}>
                {m.year}
              </p>
              <p style={{ marginTop: '0.3rem', fontSize: '1.02rem', color: 'var(--otaru-parchment)' }}>
                {m.name}
              </p>
              <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', lineHeight: 1.6, color: 'var(--otaru-parchment-dim)' }}>
                {m.story}
              </p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}

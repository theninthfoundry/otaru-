import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { CHAPTERS_DATA } from '@/lib/catalog';

const KANJI_MAP: Record<string, string> = {
  'Chapter I': '京都・夜',
  'Chapter II': '小樽・港',
  'Chapter III': '静寂・室',
  'Chapter 0': '原型・零',
};

export function ChapterIndexGrid() {
  return (
    <div
      className="chapters-index-grid reveal-stagger"
      style={{
        marginTop: '3.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem 2.2rem',
      }}
    >
      {CHAPTERS_DATA.map((ch, i) => {
        const kanji = KANJI_MAP[ch.numeral] || '章';

        return (
          <RevealOnScroll key={ch.numeral} staggerIndex={i}>
            <Link href="/chapters" className="block group chapter-card" style={{ textDecoration: 'none' }}>
              <div style={{ position: 'relative' }}>
                <ImagePlaceholder ratio="wide" label={`${ch.numeral} — ${ch.title}`} />
                {ch.status === 'archived' && (
                  <span
                    style={{
                      position: 'absolute',
                      left: '0.85rem',
                      top: '0.85rem',
                      backgroundColor: 'rgba(11, 20, 32, 0.85)',
                      backdropFilter: 'blur(4px)',
                      border: '1px dashed var(--otaru-line-strong)',
                      borderRadius: '2px',
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.58rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--otaru-gold-dim)',
                      zIndex: 6,
                    }}
                  >
                    Archived Run
                  </span>
                )}
              </div>
              <div style={{ marginTop: '1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--otaru-gold)' }}>
                    {ch.numeral}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--otaru-parchment-dim)', opacity: 0.6 }}>
                    · {kanji}
                  </span>
                </div>
                <span style={{ fontSize: '0.66rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                  {ch.season} · {ch.pieces} objects
                </span>
              </div>
              <h2 style={{ margin: '0.3rem 0 0', fontFamily: 'var(--font-display)', fontSize: '1.65rem', color: 'var(--otaru-parchment)' }}>
                {ch.title}
              </h2>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', lineHeight: 1.65, color: 'var(--otaru-parchment-dim)' }}>
                {ch.blurb}
              </p>
            </Link>
          </RevealOnScroll>
        );
      })}
    </div>
  );
}

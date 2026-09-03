import React from 'react';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ScrollTextReveal } from '@/components/ui/ScrollTextReveal';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';

export function Philosophy() {
  return (
    <section
      className="philosophy on-ink"
      style={{
        padding: 'clamp(6rem, 12vw, 10rem) 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Authentic Framed Floral Art Background Plate */}
      <ArtBackgroundPlate artName="poppies" position="top-right" opacity={0.14} maxWidth="420px" maxHeight="520px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.04} />

      {/* Vertical Japanese Calligraphy Watermarks */}
      <VerticalKanjiStamp text="針目一寸" subtext="AUTHENTIC SASHIKO STITCH" top="12%" left="3%" opacity={0.05} />
      <VerticalKanjiStamp text="無二永久" subtext="NO REPRINTS · PERMANENT RECORD" top="20%" right="3%" opacity={0.05} />

      <div className="wrap" style={{ maxWidth: '860px', position: 'relative', zIndex: 1 }}>
        <RevealOnScroll>
          {/* Micro Archival Stamp */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
            <span style={{ height: '1px', width: '30px', backgroundColor: 'var(--otaru-line-strong)' }} />
            <span style={{ fontSize: '0.64rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)', fontFamily: 'monospace' }}>
              PROVENANCE / PERMANENCE
            </span>
            <span style={{ height: '1px', width: '30px', backgroundColor: 'var(--otaru-line-strong)' }} />
          </div>

          <ScrollTextReveal
            as="blockquote"
            text="We do not chase seasons. We chase the right amount of time."
            highlightGold
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
              lineHeight: 1.3,
              maxWidth: '24ch',
              margin: '0 auto',
              color: 'var(--otaru-parchment)',
            }}
          />

          {/* Stillness Ledger */}
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--otaru-parchment)' }}>
                412 Objects
              </p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.66rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                Recorded in Archive
              </p>
            </div>

            <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--otaru-line)' }} />

            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--otaru-parchment)' }}>
                Zero Reprints
              </p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.66rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                Permanent Intention
              </p>
            </div>
          </div>

          <cite
            style={{
              display: 'block',
              marginTop: '3rem',
              fontStyle: 'normal',
              fontSize: '0.68rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--otaru-gold-dim)',
            }}
          >
            — Otaru Harbor Canal Atelier · Hokkaido MMXXVI
          </cite>
        </RevealOnScroll>
      </div>
    </section>
  );
}

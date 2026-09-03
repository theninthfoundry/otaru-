'use client';

import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ScrollTextReveal } from '@/components/ui/ScrollTextReveal';
import { ScrollZoomImage } from '@/components/ui/ScrollZoomImage';
import { SashikoGrid, VerticalKanjiStamp, JapaneseCornerBorder } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';

export function StoryJourney() {
  return (
    <section className="block on-ink" id="journey" aria-labelledby="story-heading" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Glowing Night Lanterns Art Plate */}
      <ArtBackgroundPlate artName="lanterns" position="top-right" opacity={0.22} maxWidth="780px" maxHeight="560px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.035} />

      {/* Vertical Japanese Calligraphy Watermarks */}
      <VerticalKanjiStamp text="北海石蔵" subtext="HOKKAIDO STONE WAREHOUSE 1907" top="10%" left="2%" opacity={0.045} />
      <VerticalKanjiStamp text="水と木と布" subtext="CANAL WATER · WOOD · RAW WEAVE" top="35%" right="3%" opacity={0.04} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="story-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2.5rem, 6vw, 6rem)',
            alignItems: 'center',
          }}
        >
          <RevealOnScroll>
            <JapaneseCornerBorder>
              <div style={{ border: '1px solid var(--otaru-line)', borderRadius: '2px', overflow: 'hidden' }}>
                <ScrollZoomImage intensity="medium" direction="out-to-in">
                  <ImagePlaceholder
                    ratio="tall"
                    label="Studio — Otaru, Hokkaido — 1000×1300"
                  />
                </ScrollZoomImage>
              </div>
            </JapaneseCornerBorder>
          </RevealOnScroll>

          <RevealOnScroll>
            <div className="story-copy">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                <span className="eyebrow" style={{ margin: 0 }}>The Studio</span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                  [ EST. 1907 · RECLAIMED 2026 ]
                </span>
              </div>
              <ScrollTextReveal
                as="h2"
                className="section-title"
                text="Otaru was a town before it was a name."
                highlightGold
                style={{ maxWidth: '14ch', lineHeight: 1.12 }}
              />
              <p style={{ marginTop: '1.4rem', color: 'var(--otaru-parchment-dim)', lineHeight: 1.8, maxWidth: '44ch', fontSize: '0.98rem' }}>
                In 1907 the stone harbor at Otaru moved more coal, herring, and raw cloth than any port in Hokkaido. The warehouses are mostly quiet now. We kept one.
              </p>
              <p style={{ marginTop: '1.2rem', color: 'var(--otaru-parchment-dim)', lineHeight: 1.8, maxWidth: '44ch', fontSize: '0.98rem' }}>
                Every artifact in this archive is developed in that warehouse, dyed in water drawn from the same canal the herring boats used, and finished by four craftspeople who have worked together for eleven years.
              </p>
              <p style={{ marginTop: '1.2rem', color: 'var(--otaru-parchment)', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: '1.15rem', maxWidth: '38ch' }}>
                &ldquo;We do not chase seasons. We chase the right amount of time.&rdquo;
              </p>
              <div style={{ marginTop: '2.2rem' }}>
                <Link
                  href="/studio"
                  className="cta-link"
                >
                  Read the full studio history <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

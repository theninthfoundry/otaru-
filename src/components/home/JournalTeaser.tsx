'use client';

import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';
import { JOURNAL_POSTS } from '@/lib/catalog';

export function JournalTeaser() {
  const posts = JOURNAL_POSTS.slice(0, 3);

  return (
    <section className="block on-dusk" id="journal" aria-labelledby="journal-heading" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Japanese Woodblock Cherry Blossom Plate */}
      <ArtBackgroundPlate artName="cherry-blossom" position="top-right" opacity={0.17} maxWidth="780px" maxHeight="580px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.035} />

      {/* Vertical Japanese Calligraphy Watermark */}
      <VerticalKanjiStamp text="日誌草稿" subtext="STUDIO JOURNAL NOTES" top="10%" left="2%" opacity={0.045} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <RevealOnScroll>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="eyebrow">Field Notes & Observations</span>
              <h2 className="section-title" id="journal-heading">Notes from the warehouse floor.</h2>
            </div>
            <p className="section-lede" style={{ margin: 0 }}>
              Written in the hours between dye batches. Studies in textile longevity, mineral baths, and repair.
            </p>
          </div>
        </RevealOnScroll>

        <div
          className="journal-grid reveal-stagger"
          style={{
            marginTop: '3.2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem 2rem',
          }}
        >
          {posts.map((item, i) => (
            <RevealOnScroll key={item.id} staggerIndex={i}>
              <Link href="/journal" className="block group chapter-card" style={{ textDecoration: 'none' }}>
                <div style={{ overflow: 'hidden', borderRadius: '2px', border: '1px solid var(--otaru-line)' }}>
                  <ImagePlaceholder ratio="wide" label={`FIELD NOTES / 0${i + 1} — ${item.title}`} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                    FIELD NOTES / 0{i + 1}
                  </span>
                  <span style={{ fontSize: '0.62rem', letterSpacing: '0.1em', color: 'var(--otaru-parchment-dim)', textTransform: 'uppercase' }}>
                    {item.date}
                  </span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', marginTop: '0.4rem', lineHeight: 1.25, color: 'var(--otaru-parchment)' }}>
                  {item.title}
                </h3>
                <p style={{ marginTop: '0.5rem', fontSize: '0.84rem', lineHeight: 1.6, color: 'var(--otaru-parchment-dim)' }}>
                  {item.excerpt}
                </p>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll className="text-center" style={{ marginTop: '3.5rem', textAlign: 'center' }}>
          <Link
            href="/journal"
            className="cta-link"
          >
            Read the Studio Field Notes <span aria-hidden="true">→</span>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}

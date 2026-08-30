'use client';

import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { ScrollZoomImage } from '@/components/ui/ScrollZoomImage';
import { SashikoGrid, VerticalKanjiStamp, AsciiWaveArt } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';

interface Chapter {
  numeral: string;
  season: string;
  kanjiTitle: string;
  title: string;
  copy: string;
  tags: string[];
  href: string;
  imageLabel: string;
}

const CHAPTERS: Chapter[] = [
  {
    numeral: 'CHAPTER 01',
    season: 'AUTUMN / WINTER MMXXVI',
    kanjiTitle: '京都・夜',
    title: 'Kyoto Nights',
    copy: 'Botanical sukumo indigo, cut for the quiet hours between dusk and the last train. Eleven pieces, none of them loud.',
    tags: ['Indigo cotton twill', '11 objects', 'AW26 Active'],
    href: '/chapters',
    imageLabel: 'Chapter I — Kyoto Nights — 1800×1200',
  },
  {
    numeral: 'CHAPTER 02',
    season: 'WINTER MMXXVI',
    kanjiTitle: '小樽・港',
    title: 'Otaru Harbor',
    copy: 'Oiled canvas and boiled wool, built for salt air and the walk from the ferry. Named for the stone canal warehouse we work out of.',
    tags: ['Oiled canvas & raw wool', '8 objects', 'Winter 2026'],
    href: '/chapters',
    imageLabel: 'Chapter II — Otaru Harbor — 1800×1200',
  },
  {
    numeral: 'CHAPTER 03',
    season: 'SPRING / SUMMER MMXXVI',
    kanjiTitle: '静寂・室',
    title: 'Quiet Interior',
    copy: "Undyed hemp and washed silk, made for the rooms we don't photograph. The most restrained chapter in the archive.",
    tags: ['Undyed hemp & sandwashed silk', '6 objects', 'SS26'],
    href: '/chapters',
    imageLabel: 'Chapter III — Quiet Interior — 1800×1200',
  },
];

export function ChapterShowcase() {
  return (
    <section className="block on-ink" id="chapters" aria-labelledby="chapters-heading" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Authentic Japanese Woodblock Background Plates */}
      <ArtBackgroundPlate artName="great-wave" position="top-right" opacity={0.16} maxWidth="580px" maxHeight="420px" />
      <ArtBackgroundPlate artName="cherry-blossom" position="bottom-left" opacity={0.13} maxWidth="480px" maxHeight="480px" />

      {/* Background Sashiko Textile Grid */}
      <SashikoGrid opacity={0.035} />

      {/* Vertical Japanese Calligraphy Watermarks in Background */}
      <VerticalKanjiStamp text="四季織録" subtext="ARCHIVE SEASONAL CHRONICLE" top="4%" right="3%" opacity={0.05} />
      <VerticalKanjiStamp text="小樽染色所" subtext="CANAL STUDIO 43.19° N" top="45%" left="2%" opacity={0.04} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <RevealOnScroll>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                <span className="eyebrow" style={{ margin: 0 }}>The Living Chapters</span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                  [ CHAPTER RUN 01–03 ]
                </span>
              </div>
              <h2 className="section-title" id="chapters-heading">Every chapter, a season told in cloth.</h2>
            </div>

            {/* Right Top Area with Minimal ASCII Wave & Coordinates */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.8rem', maxWidth: '420px' }}>
              <AsciiWaveArt opacity={0.16} />
              <p className="section-lede" style={{ margin: 0, fontSize: '0.88rem' }}>
                Chronicles of textile exploration across Hokkaido, Tokushima, Ōmi, and Kiryū.
              </p>
            </div>
          </div>
        </RevealOnScroll>

        <div style={{ marginTop: '3.5rem' }}>
          {CHAPTERS.map((ch, i) => {
            const isReverse = i % 2 === 1;

            return (
              <div key={ch.numeral}>
                {/* Signature Chapter Transition Separator with Sashiko Stitching */}
                <div style={{ padding: '2.5rem 0 1rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                  <span style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--otaru-gold-dim)', fontFamily: 'monospace' }}>
                    {ch.numeral} · {ch.season}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--otaru-parchment-dim)', opacity: 0.35, fontFamily: 'var(--font-display)' }}>
                    {ch.kanjiTitle}
                  </span>
                  <span style={{ flex: 1, borderTop: '1px dashed var(--otaru-line-strong)', height: '0px' }} />
                  <span style={{ fontSize: '0.58rem', letterSpacing: '0.14em', color: 'var(--otaru-horizon)', fontFamily: 'monospace' }}>
                    RECORD / 0{i + 1}
                  </span>
                </div>

                <RevealOnScroll>
                  <div
                    className="chapter-row chapter-card"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isReverse ? '0.95fr 1.05fr' : '1.05fr 0.95fr',
                      gap: 'clamp(2rem, 6vw, 5rem)',
                      alignItems: 'center',
                      padding: 'clamp(2rem, 5vw, 3.5rem) 0 4.5rem',
                      position: 'relative',
                    }}
                  >
                    <div style={{ order: isReverse ? 2 : 1 }}>
                      <div style={{ overflow: 'hidden', borderRadius: '2px', border: '1px solid var(--otaru-line)', position: 'relative' }}>
                        <ScrollZoomImage intensity="medium" direction="out-to-in">
                          <ImagePlaceholder ratio="wide" label={ch.imageLabel} />
                        </ScrollZoomImage>
                      </div>
                    </div>
                    <div style={{ order: isReverse ? 1 : 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ width: '16px', height: '1px', backgroundColor: 'var(--otaru-gold)' }} />
                        <span style={{ fontSize: '0.65rem', letterSpacing: '0.16em', color: 'var(--otaru-gold)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                          {ch.kanjiTitle}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 3.8vw, 3.1rem)', marginTop: '0.4rem', maxWidth: '16ch', color: 'var(--otaru-parchment)', lineHeight: 1.12 }}>
                        {ch.title}
                      </h3>
                      <p style={{ marginTop: '1.2rem', color: 'var(--otaru-parchment-dim)', maxWidth: '44ch', lineHeight: 1.8, fontSize: '0.96rem' }}>
                        {ch.copy}
                      </p>
                      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {ch.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: '0.66rem',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: 'var(--otaru-parchment-dim)',
                              border: '1px dashed var(--otaru-line-strong)',
                              padding: '0.35rem 0.8rem',
                              borderRadius: '2px',
                              backgroundColor: 'rgba(14, 23, 36, 0.4)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div style={{ marginTop: '2.2rem' }}>
                        <Link
                          href={ch.href}
                          className="cta-link"
                        >
                          Explore Chapter Record <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </RevealOnScroll>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

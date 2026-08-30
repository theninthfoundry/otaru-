import React from 'react';
import { ChapterIndexGrid } from '@/components/chapters/ChapterIndexGrid';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';

export default function ChaptersPage() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Japanese Art Plates */}
      <ArtBackgroundPlate artName="cherry-blossom" position="top-right" opacity={0.20} maxWidth="820px" maxHeight="620px" />
      <ArtBackgroundPlate artName="great-wave" position="bottom-left" opacity={0.17} maxWidth="780px" maxHeight="560px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.035} />

      {/* Vertical Japanese Calligraphy Watermarks */}
      <VerticalKanjiStamp text="四時四章" subtext="FOUR SEASONS · FOUR CHAPTERS" top="10%" right="2.5%" opacity={0.05} />
      <VerticalKanjiStamp text="永久記録" subtext="PERMANENT CHAPTER LEDGER" top="55%" left="2%" opacity={0.045} />

      <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
          <span className="eyebrow" style={{ margin: 0 }}>The chapters</span>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            [ SEASONAL VOLUMES ]
          </span>
        </div>
        <h1 className="section-title" style={{ maxWidth: '24ch' }}>
          We don&apos;t think of our collections as seasons. We think of them as chapters.
        </h1>
        <p className="section-lede" style={{ maxWidth: '58ch' }}>
          A chapter has a beginning, an atmosphere, and its own objects. Eventually it becomes part of the archive — not a catalog of what we&apos;ve made, but a record of what has existed.
        </p>

        <ChapterIndexGrid />
      </div>
    </div>
  );
}

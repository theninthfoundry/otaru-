'use client';

import React, { useState } from 'react';
import { JournalFeatured } from '@/components/journal/JournalFeatured';
import { JournalGrid } from '@/components/journal/JournalGrid';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';
import { JOURNAL_POSTS } from '@/lib/catalog';
import clsx from 'clsx';

const CATEGORIES = ['All', 'Philosophy', 'Process'];

export default function JournalPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All'
    ? JOURNAL_POSTS
    : JOURNAL_POSTS.filter((p) => p.cat === activeCategory);

  const featured = filteredPosts[0];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Japanese Art Plates */}
      <ArtBackgroundPlate artName="poppies" position="top-right" opacity={0.19} maxWidth="750px" maxHeight="580px" />
      <ArtBackgroundPlate artName="cherry-blossom" position="bottom-left" opacity={0.16} maxWidth="680px" maxHeight="520px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.035} />

      {/* Vertical Japanese Calligraphy Watermarks */}
      <VerticalKanjiStamp text="思索記録" subtext="REFLECTIVE FIELD NOTES" top="10%" right="2.5%" opacity={0.05} />
      <VerticalKanjiStamp text="染織私語" subtext="BOTANICAL & DYE STUDIES" top="50%" left="2%" opacity={0.045} />

      <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
          <span className="eyebrow" style={{ margin: 0 }}>The journal</span>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            [ FIELD NOTES & REFLECTIONS ]
          </span>
        </div>
        <h1 className="section-title" style={{ maxWidth: '24ch' }}>
          Notes from the warehouse floor — and the ideas behind it.
        </h1>

        <div
          className="filter-row"
          role="group"
          aria-label="Filter journal entries"
          style={{ display: 'flex', gap: '0.6rem', marginTop: '2.5rem', flexWrap: 'wrap' }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={clsx('filter-chip', isActive && 'is-active')}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--otaru-ink)' : 'var(--otaru-parchment-dim)',
                  backgroundColor: isActive ? 'var(--otaru-parchment)' : 'transparent',
                  border: isActive ? '1px solid var(--otaru-parchment)' : '1px solid var(--otaru-line-strong)',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '20px',
                  transition: 'background-color var(--duration-fast), color var(--duration-fast), border-color var(--duration-fast)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {featured && <JournalFeatured story={featured} />}
        <JournalGrid category={activeCategory} excludeId={featured?.id} />
      </div>
    </div>
  );
}

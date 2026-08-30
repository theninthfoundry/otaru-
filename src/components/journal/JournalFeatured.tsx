'use client';

import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

interface FeaturedStory {
  id: string;
  cat: string;
  date: string;
  title: string;
  excerpt: string;
}

interface JournalFeaturedProps {
  story: FeaturedStory;
}

export function JournalFeatured({ story }: JournalFeaturedProps) {
  return (
    <div
      className="jr-featured"
      style={{
        marginTop: '3rem',
        paddingBottom: '3.5rem',
        borderBottom: '1px dashed rgba(217, 189, 131, 0.35)',
      }}
    >
      <Link
        href="/journal"
        className="chapter-row group"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.15fr 1fr',
          gap: 'clamp(2rem, 6vw, 4rem)',
          alignItems: 'center',
          textDecoration: 'none',
        }}
      >
        <div>
          <ImagePlaceholder ratio="wide" label={`Journal Featured — ${story.title}`} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <span style={{ width: '16px', height: '1px', backgroundColor: 'var(--otaru-gold)' }} />
            <span style={{ fontSize: '0.64rem', letterSpacing: '0.18em', color: 'var(--otaru-gold)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
              PRIMARY DISPATCH · {story.cat}
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: 'var(--otaru-parchment)', marginTop: '0.2rem', lineHeight: 1.2 }}>
            {story.title}
          </h2>
          <p style={{ marginTop: '1rem', color: 'var(--otaru-parchment-dim)', lineHeight: 1.75, fontSize: '0.96rem' }}>
            {story.excerpt}
          </p>
          <div style={{ marginTop: '1.6rem' }}>
            <span className="cta-link">
              Read the full field notes entry <span aria-hidden="true">→</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

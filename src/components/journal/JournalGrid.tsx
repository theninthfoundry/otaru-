'use client';

import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { JOURNAL_POSTS } from '@/lib/catalog';

interface JournalGridProps {
  category?: string;
  excludeId?: string;
}

export function JournalGrid({ category = 'All', excludeId }: JournalGridProps) {
  let posts = category === 'All'
    ? JOURNAL_POSTS
    : JOURNAL_POSTS.filter((p) => p.cat === category);

  if (excludeId) {
    posts = posts.filter((p) => p.id !== excludeId);
  }

  return (
    <div
      className="journal-grid reveal-stagger"
      style={{
        marginTop: '3.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2.8rem 2rem',
      }}
    >
      {posts.map((item, i) => (
        <RevealOnScroll key={item.id} staggerIndex={i % 3}>
          <Link href="/journal" className="block group chapter-card" style={{ textDecoration: 'none' }}>
            <div style={{ borderRadius: '2px', overflow: 'hidden' }}>
              <ImagePlaceholder ratio="wide" label={`Journal — ${item.title}`} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '1.1rem' }}>
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
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', lineHeight: 1.65, color: 'var(--otaru-parchment-dim)' }}>
              {item.excerpt}
            </p>
          </Link>
        </RevealOnScroll>
      ))}
    </div>
  );
}

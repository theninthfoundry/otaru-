import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { CHAPTERS_DATA } from '@/lib/catalog';

interface ChapterSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChapterSlugPage({ params }: ChapterSlugPageProps) {
  const { slug } = await params;
  const chapter = CHAPTERS_DATA.find((c) => c.title.toLowerCase().replace(/\s+/g, '-') === slug) || CHAPTERS_DATA[0]!;

  return (
    <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.76rem', color: 'var(--otaru-parchment-dim)', marginBottom: '2rem' }}>
        <Link href="/chapters" style={{ color: 'inherit' }}>Chapters</Link>
        <span aria-hidden="true">/</span>
        <span style={{ color: 'var(--otaru-parchment)' }}>{chapter.numeral}</span>
      </nav>

      <span className="eyebrow">{chapter.numeral} · {chapter.season}</span>
      <h1 className="section-title" style={{ marginTop: '0.5rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
        {chapter.title}
      </h1>
      <p className="section-lede" style={{ marginTop: '1rem' }}>
        {chapter.blurb}
      </p>

      <div style={{ margin: '3rem 0' }}>
        <ImagePlaceholder ratio="wide" label={`${chapter.numeral} — ${chapter.title} — 1600×1200`} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid var(--otaru-line)' }}>
        <Link href="/chapters" className="cta-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--otaru-parchment)', borderBottom: '1px solid var(--otaru-gold-dim)', paddingBottom: '0.2rem' }}>
          ← Back to all chapters
        </Link>
        <Link href="/archive" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '0.8rem 1.6rem' }}>
          Explore Chapter Artifacts
        </Link>
      </div>
    </div>
  );
}

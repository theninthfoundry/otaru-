import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { JOURNAL_POSTS } from '@/lib/catalog';

interface JournalSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function JournalSlugPage({ params }: JournalSlugPageProps) {
  const { slug } = await params;
  const post = JOURNAL_POSTS.find((p) => p.id === slug) || JOURNAL_POSTS[0]!;

  return (
    <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', maxWidth: '760px' }}>
      <nav aria-label="Breadcrumb" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.76rem', color: 'var(--otaru-parchment-dim)', marginBottom: '2rem' }}>
        <Link href="/journal" style={{ color: 'inherit' }}>Journal</Link>
        <span aria-hidden="true">/</span>
        <span style={{ color: 'var(--otaru-parchment)' }}>{post.cat}</span>
      </nav>

      <span className="eyebrow">{post.cat}</span>
      <h1 className="section-title" style={{ marginTop: '0.5rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
        {post.title}
      </h1>
      <p style={{ marginTop: '0.5rem', fontSize: '0.76rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
        {post.date} · Otaru Studio
      </p>

      <div style={{ margin: '2.5rem 0' }}>
        <ImagePlaceholder ratio="wide" label={post.title} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem', color: 'var(--otaru-parchment-dim)', fontSize: '1.05rem', lineHeight: 1.8 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.35rem', color: 'var(--otaru-parchment)', lineHeight: 1.6 }}>
          &ldquo;{post.excerpt}&rdquo;
        </p>
        <p>
          In our Otaru warehouse, work moves at the pace of the materials themselves. When we cut hemp or dye indigo with water drawn from the harbor canal, the process is never hurried. Every piece is an artifact designed to age gracefully alongside the person who keeps it.
        </p>
        <p>
          We do not chase trends or fleeting seasons. A good garment carries its own biography in every softened collar, faded crease, and repaired seam.
        </p>
      </div>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--otaru-line)' }}>
        <Link href="/journal" className="cta-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--otaru-parchment)', borderBottom: '1px solid var(--otaru-gold-dim)', paddingBottom: '0.2rem' }}>
          ← Back to all journal entries
        </Link>
      </div>
    </div>
  );
}

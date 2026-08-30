import React from 'react';
import { ChapterIndexGrid } from '@/components/chapters/ChapterIndexGrid';

export default function ChapterPage() {
  return (
    <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem' }}>
      <span className="eyebrow">The chapters</span>
      <h1 className="section-title" style={{ maxWidth: '24ch' }}>
        We don&apos;t think of our collections as seasons. We think of them as chapters.
      </h1>
      <p className="section-lede" style={{ maxWidth: '58ch' }}>
        A chapter has a beginning, an atmosphere, and its own objects. Eventually it becomes part of the archive — not a catalog of what we&apos;ve made, but a record of what has existed.
      </p>

      <ChapterIndexGrid />
    </div>
  );
}

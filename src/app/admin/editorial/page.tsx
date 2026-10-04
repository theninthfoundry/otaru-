'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CANONICAL_CHAPTERS,
  CANONICAL_ESSAYS,
  CANONICAL_MAKERS,
  EditorialChapter,
  EditorialEssay,
} from '@/lib/domain/editorial/editorial-service';

export default function EditorialConsolePage() {
  const [chapters, setChapters] = useState<EditorialChapter[]>(CANONICAL_CHAPTERS);
  const [essays, setEssays] = useState<EditorialEssay[]>(CANONICAL_ESSAYS);
  const [activeTab, setActiveTab] = useState<'CHAPTERS' | 'ESSAYS' | 'MAKERS'>('CHAPTERS');

  const toggleChapterStatus = (id: string) => {
    setChapters((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newStatus = c.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        return { ...c, status: newStatus };
      })
    );
  };

  const toggleEssayStatus = (id: string) => {
    setEssays((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const newStatus = e.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        return { ...e, status: newStatus };
      })
    );
  };

  return (
    <main
      style={{
        backgroundColor: '#070d14',
        minHeight: '100vh',
        color: 'var(--otaru-parchment)',
        fontFamily: 'var(--font-sans)',
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3.5rem)',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--otaru-line)', paddingBottom: '1.2rem', marginBottom: '2.5rem' }}>
        <div>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--otaru-gold)' }}>
            ATELIER EDITORIAL CMS / 編集統括
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', margin: '0.3rem 0 0', fontWeight: 400 }}>
            Editorial Publishing Center
          </h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Link href="/admin/atelier" style={{ fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--otaru-gold-dim)', textDecoration: 'none' }}>
            ← BACK TO ATELIER OS
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--otaru-line)', marginBottom: '2rem' }}>
        {(['CHAPTERS', 'ESSAYS', 'MAKERS'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--otaru-gold)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--otaru-gold)' : 'var(--otaru-parchment-dim)',
              padding: '0.6rem 0',
              fontSize: '0.82rem',
              letterSpacing: '0.16em',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab: Chapters */}
      {activeTab === 'CHAPTERS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              style={{
                border: '1px solid var(--otaru-line)',
                backgroundColor: 'rgba(23,41,62,0.2)',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: 'var(--otaru-gold-dim)' }}>
                  {chapter.numeral} · {chapter.kanjiTitle}
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '0.2rem 0 0.4rem', fontWeight: 400 }}>
                  {chapter.title}
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--otaru-parchment-dim)', maxWidth: '54ch' }}>
                  {chapter.excerpt}
                </p>
                <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: 'var(--otaru-horizon)' }}>
                  Season: {chapter.season} · Slug: /chapter/{chapter.slug}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.1em',
                    padding: '0.2rem 0.6rem',
                    border: '1px solid var(--otaru-line-strong)',
                    color: chapter.status === 'PUBLISHED' ? '#52b788' : 'var(--otaru-parchment-dim)',
                  }}
                >
                  {chapter.status}
                </span>
                <button
                  type="button"
                  onClick={() => toggleChapterStatus(chapter.id)}
                  style={{
                    background: 'none',
                    border: '1px solid var(--otaru-gold)',
                    color: 'var(--otaru-gold)',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.72rem',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  {chapter.status === 'PUBLISHED' ? 'UNPUBLISH' : 'PUBLISH LIVE'}
                </button>
                <Link
                  href={`/chapter/${chapter.slug}`}
                  target="_blank"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--otaru-parchment)',
                    textDecoration: 'underline',
                  }}
                >
                  PREVIEW ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Essays */}
      {activeTab === 'ESSAYS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {essays.map((essay) => (
            <div
              key={essay.id}
              style={{
                border: '1px solid var(--otaru-line)',
                backgroundColor: 'rgba(23,41,62,0.2)',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: 'var(--otaru-gold-dim)' }}>
                  {essay.category} · {essay.kanjiCategory}
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '0.2rem 0 0.4rem', fontWeight: 400 }}>
                  {essay.title}
                </h2>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--otaru-parchment-dim)' }}>
                  Author: {essay.author} · {essay.readTimeMinutes} min read
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    letterSpacing: '0.1em',
                    padding: '0.2rem 0.6rem',
                    border: '1px solid var(--otaru-line-strong)',
                    color: essay.status === 'PUBLISHED' ? '#52b788' : 'var(--otaru-parchment-dim)',
                  }}
                >
                  {essay.status}
                </span>
                <button
                  type="button"
                  onClick={() => toggleEssayStatus(essay.id)}
                  style={{
                    background: 'none',
                    border: '1px solid var(--otaru-gold)',
                    color: 'var(--otaru-gold)',
                    padding: '0.4rem 0.8rem',
                    fontSize: '0.72rem',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  {essay.status === 'PUBLISHED' ? 'UNPUBLISH' : 'PUBLISH LIVE'}
                </button>
                <Link
                  href={`/journal/${essay.slug}`}
                  target="_blank"
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--otaru-parchment)',
                    textDecoration: 'underline',
                  }}
                >
                  PREVIEW ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Makers */}
      {activeTab === 'MAKERS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {CANONICAL_MAKERS.map((maker) => (
            <div
              key={maker.id}
              style={{
                border: '1px solid var(--otaru-line)',
                backgroundColor: 'rgba(23,41,62,0.2)',
                padding: '1.5rem',
              }}
            >
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: 'var(--otaru-gold-dim)' }}>
                {maker.kanjiName} · {maker.role}
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', margin: '0.3rem 0', fontWeight: 400 }}>
                {maker.name}
              </h2>
              <p style={{ margin: '0 0 0.8rem', fontSize: '0.78rem', color: 'var(--otaru-horizon)' }}>
                {maker.atelierLocation} · {maker.experienceYears} Years Experience
              </p>
              <p style={{ margin: '0 0 1rem', fontSize: '0.84rem', fontStyle: 'italic', color: 'var(--otaru-parchment-dim)' }}>
                &ldquo;{maker.quote}&rdquo;
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--otaru-parchment-dim)' }}>
                {maker.bio}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

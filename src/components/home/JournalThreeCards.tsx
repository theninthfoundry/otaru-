'use client';

import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { JOURNAL_POSTS } from '@/lib/catalog';

interface EnrichedPost {
  relatedObjectId: string;
  relatedObjectName: string;
}

const POST_OBJECT_LINKS: Record<string, EnrichedPost> = {
  'archive-of-a-life': { relatedObjectId: '041', relatedObjectName: 'Yama Field Jacket' },
  'on-repair': { relatedObjectId: '042', relatedObjectName: 'Kiryū Wrap Trouser' },
  'what-remains': { relatedObjectId: '043', relatedObjectName: 'Biratori Overshirt' },
};

/**
 * JournalThreeCards — Movement 10: Field Notes & Archival Context
 * 
 * Editorial articles connecting philosophy and material practice directly
 * to tangible objects in the archive.
 */
export function JournalThreeCards() {
  const posts = JOURNAL_POSTS.slice(0, 3);

  return (
    <section className="section-pad bg-[var(--paper)] text-[var(--ink)] border-t border-hairline" id="journal">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-hairline">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
              Field Notes · Movement 10
            </span>
            <h2 className="display-l text-[var(--ink)]">
              Studio journal.
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-[var(--ink)]/65 max-w-[34ch] leading-relaxed hidden sm:block">
              Essays on botanical dyeing, low-tension looms, and the psychology of keeping garments for life.
            </p>
            <Link
              href="/journal"
              className="text-xs font-mono tracking-widest uppercase text-[var(--indigo)] hover:underline whitespace-nowrap"
            >
              All Notes ({JOURNAL_POSTS.length}) →
            </Link>
          </div>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {posts.map((post, idx) => {
            const linkMeta = POST_OBJECT_LINKS[post.id] || { relatedObjectId: '041', relatedObjectName: 'Yama Field Jacket' };
            return (
              <div
                key={post.id}
                className="group flex flex-col justify-between border border-hairline bg-[var(--paper-2)] p-6 transition-all duration-300 hover:border-[var(--ink)]/40 hover:bg-[var(--paper)]"
              >
                <div>
                  <Link href="/journal" className="block overflow-hidden border border-hairline mb-5">
                    <ImagePlaceholder ratio="wide" label={`FIELD NOTES / 0${idx + 1} — ${post.title}`} />
                  </Link>

                  <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-[var(--ink-muted)] mb-3">
                    <span>NOTE 0{idx + 1}</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="font-display text-xl text-[var(--ink)] group-hover:text-[var(--indigo)] transition-colors line-clamp-2 mb-3 leading-snug">
                    <Link href="/journal">{post.title}</Link>
                  </h3>

                  <p className="text-xs text-[var(--ink)]/75 line-clamp-3 leading-relaxed mb-6 font-sans">
                    {post.excerpt}
                  </p>
                </div>

                {/* Editorial-to-Commerce Bridge */}
                <div className="pt-4 border-t border-hairline flex flex-col gap-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-[var(--ink-muted)]">
                    <span className="uppercase tracking-wider">Origin of:</span>
                    <Link 
                      href={`/product/${linkMeta.relatedObjectId}`}
                      className="text-[var(--ink)] hover:text-[var(--indigo)] underline"
                    >
                      Object {linkMeta.relatedObjectId}
                    </Link>
                  </div>
                  <Link
                    href="/journal"
                    className="text-[var(--indigo)] flex items-center justify-between pt-1 hover:underline text-xs"
                  >
                    <span>Read Note</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

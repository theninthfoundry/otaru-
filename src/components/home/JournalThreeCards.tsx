'use client';

import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import { JOURNAL_POSTS } from '@/lib/catalog';

export function JournalThreeCards() {
  const posts = JOURNAL_POSTS.slice(0, 3);

  return (
    <section className="section-pad bg-[var(--paper)] text-[var(--ink)] border-t border-hairline" id="journal">
      <div className="wrap">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
              Field Notes
            </span>
            <h2 className="display-l text-[var(--ink)]">
              Studio journal.
            </h2>
          </div>
          <Link
            href="/journal"
            className="text-xs font-mono tracking-wider uppercase text-[var(--indigo)] hover:text-[var(--ink)] transition-colors"
          >
            View All Notes ({JOURNAL_POSTS.length}) →
          </Link>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <Link
              key={post.id}
              href="/journal"
              className="group flex flex-col justify-between border border-hairline bg-[var(--paper-2)] p-4 sm:p-5 transition-transform hover:-translate-y-1 duration-300"
            >
              <div>
                <div className="overflow-hidden border border-hairline mb-5">
                  <ImagePlaceholder ratio="wide" label={`FIELD NOTES / 0${idx + 1} — ${post.title}`} />
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase text-[var(--ink-muted)] mb-2">
                  <span>NOTE 0{idx + 1}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="font-display text-xl text-[var(--ink)] group-hover:text-[var(--indigo)] transition-colors line-clamp-2 mb-3">
                  {post.title}
                </h3>
                <p className="text-xs text-[var(--ink)]/70 line-clamp-3 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-hairline/60 font-mono text-[11px] text-[var(--indigo)] flex items-center justify-between">
                <span>{post.readTime}</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

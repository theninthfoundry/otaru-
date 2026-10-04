'use client';

import React from 'react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';

interface ChapterItem {
  number: string;
  season: string;
  title: string;
  copy: string;
  tag: string;
  label: string;
}

const CHAPTERS_DATA: ChapterItem[] = [
  {
    number: 'CHAPTER 01',
    season: 'AUTUMN / WINTER',
    title: 'Kyoto Nights',
    copy: 'Botanical sukumo indigo, cut for the quiet hours between dusk and the last train. Eleven pieces, none of them loud.',
    tag: 'Botanical Indigo · 11 Objects',
    label: 'Chapter I — Kyoto Nights — 1800×1200',
  },
  {
    number: 'CHAPTER 02',
    season: 'WINTER',
    title: 'Otaru Harbor',
    copy: 'Oiled canvas and boiled wool, built for salt air and the walk from the ferry. Named for the stone canal warehouse we work out of.',
    tag: 'Oiled Canvas & Raw Wool · 8 Objects',
    label: 'Chapter II — Otaru Harbor — 1800×1200',
  },
  {
    number: 'CHAPTER 03',
    season: 'SPRING / SUMMER',
    title: 'Quiet Interior',
    copy: "Undyed hemp and washed silk, made for the rooms we don't photograph. The most restrained chapter in the archive.",
    tag: 'Undyed Hemp & Washed Silk · 6 Objects',
    label: 'Chapter III — Quiet Interior — 1800×1200',
  },
];

export function ChaptersScrollSnap() {
  return (
    <section className="section-pad bg-[var(--paper-2)] border-t border-hairline overflow-hidden" id="chapters">
      <div className="wrap mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
            Living Archive
          </span>
          <h2 className="display-l text-[var(--ink)]">
            Chapters.
          </h2>
        </div>
        <p className="text-sm text-[var(--ink)]/65 max-w-[36ch]">
          Seasonal collections preserved in continuous sequence. Desktop scroll horizontally across the series.
        </p>
      </div>

      {/* Horizontal Scroll-Snap Container (Desktop) / Vertical Stack (Mobile) */}
      <div className="wrap">
        <div className="flex flex-col lg:flex-row gap-8 lg:overflow-x-auto lg:snap-x lg:snap-mandatory pb-6 lg:scroll-smooth no-scrollbar">
          {CHAPTERS_DATA.map((ch) => (
            <div
              key={ch.number}
              className="lg:min-w-[620px] lg:max-w-[700px] flex-1 lg:snap-start border border-hairline bg-[var(--paper)] p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] tracking-widest uppercase text-[var(--ink-muted)] pb-4 border-b border-hairline mb-6">
                  <span>{ch.number}</span>
                  <span>{ch.season}</span>
                </div>

                <div className="overflow-hidden border border-hairline mb-6">
                  <ImagePlaceholder ratio="wide" label={ch.label} />
                </div>

                <h3 className="font-display text-3xl sm:text-4xl text-[var(--ink)] mb-3">
                  {ch.title}
                </h3>
                <p className="text-sm text-[var(--ink)]/70 leading-relaxed mb-6">
                  {ch.copy}
                </p>
              </div>

              <div className="pt-4 border-t border-hairline flex items-center justify-between">
                <span className="font-mono text-xs text-[var(--ink-muted)]">
                  {ch.tag}
                </span>
                <Link
                  href="/chapters"
                  className="text-xs font-medium uppercase tracking-wider text-[var(--indigo)] hover:text-[var(--ink)] transition-colors flex items-center gap-1.5"
                >
                  Explore Chapter →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

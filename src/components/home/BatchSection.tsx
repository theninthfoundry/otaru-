'use client';

import React from 'react';
import Link from 'next/link';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import { ObjectCard } from './ObjectCard';

const BATCH_IDS = ['041', '042', '043', '044'];

/**
 * BatchSection — Movement 03: Current Batch (DISCOVERY & DESIRE)
 * 
 * Asymmetric editorial rhythm presenting the active 4 hand-numbered releases.
 * Replaces commerce quick-adds with contemplation and archival depth.
 */
export function BatchSection() {
  return (
    <section className="section-pad bg-[var(--paper)] text-[var(--ink)]" id="batch" aria-labelledby="batch-heading">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-hairline">
          <div>
            <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
              Batch 01 · Hand-Numbered Allocation
            </span>
            <h2 id="batch-heading" className="display-l text-[var(--ink)]">
              Current Batch.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <p className="text-sm text-[var(--ink)]/65 max-w-[36ch] leading-relaxed">
              Cut and botanical-dyed in strictly limited runs. Once the allocation concludes, the pattern enters permanent archive.
            </p>
            <Link
              href="/archive"
              className="text-xs font-mono tracking-widest uppercase text-[var(--indigo)] hover:underline whitespace-nowrap hidden lg:inline-block"
            >
              All 10 Holdings →
            </Link>
          </div>
        </div>

        {/* Asymmetric 12-Col Layout: Large (7) / Tall (5) / Small (6) / Small (6) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pt-12">
          {BATCH_IDS.map((id, index) => {
            const item = PRODUCT_CATALOG[id];
            if (!item) return null;

            // Asymmetric 12-column spans
            const colSpan =
              index === 0
                ? 'col-span-full lg:col-span-7' // Large feature
                : index === 1
                ? 'col-span-full lg:col-span-5' // Tall silhouette
                : 'col-span-full sm:col-span-6 lg:col-span-6'; // Paired studies

            const ratio = index === 1 ? 'tall' : 'portrait';

            return (
              <div key={id} className={colSpan}>
                <ObjectCard id={id} product={item} ratio={ratio} />
              </div>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-12 pt-8 border-t border-hairline text-center lg:hidden">
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[var(--indigo)] hover:underline"
          >
            <span>Explore Complete Archive</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

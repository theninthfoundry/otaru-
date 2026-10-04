'use client';

import React, { useState } from 'react';
import { ArchiveFilters } from '@/components/archive/ArchiveFilters';
import { ArchiveGrid } from '@/components/archive/ArchiveGrid';
import { PRODUCT_CATALOG } from '@/lib/catalog';

const PAGE_SIZE = 12;
const CATEGORIES = ['All', 'Outerwear', 'Tops', 'Trousers', 'Accessories'];

export default function ArchivePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const allIds = Object.keys(PRODUCT_CATALOG);

  // Filter
  const filtered = activeCategory === 'All'
    ? allIds
    : allIds.filter((id) => PRODUCT_CATALOG[id]?.category === activeCategory);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    const prodA = PRODUCT_CATALOG[a];
    const prodB = PRODUCT_CATALOG[b];
    if (sort === 'price-asc') return (prodA?.price ?? 0) - (prodB?.price ?? 0);
    if (sort === 'price-desc') return (prodB?.price ?? 0) - (prodA?.price ?? 0);
    return Number(b) - Number(a); // Newest
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageIds = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const productList = pageIds
    .map((id) => ({
      id,
      product: PRODUCT_CATALOG[id]!,
    }))
    .filter((item) => Boolean(item.product));

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSort('newest');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pt-28 pb-24">
      <div className="wrap">
        
        {/* Header */}
        <div className="pb-10 border-b border-hairline">
          <span className="font-mono text-xs tracking-widest uppercase text-[var(--ink-muted)] block mb-2">
            Permanent Holdings
          </span>
          <h1 className="display-l text-[var(--ink)] mb-3">
            The archive.
          </h1>
          <p className="text-sm text-[var(--ink)]/65 max-w-[48ch] leading-relaxed">
            Every garment ever produced, catalogued in chronological order. When a run concludes, the listing remains as an archival record.
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-16 z-30 bg-[var(--paper)]/95 backdrop-blur-md py-4 border-b border-hairline">
          <ArchiveFilters
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setPage(1);
            }}
            sort={sort}
            onSelectSort={(s) => {
              setSort(s);
              setPage(1);
            }}
            resultCount={sorted.length}
          />
        </div>

        {/* 2-col mobile / 4-col desktop archive grid */}
        <ArchiveGrid
          products={productList}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          onResetFilters={handleResetFilters}
        />

      </div>
    </div>
  );
}

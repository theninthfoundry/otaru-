'use client';

import React, { useState } from 'react';
import { ArchiveFilters } from '@/components/archive/ArchiveFilters';
import { ArchiveGrid } from '@/components/archive/ArchiveGrid';
import { MilestonesGrid } from '@/components/archive/MilestonesGrid';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';
import { ArtBackgroundPlate } from '@/components/ui/ArtBackgroundPlate';
import { PRODUCT_CATALOG } from '@/lib/catalog';

const PAGE_SIZE = 8;
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

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Background Japanese Art Plates */}
      <ArtBackgroundPlate artName="cherry-blossom" position="top-right" opacity={0.19} maxWidth="820px" maxHeight="620px" />
      <ArtBackgroundPlate artName="great-wave" position="bottom-left" opacity={0.16} maxWidth="780px" maxHeight="560px" />

      {/* Background Sashiko Grid */}
      <SashikoGrid opacity={0.035} />

      {/* Vertical Japanese Calligraphy Watermarks */}
      <VerticalKanjiStamp text="永久保存録" subtext="PERMANENT RECORD INDEX" top="12%" right="2.5%" opacity={0.05} />
      <VerticalKanjiStamp text="物象目録" subtext="412 OBJECT CATALOG" top="55%" left="2%" opacity={0.045} />

      <div className="wrap page-wrap" style={{ paddingTop: '9rem', paddingBottom: '6rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
          <span className="eyebrow" style={{ margin: 0 }}>The archive</span>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            [ MMXXVI FULL INDEX ]
          </span>
        </div>
        <h1 className="section-title">412 objects. Nothing reprinted.</h1>
        <p className="section-lede">
          Every artifact we&apos;ve ever released, cataloged and searchable. When a run sells out, the listing stays — as a record, not an invitation.
        </p>

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

        <ArchiveGrid
          products={productList}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />

        <MilestonesGrid />
      </div>
    </div>
  );
}

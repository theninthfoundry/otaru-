import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProducts, getProductsByCollection } from '@/lib/shopify/queries/products';
import { getCollections } from '@/lib/shopify/queries/collections';
import { ArchiveFilters } from '@/components/archive/archive-filters';
import { ArchiveGrid, ArchiveGridSkeleton } from '@/components/archive/archive-grid';
import type { SortKey } from '@/lib/shopify/types';

export const metadata: Metadata = {
  title: 'Archive — Otaru',
  description:
    'The complete Otaru Archive. Every Artifact, every Chapter — past and present.',
};

interface ArchivePageProps {
  searchParams: Promise<{
    sort?: string;
    q?: string;
    collection?: string;
    inStock?: string;
    after?: string;
  }>;
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const { sort, q, collection, inStock, after } = await searchParams;

  // 1. Fetch all collections for the filter toolbar
  const collections = await getCollections(50).catch(() => []);

  // 2. Determine sort configuration
  const sortConfig = parseSortParam(sort);
  const isInStockOnly = inStock === 'true';

  // 3. Fetch products (either by specific collection or global query)
  let artifacts = [];
  let pageInfo = { hasNextPage: false, endCursor: null as string | null };

  if (collection) {
    const colData = await getProductsByCollection(collection, {
      first: 24,
      reverse: sortConfig.reverse,
      after,
    }).catch(() => null);

    if (colData) {
      artifacts = colData.artifacts;
      pageInfo = colData.pageInfo;
    }
  } else {
    const data = await getProducts({
      first: 24,
      sortKey: sortConfig.key,
      reverse: sortConfig.reverse,
      query: q,
      after,
    }).catch(() => ({
      artifacts: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    }));

    artifacts = data.artifacts;
    pageInfo = data.pageInfo;
  }

  // 4. In-stock client filtering fallback if requested
  if (isInStockOnly) {
    artifacts = artifacts.filter((item) => item.availableForSale);
  }

  return (
    <section id="archive" aria-label="Archive" className="py-12 md:py-16">
      <div className="grid-container space-y-8">
        {/* Archive Header */}
        <header className="space-y-2">
          <h1 className="text-display-md font-semibold tracking-tight text-otaru-ink">
            Archive
          </h1>
          <p className="text-body-md text-otaru-ink-muted max-w-xl">
            Every Artifact. Every Chapter. Crafted with intention, cataloged for eternity.
          </p>
        </header>

        {/* Filters Toolbar */}
        <ArchiveFilters
          collections={collections}
          currentCollection={collection}
          currentSort={sort ?? 'newest'}
          currentInStock={isInStockOnly}
          currentSearch={q ?? ''}
          totalCount={artifacts.length}
        />

        {/* Product Grid with Suspense Skeleton */}
        <Suspense fallback={<ArchiveGridSkeleton />}>
          <ArchiveGrid
            initialArtifacts={artifacts}
            hasNextPage={pageInfo.hasNextPage}
            endCursor={pageInfo.endCursor}
          />
        </Suspense>
      </div>
    </section>
  );
}

// ── Sort Parser Helper ──
function parseSortParam(sort?: string): { key: SortKey; reverse: boolean } {
  switch (sort) {
    case 'price-asc':
      return { key: 'PRICE', reverse: false };
    case 'price-desc':
      return { key: 'PRICE', reverse: true };
    case 'newest':
      return { key: 'CREATED_AT', reverse: true };
    case 'oldest':
      return { key: 'CREATED_AT', reverse: false };
    case 'best-selling':
      return { key: 'BEST_SELLING', reverse: false };
    default:
      return { key: 'CREATED_AT', reverse: true };
  }
}

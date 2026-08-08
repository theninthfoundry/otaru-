'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import type { RawCollection } from '@/lib/shopify/queries/collections';

interface ArchiveFiltersProps {
  collections: RawCollection[];
  currentCollection?: string;
  currentSort?: string;
  currentInStock?: boolean;
  currentSearch?: string;
  totalCount?: number;
}

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Selling', value: 'best-selling' },
];

export function ArchiveFilters({
  collections,
  currentCollection,
  currentSort = 'newest',
  currentInStock = false,
  currentSearch = '',
  totalCount,
}: ArchiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState(currentSearch);

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete('after');
      return params.toString();
    },
    [searchParams],
  );

  const handleCollectionChange = (handle: string | null) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString('collection', handle)}`, {
        scroll: false,
      });
    });
  };

  const handleSortChange = (sort: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString('sort', sort)}`, {
        scroll: false,
      });
    });
  };

  const handleInStockToggle = () => {
    const newValue = currentInStock ? null : 'true';
    startTransition(() => {
      router.push(`${pathname}?${createQueryString('inStock', newValue)}`, {
        scroll: false,
      });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString('q', searchQuery.trim() || null)}`,
        { scroll: false },
      );
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters =
    Boolean(currentCollection) ||
    Boolean(currentInStock) ||
    Boolean(currentSearch) ||
    currentSort !== 'newest';

  return (
    <div className="space-y-6 pb-6 border-b border-otaru-border/60">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artifacts..."
            className="w-full bg-otaru-cream/50 border border-otaru-border/80 rounded-full px-4 py-2 text-body-sm focus:outline-none focus:border-otaru-ink transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                startTransition(() => {
                  router.push(
                    `${pathname}?${createQueryString('q', null)}`,
                    { scroll: false },
                  );
                });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-caption text-otaru-ink-subtle hover:text-otaru-ink"
            >
              ✕
            </button>
          )}
        </form>

        {typeof totalCount === 'number' && (
          <p className="text-body-sm text-otaru-ink-muted shrink-0">
            Showing {totalCount} {totalCount === 1 ? 'Artifact' : 'Artifacts'}
            {isPending && ' (updating...)'}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleCollectionChange(null)}
            className={`px-3.5 py-1.5 rounded-full text-caption font-medium transition-colors shrink-0 ${
              !currentCollection
                ? 'bg-otaru-ink text-otaru-chalk'
                : 'bg-otaru-cream/80 text-otaru-ink-muted hover:text-otaru-ink hover:bg-otaru-cream'
            }`}
          >
            All Archive
          </button>
          {collections.map((col) => {
            const isActive = currentCollection === col.handle;
            return (
              <button
                key={col.id}
                onClick={() => handleCollectionChange(col.handle)}
                className={`px-3.5 py-1.5 rounded-full text-caption font-medium transition-colors shrink-0 ${
                  isActive
                    ? 'bg-otaru-ink text-otaru-chalk'
                    : 'bg-otaru-cream/80 text-otaru-ink-muted hover:text-otaru-ink hover:bg-otaru-cream'
                }`}
              >
                {col.title}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-caption text-otaru-ink cursor-pointer select-none">
            <input
              type="checkbox"
              checked={currentInStock}
              onChange={handleInStockToggle}
              className="accent-otaru-ink rounded-xs h-3.5 w-3.5 cursor-pointer"
            />
            In Stock Only
          </label>

          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-transparent text-caption font-medium text-otaru-ink border border-otaru-border rounded-md px-3 py-1.5 outline-none cursor-pointer focus:border-otaru-ink"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-caption text-otaru-ink-muted underline hover:text-otaru-ink transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

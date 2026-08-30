'use client';

import React from 'react';
import clsx from 'clsx';

interface ArchiveFiltersProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  sort: string;
  onSelectSort: (sort: string) => void;
  resultCount: number;
}

export function ArchiveFilters({
  categories,
  activeCategory,
  onSelectCategory,
  sort,
  onSelectSort,
  resultCount,
}: ArchiveFiltersProps) {
  return (
    <div>
      <div
        className="filter-row"
        role="group"
        aria-label="Filter artifacts"
        style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '2.5rem' }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              className={clsx('filter-chip', isActive && 'is-active')}
              onClick={() => onSelectCategory(cat)}
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--otaru-ink)' : 'var(--otaru-parchment-dim)',
                backgroundColor: isActive ? 'var(--otaru-parchment)' : 'transparent',
                border: isActive ? '1px solid var(--otaru-parchment)' : '1px solid var(--otaru-line-strong)',
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                transition: 'background-color var(--duration-fast), color var(--duration-fast), border-color var(--duration-fast)',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div
        className="arc-toolbar"
        style={{
          marginTop: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--otaru-line)',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--otaru-parchment-dim)' }}>
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </p>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--otaru-parchment-dim)',
          }}
        >
          Sort
          <select
            value={sort}
            onChange={(e) => onSelectSort(e.target.value)}
            style={{
              border: '1px solid var(--otaru-line-strong)',
              backgroundColor: 'var(--otaru-ink)',
              color: 'var(--otaru-parchment)',
              padding: '0.4rem 0.6rem',
              fontFamily: 'var(--font-body)',
              fontSize: '0.78rem',
              outline: 'none',
            }}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
      </div>
    </div>
  );
}

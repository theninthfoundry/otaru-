/**
 * OTARU — Shopify Constants
 *
 * Cache tags, sort options, collection handles,
 * and metafield definitions.
 */

import type { SortOption } from './types';

// ── Cache Tags (for ISR revalidation) ──
export const TAGS = {
  products: 'products',
  collections: 'collections',
  cart: 'cart',
  pages: 'pages',
} as const;

// ── Default Pagination ──
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 250;

// ── Sort Options ──
export const SORT_OPTIONS: SortOption[] = [
  { label: 'Relevance', key: 'RELEVANCE', reverse: false },
  { label: 'Newest', key: 'CREATED_AT', reverse: true },
  { label: 'Price: Low to High', key: 'PRICE', reverse: false },
  { label: 'Price: High to Low', key: 'PRICE', reverse: true },
  { label: 'Best Selling', key: 'BEST_SELLING', reverse: false },
];

// ── Shopify Collection Handles → Otaru Concepts ──
export const COLLECTION_HANDLES = {
  archive: 'all',  // The full Archive = Shopify's "all" collection
} as const;

// ── Metafield Definitions ──
// These must match the metafield definitions created in Shopify Admin
// (Settings → Custom Data → Products)
export const METAFIELD_KEYS = {
  artifactNumber: { namespace: 'otaru', key: 'artifact_number' },
  artifactName: { namespace: 'otaru', key: 'artifact_name' },
  chapterId: { namespace: 'otaru', key: 'chapter_id' },
  gsm: { namespace: 'otaru', key: 'gsm' },
  construction: { namespace: 'otaru', key: 'construction' },
  wash: { namespace: 'otaru', key: 'wash' },
  printTechnique: { namespace: 'otaru', key: 'print_technique' },
  symbolMeaning: { namespace: 'otaru', key: 'symbol_meaning' },
} as const;

/**
 * Build a GraphQL metafield identifier for Storefront API queries.
 */
export function metafieldIdentifier(
  key: keyof typeof METAFIELD_KEYS,
): { namespace: string; key: string } {
  return METAFIELD_KEYS[key];
}

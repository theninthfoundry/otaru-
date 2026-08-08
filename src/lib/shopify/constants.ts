import type { SortOption } from './types';

export const TAGS = {
  products: 'products',
  collections: 'collections',
  cart: 'cart',
  pages: 'pages',
} as const;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 250;

export const SORT_OPTIONS: SortOption[] = [
  { label: 'Relevance', key: 'RELEVANCE', reverse: false },
  { label: 'Newest', key: 'CREATED_AT', reverse: true },
  { label: 'Price: Low to High', key: 'PRICE', reverse: false },
  { label: 'Price: High to Low', key: 'PRICE', reverse: true },
  { label: 'Best Selling', key: 'BEST_SELLING', reverse: false },
];

export const COLLECTION_HANDLES = {
  archive: 'all',
} as const;

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

export function metafieldIdentifier(
  key: keyof typeof METAFIELD_KEYS,
): { namespace: string; key: string } {
  return METAFIELD_KEYS[key];
}

/**
 * Otaru Domain Vocabulary — Single Source of Truth
 *
 * Standard commerce concepts are renamed across every UI surface and CMS
 * schema to preserve brand prestige. NEVER hardcode these strings inline —
 * import from here so a vocabulary change propagates everywhere at once.
 *
 * Transactional utility terms (bag, checkout, size, price, order) stay
 * plain and explicit for conversion clarity — they are NOT remapped.
 */
export const VOCAB = {
  product: "Artifact",
  products: "Artifacts",
  collection: "Chapter",
  collections: "Chapters",
  catalog: "Archive",
  blog: "Journal",
  article: "Journal Entry",
  aboutUs: "Studio",
  newArrivals: "Latest Chapter",
  soldOut: "Archive Sold",
} as const;

export type VocabKey = keyof typeof VOCAB;

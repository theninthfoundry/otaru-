/**
 * OTARU — App Constants
 * Central configuration for the application.
 */

export const SITE_NAME = 'Otaru';
export const SITE_DESCRIPTION =
  'Garments worth keeping. Craftsmanship outlasts trends.';

/** Otaru vocabulary (§1.11) — editorial terms mapped from common commerce */
export const VOCABULARY = {
  collection: 'Chapter',
  product: 'Artifact',
  newArrivals: 'Latest Chapter',
  aboutUs: 'Studio',
  catalog: 'Archive',
  // These stay in plain commerce language (§1.11):
  // bag, checkout, size, price — clarity over poetry.
} as const;

/** Navigation items */
export const NAV_ITEMS = [
  { label: 'Archive', href: '/archive' },
  { label: 'Journal', href: '/journal' },
  { label: 'Studio', href: '/studio' },
] as const;

/** Social links */
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/otaru',
  // Add more as they're created
} as const;

/** Material library categories (§1.5) */
export const MATERIAL_CATEGORIES = {
  baseFabric: [
    '420 GSM Cotton',
    'French Terry',
    'Loopback',
    'Heavy Jersey',
  ],
  washDye: [
    'Silicone Wash',
    'Reactive Dye',
    'Garment Dye',
    'Pigment Dye',
  ],
  graphicTechnique: [
    'Embroidery',
    'HD Puff Print',
    'Chain Stitch',
    'Appliqué',
    'Laser Etching',
  ],
} as const;

/** Iconography symbols (§1.8) — the seven-chapter arc */
export const CHAPTER_SYMBOLS = [
  'Origin',
  'Growth',
  'Decay',
  'Reflection',
  'Memory',
  'Motion',
  'Silence',
] as const;

/** Performance budgets (§3.6) */
export const PERFORMANCE_BUDGETS = {
  lcp: 2500,   // ms
  cls: 0.1,
  inp: 200,    // ms
} as const;

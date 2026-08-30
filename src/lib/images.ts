/**
 * Otaru Image Registry
 *
 * Map your local image files (from /public/images/...) or external URLs here.
 * If left empty (''), the UI gracefully displays clean minimalist architectural placeholders.
 */

export interface ProductImages {
  primary?: string;
  secondary?: string;
  detail?: string;
  alt: string;
}

export const PRODUCT_IMAGES: Record<string, ProductImages> = {
  // New Drops
  '041': {
    primary: '', // e.g. '/images/products/041-primary.jpg'
    secondary: '',
    detail: '',
    alt: 'Artifact 041 — Yama Field Jacket',
  },
  '042': {
    primary: '', // e.g. '/images/products/042-primary.jpg'
    secondary: '',
    detail: '',
    alt: 'Artifact 042 — Kiryū Wrap Trouser',
  },
  '043': {
    primary: '', // e.g. '/images/products/043-primary.jpg'
    secondary: '',
    detail: '',
    alt: 'Artifact 043 — Biratori Overshirt',
  },
  '044': {
    primary: '', // e.g. '/images/products/044-primary.jpg'
    secondary: '',
    detail: '',
    alt: 'Artifact 044 — Ōmi Hemp Tote',
  },

  // Archive Pieces
  '038': {
    primary: '', // e.g. '/images/products/038-primary.jpg'
    secondary: '',
    detail: '',
    alt: 'Artifact 038 — Otaru Deck Coat',
  },
  '037': {
    primary: '',
    secondary: '',
    detail: '',
    alt: 'Artifact 037 — Tsukiji Apron Shirt',
  },
  '036': {
    primary: '',
    secondary: '',
    detail: '',
    alt: 'Artifact 036 — Hakodate Watch Cap',
  },
  '035': {
    primary: '',
    secondary: '',
    detail: '',
    alt: 'Artifact 035 — Nemuro Wide Trouser',
  },
  '034': {
    primary: '',
    secondary: '',
    detail: '',
    alt: 'Artifact 034 — Rishiri Rain Shell',
  },
  '033': {
    primary: '',
    secondary: '',
    detail: '',
    alt: 'Artifact 033 — Wakkanai Muffler',
  },
};

export const CHAPTER_IMAGES: Record<string, string> = {
  'Chapter I': '',   // e.g. '/images/chapters/chapter-1.jpg'
  'Chapter II': '',  // e.g. '/images/chapters/chapter-2.jpg'
  'Chapter III': '', // e.g. '/images/chapters/chapter-3.jpg'
  'Chapter 0': '',   // e.g. '/images/chapters/chapter-0.jpg'
};

export const MATERIAL_SWATCHES: Record<string, string> = {
  'Indigo cotton twill': '', // e.g. '/images/swatches/indigo.jpg'
  'Raw hemp canvas': '',
  'Boiled wool': '',
  'Washed silk': '',
};

export const STUDIO_IMAGES = {
  main: '',   // e.g. '/images/studio/warehouse.jpg'
  harbor: '', // e.g. '/images/studio/harbor.jpg'
  loom: '',   // e.g. '/images/studio/loom.jpg'
};

export const JOURNAL_IMAGES: Record<string, string> = {
  'archive-of-a-life': '', // e.g. '/images/journal/post-1.jpg'
  'on-repair': '',
  'what-remains': '',
  'on-imperfection': '',
  'boro-loom': '',
  'on-boro': '',
  'a-week-in-omi': '',
  'no-sample-sales': '',
  'dyeing-in-winter': '',
};

export const HERO_SLIDES: Array<{
  id: number;
  image?: string;
  tag: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  secondaryCta: string;
  secondaryLink: string;
  badge: string;
}> = [
  {
    id: 1,
    image: '', // e.g. '/images/hero/hero-1.jpg'
    tag: 'CAMPAIGN 01 / 03 — MMXXVI',
    eyebrow: 'Otaru / Living Image Archive',
    title: 'The mountain remembers.',
    subtitle: 'A world of water, timber, cloth, and the objects that pass through it.',
    ctaText: 'Enter the Archive',
    ctaLink: '/archive',
    secondaryCta: 'Explore Chapters',
    secondaryLink: '/chapters',
    badge: 'Origin: Hokkaido · Archive MMXXVI',
  },
];

import type { SanityChapter, SanityJournalEntry, SanitySiteSettings } from './types';

export const MOCK_ACTIVE_CHAPTER: SanityChapter = {
  _id: 'chap-02',
  title: 'Kinetic Architecture',
  slug: 'chapter-02-kinetic-architecture',
  chapterNumber: 2,
  status: 'active',
  tagline: 'Structure in Motion & Permanent Intention',
  story: 'Explorations into heavy-density Japanese raw textiles cut with architectural precision.',
  coverImage: {
    asset: {
      _ref: 'image-mock-chap-02',
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
    },
  },
  shopifyCollectionHandle: 'chapter-02',
  productionYear: 'MMXXVI',
  totalProduced: '150 Units',
};

export const MOCK_CHAPTERS: SanityChapter[] = [
  MOCK_ACTIVE_CHAPTER,
  {
    _id: 'chap-01',
    title: 'Silent Resonance',
    slug: 'chapter-01-silent-resonance',
    chapterNumber: 1,
    status: 'archived',
    tagline: 'The Inaugural Publication',
    story: 'Initial studies in raw weight, unbleached cotton, and concealed pocketing.',
    coverImage: {
      asset: {
        _ref: 'image-mock-chap-01',
        url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=85',
      },
    },
    shopifyCollectionHandle: 'chapter-01',
    productionYear: 'MMXXIV',
    totalProduced: '100 Units',
  },
];

export const MOCK_JOURNAL_ENTRIES: SanityJournalEntry[] = [
  {
    _id: 'journal-01',
    title: 'Architectural Cuts & The Permanence of Raw Selvage',
    slug: 'architectural-cuts-permanence-raw-selvage',
    excerpt: 'An inquiry into Kuroki Mills weaving techniques and why unwashed denim ages like stone sculpture.',
    publishedAt: '2026-07-20T00:00:00Z',
    author: 'Otaru Design Atelier',
    coverImage: {
      asset: {
        _ref: 'image-mock-journal-01',
        url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=85',
      },
    },
  },
  {
    _id: 'journal-02',
    title: 'The Philosophy of Numbered Chapters vs Seasonal Drops',
    slug: 'philosophy-numbered-chapters-vs-seasonal-drops',
    excerpt: 'Why fashion calendars are obsolete and why garments worth keeping deserve permanent cataloging.',
    publishedAt: '2026-06-15T00:00:00Z',
    author: 'Curator Notes',
    coverImage: {
      asset: {
        _ref: 'image-mock-journal-02',
        url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=85',
      },
    },
  },
];

export const MOCK_SITE_SETTINGS: SanitySiteSettings = {
  siteName: 'Otaru Design House',
  siteDescription: 'Garments worth keeping.',
  newsletterHeadline: 'Join the Otaru Registry',
  newsletterSubtext: 'Receive private release dates, chapter manifestos, and archive notifications directly.',
};

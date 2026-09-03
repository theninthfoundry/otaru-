/**
 * OTARU EDITORIAL CMS DOMAIN SERVICE
 * Decouples narrative content (Chapters, Essays, Maker Profiles) from React code.
 * Enables editors and craftspeople to publish stories and studio notes dynamically.
 */

export type EditorialStatus = 'DRAFT' | 'PREVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface EditorialChapter {
  id: string;
  numeral: string;       // "CHAPTER 01"
  kanjiTitle: string;    // "京都・夜"
  title: string;         // "Kyoto Nights"
  season: string;        // "AUTUMN / WINTER MMXXVI"
  slug: string;          // "kyoto-nights"
  excerpt: string;
  narrativeBody: string[];
  makerNotes: string;
  associatedGarmentIds: string[];
  status: EditorialStatus;
  publishedAt: string;
}

export interface EditorialEssay {
  id: string;
  slug: string;          // "mechanics-of-sukumo"
  title: string;         // "The Mechanics of Sukumo Fermentation"
  category: string;      // "Craft Notes"
  kanjiCategory: string; // "染色"
  author: string;        // "T. Murata (Master Dyer)"
  date: string;          // "03 September MMXXVI"
  readTimeMinutes: number;
  pullQuote: string;
  contentParagraphs: string[];
  status: EditorialStatus;
  publishedAt: string;
}

export interface MakerProfile {
  id: string;
  name: string;          // "Kenji Takahashi"
  kanjiName: string;     // "高橋 健二"
  role: string;          // "Master Pattern Cutter"
  atelierLocation: string; // "Canal Warehouse No. 4, Otaru"
  experienceYears: number; // 24
  discipline: string;    // "Bespoke tailoring, selvage alignment, Sashiko reinforcement"
  quote: string;
  bio: string;
}

// Authoritative Canonical Editorial Store
export const CANONICAL_CHAPTERS: EditorialChapter[] = [
  {
    id: 'ch-01',
    numeral: 'CHAPTER 01',
    kanjiTitle: '京都・夜',
    title: 'Kyoto Nights',
    season: 'AUTUMN / WINTER MMXXVI',
    slug: 'kyoto-nights',
    excerpt: 'Deep indigo fermented with wood ash and sake over 100 days. A study in moonlight on aged cedar.',
    narrativeBody: [
      'In the northern harbor of Otaru, light behaves differently in autumn. It slants low across the stone warehouses, turning canal water the color of weathered slate.',
      'Chapter 01 was developed around our Sukumo vats in Tokushima and cut in our stone warehouse at Otaru. The cloth is 14.5oz natural botanical twill, woven on a 1968 Toyoda G3 shuttle loom that runs at one-fifth the speed of modern machinery.',
      'The result is not perfection in the industrial sense. It is cloth that remembers the human hands that guided the shuttle.',
    ],
    makerNotes: 'Cut with 2.5cm extra selvage allowance to allow for lifetime bespoke alteration.',
    associatedGarmentIds: ['041', '042'],
    status: 'PUBLISHED',
    publishedAt: '2026-08-15T00:00:00.000Z',
  },
  {
    id: 'ch-07',
    numeral: 'CHAPTER 07',
    kanjiTitle: '雨音・記憶',
    title: 'Rain Study',
    season: 'PERMANENT ARCHIVE MMXXVI',
    slug: 'rain-study',
    excerpt: 'Water drawn from the Otaru canal. Natural wax barrier cotton tailored for North Sea squalls.',
    narrativeBody: [
      'Rain in Hokkaido does not fall straight. It is swept sideways by squalls coming across the Sea of Japan.',
      'To build a garment for this climate requires materials that breathe while repelling coastal mist. We chose organic long-staple cotton dipped in fermented persimmon tannin (kakishibu) and sealed with unrefined beeswax from local beekeepers.',
      'When you wear it in the rain, the fabric stiffens slightly, creating a microclimate of warmth against your body.',
    ],
    makerNotes: 'Inspected under natural morning light to verify wax density across the upper shoulders.',
    associatedGarmentIds: ['038', '043'],
    status: 'PUBLISHED',
    publishedAt: '2026-09-01T00:00:00.000Z',
  },
];

export const CANONICAL_ESSAYS: EditorialEssay[] = [
  {
    id: 'essay-01',
    slug: 'mechanics-of-sukumo',
    title: 'The Mechanics of Sukumo Fermentation',
    category: 'Material Study',
    kanjiCategory: '藍染',
    author: 'T. Murata (Master Dyer)',
    date: '03 September MMXXVI',
    readTimeMinutes: 6,
    pullQuote: 'Indigo is not a chemical solution; it is a colony of living microorganisms that require patience, temperature, and feeding.',
    contentParagraphs: [
      'Every morning at 05:30, Master Dyer Murata checks the surface of our fermentation vats. If a purple-bronze foam has formed—what Japanese dyers call the "indigo flower" (ai-no-hana)—the vat is healthy.',
      'Unlike synthetic petroleum dyes that coat the outer surface of cotton fibers with rigid pigment, living indigo penetrates deep into the porous core of the yarn. As the garment is worn over years, the high-friction points gradually reveal the natural ecru cotton beneath, creating an autobiography in blue.',
      'We use no harsh caustic soda or chemical hydrosulfite. The reduction is achieved solely with hardwood ash lye, wheat bran, and limestone.',
    ],
    status: 'PUBLISHED',
    publishedAt: '2026-09-02T00:00:00.000Z',
  },
  {
    id: 'essay-02',
    slug: 'toyoda-g3-rhythm',
    title: 'Toyoda G3: The Rhythm of Low Tension',
    category: 'Weaving Machinery',
    kanjiCategory: '製織',
    author: 'K. Sato (Master Weaver)',
    date: '28 August MMXXVI',
    readTimeMinutes: 5,
    pullQuote: 'Modern high-speed air-jet looms produce cloth that is flat and lifeless. The G3 operates with the quiet imperfection of a hand loom.',
    contentParagraphs: [
      'The Toyoda G3 automatic shuttle loom was manufactured in 1968. It requires constant mechanical tuning—a drop of cam oil here, a tension adjustment to the leather brake strap there.',
      'Because the shuttle carries the weft yarn back and forth at low velocity, the warp threads are never overstretched. The resulting cloth has a subtle, irregular texture known as "slub"—microscopic air pockets that make the garment remarkably soft yet structurally indestructible.',
    ],
    status: 'PUBLISHED',
    publishedAt: '2026-08-28T00:00:00.000Z',
  },
];

export const CANONICAL_MAKERS: MakerProfile[] = [
  {
    id: 'maker-01',
    name: 'Kenji Takahashi',
    kanjiName: '高橋 健二',
    role: 'Master Pattern Cutter',
    atelierLocation: 'Canal Warehouse No. 4, Otaru',
    experienceYears: 28,
    discipline: 'Bespoke tailoring, zero-waste cutting, selvedge alignment',
    quote: 'When cutting cloth that took three months to weave, every millimeter of the blade must be considered.',
    bio: 'Apprenticed in Ginza before moving to Hokkaido in 2004 to help establish the Otaru stone harbor workshop.',
  },
  {
    id: 'maker-02',
    name: 'Takeshi Murata',
    kanjiName: '村田 武',
    role: 'Master Botanical Dyer',
    atelierLocation: 'Tokushima Sukumo Vats & Otaru',
    experienceYears: 32,
    discipline: 'Fermented Hon-Ai sukumo indigo, persimmon tannin, sumi ink dip',
    quote: 'The water of the Otaru canal has the precise mineral balance needed to set fermented indigo.',
    bio: 'Third-generation indigo farmer and dyer from Tokushima, maintaining six living vats for Otaru archival runs.',
  },
];

export class EditorialService {
  static getPublishedChapters(): EditorialChapter[] {
    return CANONICAL_CHAPTERS.filter((c) => c.status === 'PUBLISHED');
  }

  static getChapterBySlug(slug: string): EditorialChapter | undefined {
    return CANONICAL_CHAPTERS.find((c) => c.slug === slug);
  }

  static getPublishedEssays(): EditorialEssay[] {
    return CANONICAL_ESSAYS.filter((e) => e.status === 'PUBLISHED');
  }

  static getEssayBySlug(slug: string): EditorialEssay | undefined {
    return CANONICAL_ESSAYS.find((e) => e.slug === slug);
  }

  static getMakers(): MakerProfile[] {
    return CANONICAL_MAKERS;
  }
}

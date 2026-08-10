/** Sanity v3 content types — Chapter, Journal, Studio, Symbol, MaterialSpec. */
export interface SanityImageRef {
  asset: { _ref: string; _type: "reference" };
  alt?: string;
}

export interface Chapter {
  _id: string;
  _type: "chapter";
  title: string;
  slug: { current: string };
  number: number;
  curatorNote: string;
  heroImage: SanityImageRef;
  moodboard: SanityImageRef[];
  artifactHandles: string[];
  publishedAt: string;
}

export interface JournalEntry {
  _id: string;
  _type: "journal";
  title: string;
  slug: { current: string };
  excerpt: string;
  coverImage: SanityImageRef;
  author: { name: string; avatar?: SanityImageRef };
  body: unknown[]; // Portable Text blocks
  publishedAt: string;
  readingTimeMinutes: number;
}

export interface MaterialSpec {
  _id: string;
  _type: "materialSpec";
  name: string;
  composition: string;
  origin: string;
  careInstructions: string[];
}

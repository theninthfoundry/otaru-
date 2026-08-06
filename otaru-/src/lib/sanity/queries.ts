/**
 * OTARU — Sanity GROQ Queries with Resilient Mock Fallbacks
 */

import { sanityFetch } from './client';
import {
  MOCK_ACTIVE_CHAPTER,
  MOCK_CHAPTERS,
  MOCK_JOURNAL_ENTRIES,
  MOCK_SITE_SETTINGS,
} from './mocks';
import type {
  SanityChapter,
  SanityJournalEntry,
  SanityStudioPage,
  SanitySymbol,
  SanitySiteSettings,
} from './types';

// ── Chapter Queries ──

const CHAPTER_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  chapterNumber,
  status,
  tagline,
  story,
  coverImage,
  symbol->{name, order, meaning, svgMarkup},
  shopifyCollectionHandle,
  productionYear,
  totalProduced,
  seo
`;

export async function getAllChapters(): Promise<SanityChapter[]> {
  try {
    const chapters = await sanityFetch<SanityChapter[]>(
      /* groq */ `*[_type == "chapter"] | order(chapterNumber asc) { ${CHAPTER_FIELDS} }`,
      {},
      ['chapters'],
    );
    if (chapters && chapters.length > 0) return chapters;
  } catch (error) {
    console.warn('[Sanity API] Falling back to mock chapters:', (error as Error).message);
  }
  return MOCK_CHAPTERS;
}

export async function getActiveChapter(): Promise<SanityChapter | null> {
  try {
    const chapter = await sanityFetch<SanityChapter | null>(
      /* groq */ `*[_type == "chapter" && status == "active"][0] { ${CHAPTER_FIELDS} }`,
      {},
      ['chapters'],
    );
    if (chapter) return chapter;
  } catch (error) {
    console.warn('[Sanity API] Falling back to mock active chapter:', (error as Error).message);
  }
  return MOCK_ACTIVE_CHAPTER;
}

export async function getChapterBySlug(
  slug: string,
): Promise<SanityChapter | null> {
  try {
    const chapter = await sanityFetch<SanityChapter | null>(
      /* groq */ `*[_type == "chapter" && slug.current == $slug][0] { ${CHAPTER_FIELDS} }`,
      { slug },
      ['chapters'],
    );
    if (chapter) return chapter;
  } catch (error) {
    console.warn(`[Sanity API] Falling back to mock chapter for slug "${slug}":`, (error as Error).message);
  }
  return MOCK_CHAPTERS.find((c) => c.slug === slug) ?? MOCK_ACTIVE_CHAPTER;
}

export async function getChapterSlugs(): Promise<{ slug: string }[]> {
  try {
    const slugs = await sanityFetch<{ slug: string }[]>(
      /* groq */ `*[_type == "chapter"] { "slug": slug.current }`,
      {},
      ['chapters'],
    );
    if (slugs && slugs.length > 0) return slugs;
  } catch (error) {
    console.warn('[Sanity API] Falling back to mock chapter slugs:', (error as Error).message);
  }
  return MOCK_CHAPTERS.map((c) => ({ slug: c.slug }));
}

// ── Journal Queries ──

const JOURNAL_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  body,
  coverImage,
  chapter->{title, chapterNumber, "slug": slug.current},
  author,
  publishedAt,
  seo
`;

export async function getJournalEntries(
  limit = 20,
): Promise<SanityJournalEntry[]> {
  try {
    const entries = await sanityFetch<SanityJournalEntry[]>(
      /* groq */ `*[_type == "journal"] | order(publishedAt desc)[0...$limit] { ${JOURNAL_FIELDS} }`,
      { limit },
      ['journal'],
    );
    if (entries && entries.length > 0) return entries;
  } catch (error) {
    console.warn('[Sanity API] Falling back to mock journal entries:', (error as Error).message);
  }
  return MOCK_JOURNAL_ENTRIES.slice(0, limit);
}

export async function getJournalBySlug(
  slug: string,
): Promise<SanityJournalEntry | null> {
  try {
    const entry = await sanityFetch<SanityJournalEntry | null>(
      /* groq */ `*[_type == "journal" && slug.current == $slug][0] { ${JOURNAL_FIELDS} }`,
      { slug },
      ['journal'],
    );
    if (entry) return entry;
  } catch (error) {
    console.warn(`[Sanity API] Falling back to mock journal entry for slug "${slug}":`, (error as Error).message);
  }
  return MOCK_JOURNAL_ENTRIES.find((j) => j.slug === slug) ?? MOCK_JOURNAL_ENTRIES[0] ?? null;
}

export async function getJournalSlugs(): Promise<{ slug: string }[]> {
  try {
    const slugs = await sanityFetch<{ slug: string }[]>(
      /* groq */ `*[_type == "journal"] { "slug": slug.current }`,
      {},
      ['journal'],
    );
    if (slugs && slugs.length > 0) return slugs;
  } catch (error) {
    console.warn('[Sanity API] Falling back to mock journal slugs:', (error as Error).message);
  }
  return MOCK_JOURNAL_ENTRIES.map((j) => ({ slug: j.slug }));
}

// ── Studio Page ──

export async function getStudioContent(): Promise<SanityStudioPage | null> {
  try {
    return await sanityFetch<SanityStudioPage | null>(
      /* groq */ `*[_type == "studioPage"][0] {
        headline,
        introduction,
        philosophySections[] {
          title,
          body,
          image
        },
        designPrinciples[] {
          name,
          description
        },
        symbolLanguage,
        seo
      }`,
      {},
      ['studio'],
    );
  } catch (error) {
    console.warn('[Sanity API] Falling back to null studio content:', (error as Error).message);
    return null;
  }
}

// ── Symbols ──

export async function getSymbols(): Promise<SanitySymbol[]> {
  try {
    const symbols = await sanityFetch<SanitySymbol[]>(
      /* groq */ `*[_type == "symbol"] | order(order asc) {
        _id,
        name,
        order,
        meaning,
        svgMarkup,
        image
      }`,
      {},
      ['symbols'],
    );
    if (symbols) return symbols;
  } catch (error) {
    console.warn('[Sanity API] Falling back to empty symbols:', (error as Error).message);
  }
  return [];
}

// ── Site Settings ──

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  try {
    const settings = await sanityFetch<SanitySiteSettings | null>(
      /* groq */ `*[_type == "siteSettings"][0] {
        siteName,
        siteDescription,
        ogImage,
        announcement,
        socialLinks,
        footerText,
        newsletterHeadline,
        newsletterSubtext
      }`,
      {},
      ['siteSettings'],
    );
    if (settings) return settings;
  } catch (error) {
    console.warn('[Sanity API] Falling back to mock site settings:', (error as Error).message);
  }
  return MOCK_SITE_SETTINGS;
}

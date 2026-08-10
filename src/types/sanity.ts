/**
 * Otaru — Sanity CMS Domain Types
 * Re-exports from @/lib/sanity/types with aliases for legacy references
 */
import type { SanityChapter, SanityJournalEntry } from '@/lib/sanity/types';

export * from '@/lib/sanity/types';

// Backward compatibility aliases
export type Chapter = SanityChapter;
export type JournalEntry = SanityJournalEntry;

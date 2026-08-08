/**
 * Sanity v3 content client (GROQ queries against the Content Lake).
 * Falls back to mock editorial content when NEXT_PUBLIC_SANITY_PROJECT_ID
 * is unset, mirroring the Shopify client's local-dev-friendly pattern.
 */
import { createClient } from "next-sanity";
import type { Chapter, JournalEntry } from "@/types/sanity";
import { MOCK_CHAPTERS, MOCK_JOURNAL } from "./mock-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const isConfigured = Boolean(projectId);

export const sanityClient = isConfigured
  ? createClient({
      projectId: projectId as string,
      dataset,
      apiVersion: "2025-01-01",
      useCdn: true,
    })
  : null;

export async function getChapters(): Promise<Chapter[]> {
  if (!sanityClient) return MOCK_CHAPTERS;
  return sanityClient.fetch(`*[_type == "chapter"] | order(number desc)`);
}

export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  if (!sanityClient) return MOCK_CHAPTERS.find((c) => c.slug.current === slug) ?? null;
  return sanityClient.fetch(`*[_type == "chapter" && slug.current == $slug][0]`, { slug });
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  if (!sanityClient) return MOCK_JOURNAL;
  return sanityClient.fetch(`*[_type == "journal"] | order(publishedAt desc)`);
}

export async function getJournalEntryBySlug(slug: string): Promise<JournalEntry | null> {
  if (!sanityClient) return MOCK_JOURNAL.find((j) => j.slug.current === slug) ?? null;
  return sanityClient.fetch(`*[_type == "journal" && slug.current == $slug][0]`, { slug });
}

export const sanityConfigured = isConfigured;

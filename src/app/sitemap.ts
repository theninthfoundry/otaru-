import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/shopify/queries/products';
import { getChapterSlugs, getJournalSlugs } from '@/lib/sanity/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://otaru.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/archive`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/chapter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/journal`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/drops`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/verify`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/membership`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/studio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/track-order`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/returns`, changeFrequency: 'yearly', priority: 0.4 },
  ];

  const artifactPages: MetadataRoute.Sitemap = [];
  try {
    const { artifacts } = await getProducts({ first: 250 });
    for (const artifact of artifacts) {
      artifactPages.push({
        url: `${BASE_URL}/artifact/${artifact.handle}`,
        lastModified: artifact.updatedAt ? new Date(artifact.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  } catch {
    // Graceful fallback if Shopify not connected
  }

  const chapterPages: MetadataRoute.Sitemap = [];
  try {
    const chapters = await getChapterSlugs();
    for (const chapter of chapters) {
      chapterPages.push({
        url: `${BASE_URL}/chapter/${chapter.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch {
    // Graceful fallback if Sanity not connected
  }

  const journalPages: MetadataRoute.Sitemap = [];
  try {
    const entries = await getJournalSlugs();
    for (const entry of entries) {
      journalPages.push({
        url: `${BASE_URL}/journal/${entry.slug}`,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch {
    // Graceful fallback if Sanity not connected
  }

  return [
    ...staticPages,
    ...artifactPages,
    ...chapterPages,
    ...journalPages,
  ];
}

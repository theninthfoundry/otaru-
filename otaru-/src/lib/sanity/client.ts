/**
 * OTARU — Sanity Client
 *
 * GROQ query client using next-sanity.
 * Image URL builder.
 */

import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityConfig } from '@/sanity/env';

export const sanityClient = createClient({
  projectId: sanityConfig.projectId || 'otaru-studio',
  dataset: sanityConfig.dataset || 'production',
  apiVersion: sanityConfig.apiVersion,
  useCdn: sanityConfig.useCdn,
  // Token is only used for server-side operations (previews, mutations)
  ...(sanityConfig.token ? { token: sanityConfig.token } : {}),
});

// ── Image URL Builder ──
const builder = imageUrlBuilder(sanityClient);

/**
 * Generate optimized image URLs from Sanity image references.
 */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Get a full URL string for a Sanity image with default quality.
 */
export function getImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number,
): string {
  if (!source) return '';
  try {
    let img = builder.image(source).auto('format').quality(80);
    if (width) img = img.width(width);
    if (height) img = img.height(height);
    return img.url();
  } catch {
    return '';
  }
}

/**
 * Execute a GROQ query with caching support.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags?: string[],
): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate: 60, // ISR: revalidate every 60 seconds
      ...(tags ? { tags } : {}),
    },
  });
}

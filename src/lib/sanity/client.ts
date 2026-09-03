import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { sanityConfig } from '@/sanity/env';

export const sanityClient = createClient({
  projectId: sanityConfig.projectId || 'otaru-studio',
  dataset: sanityConfig.dataset || 'production',
  apiVersion: sanityConfig.apiVersion,
  useCdn: sanityConfig.useCdn,
  ...(sanityConfig.token ? { token: sanityConfig.token } : {}),
});

const builder = imageUrlBuilder(sanityClient);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}

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

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags?: string[],
): Promise<T> {
  const isTest = process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
  if (
    isTest ||
    (!sanityConfig.token &&
      (!sanityConfig.projectId ||
        sanityConfig.projectId === 'otaru-studio' ||
        sanityConfig.projectId === 'otaru-project'))
  ) {
    throw new Error('Sanity credentials not configured in local test environment.');
  }
  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate: 60,
      ...(tags ? { tags } : {}),
    },
  });
}

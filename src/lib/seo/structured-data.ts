import type { Artifact } from '@/lib/shopify/types';
import { absoluteUrl } from '@/lib/utils';
import { SITE_NAME } from '@/lib/constants';

export function generateProductJsonLd(artifact: Artifact) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: artifact.artifactName
      ? `Artifact ${artifact.artifactNumber} — "${artifact.artifactName}"`
      : artifact.title,
    description: artifact.description,
    image: artifact.images.map((img) => img.url),
    url: absoluteUrl(`/artifact/${artifact.handle}`),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: artifact.price.amount,
      priceCurrency: artifact.price.currencyCode,
      availability: artifact.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
      url: absoluteUrl(`/artifact/${artifact.handle}`),
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    ...(artifact.gsm || artifact.construction
      ? {
          material: [artifact.gsm, artifact.construction]
            .filter(Boolean)
            .join(', '),
        }
      : {}),
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: absoluteUrl('/'),
    description:
      'Garments worth keeping. Craftsmanship outlasts trends.',
    sameAs: [
      'https://instagram.com/otaru',
    ],
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function generateArticleJsonLd(article: {
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  publishedAt: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    url: absoluteUrl(`/journal/${article.slug}`),
    datePublished: article.publishedAt,
    author: article.author
      ? { '@type': 'Person', name: article.author }
      : { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    ...(article.imageUrl ? { image: article.imageUrl } : {}),
  };
}

export function generateCollectionJsonLd(collection: {
  name: string;
  description: string;
  url: string;
  itemCount: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description,
    url: absoluteUrl(collection.url),
    numberOfItems: collection.itemCount,
  };
}

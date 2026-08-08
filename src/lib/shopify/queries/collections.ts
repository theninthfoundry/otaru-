import { shopifyFetch } from '../client';
import { TAGS } from '../constants';
import { SEO_FRAGMENT, IMAGE_FRAGMENT } from './metafields';

const COLLECTION_FRAGMENT = /* GraphQL */ `
  fragment CollectionFields on Collection {
    id
    handle
    title
    description
    updatedAt
    seo {
      ...SeoFields
    }
    image {
      ...ImageFields
    }
  }
  ${SEO_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;

const GET_COLLECTIONS = /* GraphQL */ `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          ...CollectionFields
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
`;

const GET_COLLECTION_BY_HANDLE = /* GraphQL */ `
  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      ...CollectionFields
    }
  }
  ${COLLECTION_FRAGMENT}
`;

export interface RawCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  updatedAt: string;
  seo: { title: string | null; description: string | null };
  image: { url: string; altText: string | null; width: number; height: number } | null;
}

const MOCK_COLLECTIONS: RawCollection[] = [
  {
    id: 'gid://shopify/Collection/002',
    handle: 'chapter-02',
    title: 'Chapter 02 — Kinetic Architecture',
    description: 'Explorations in heavy-density Japanese raw textiles.',
    updatedAt: '2026-02-01T00:00:00Z',
    seo: { title: 'Chapter 02 | Otaru', description: 'Kinetic Architecture' },
    image: {
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      altText: 'Chapter 02',
      width: 1200,
      height: 800,
    },
  },
];

export async function getCollections(first = 20): Promise<RawCollection[]> {
  try {
    const data = await shopifyFetch<{
      collections: { edges: { node: RawCollection }[] };
    }>({
      query: GET_COLLECTIONS,
      variables: { first },
      tags: [TAGS.collections],
    });

    return data.collections.edges.map((e) => e.node);
  } catch (error) {
    console.warn('[Shopify API] Falling back to mock collections:', (error as Error).message);
    return MOCK_COLLECTIONS.slice(0, first);
  }
}

export async function getCollectionByHandle(
  handle: string,
): Promise<RawCollection | null> {
  try {
    const data = await shopifyFetch<{
      collection: RawCollection | null;
    }>({
      query: GET_COLLECTION_BY_HANDLE,
      variables: { handle },
      tags: [TAGS.collections],
    });

    return data.collection;
  } catch (error) {
    console.warn(`[Shopify API] Falling back to mock collection for handle "${handle}":`, (error as Error).message);
    return MOCK_COLLECTIONS.find((c) => c.handle === handle) ?? MOCK_COLLECTIONS[0] ?? null;
  }
}

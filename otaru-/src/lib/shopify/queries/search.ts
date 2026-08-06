/**
 * OTARU — Shopify Search Query with Resilient Mock Fallbacks
 */

import { shopifyFetch } from '../client';
import { TAGS } from '../constants';
import { reshapeProducts } from '../mappers';
import { MOCK_ARTIFACTS } from '../mocks';
import type { Artifact } from '../types';
import {
  METAFIELD_FRAGMENT,
  IMAGE_FRAGMENT,
  VARIANT_FRAGMENT,
  SEO_FRAGMENT,
  MONEY_FRAGMENT,
} from './metafields';

const SEARCH_PRODUCTS = /* GraphQL */ `
  query SearchProducts($query: String!, $first: Int!, $after: String) {
    search(query: $query, first: $first, after: $after, types: [PRODUCT]) {
      edges {
        node {
          ... on Product {
            id
            handle
            title
            description
            descriptionHtml
            availableForSale
            totalInventory
            tags
            createdAt
            updatedAt
            seo {
              ...SeoFields
            }
            priceRange {
              minVariantPrice {
                ...MoneyFields
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                ...MoneyFields
              }
            }
            featuredImage {
              ...ImageFields
            }
            images(first: 20) {
              edges {
                node {
                  ...ImageFields
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  ...VariantFields
                }
              }
            }
            ...ArtifactMetafields
          }
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${SEO_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${METAFIELD_FRAGMENT}
`;

/**
 * Search Artifacts by query string with mock fallback support.
 */
export async function searchProducts(
  query: string,
  options: { first?: number; after?: string } = {},
): Promise<{
  artifacts: Artifact[];
  totalCount: number;
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const { first = 20, after } = options;

  try {
    const data = await shopifyFetch<{
      search: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        edges: { node: any }[];
        totalCount: number;
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    }>({
      query: SEARCH_PRODUCTS,
      variables: { query, first, after },
      tags: [TAGS.products],
    });

    return {
      artifacts: reshapeProducts(data.search.edges.map((e) => e.node)),
      totalCount: data.search.totalCount,
      pageInfo: data.search.pageInfo,
    };
  } catch (error) {
    console.warn(`[Shopify API] Falling back to mock search for query "${query}":`, (error as Error).message);
    const qLower = query.toLowerCase();
    const filtered = MOCK_ARTIFACTS.filter(
      (a) =>
        a.title.toLowerCase().includes(qLower) ||
        a.description.toLowerCase().includes(qLower) ||
        a.tags.some((t) => t.toLowerCase().includes(qLower)),
    );
    return {
      artifacts: filtered.slice(0, first),
      totalCount: filtered.length,
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

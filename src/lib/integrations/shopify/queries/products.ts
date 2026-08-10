import { shopifyFetch } from '../client';
import { TAGS, DEFAULT_PAGE_SIZE } from '../constants';
import { reshapeProduct, reshapeProducts } from '../mappers';
import type { Artifact, SortKey } from '../types';
import {
  METAFIELD_FRAGMENT,
  IMAGE_FRAGMENT,
  VARIANT_FRAGMENT,
  SEO_FRAGMENT,
  MONEY_FRAGMENT,
} from './metafields';

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
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
  ${SEO_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${METAFIELD_FRAGMENT}
`;

const GET_PRODUCT_BY_HANDLE = /* GraphQL */ `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const GET_PRODUCTS = /* GraphQL */ `
  query GetProducts(
    $first: Int!
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
    $after: String
  ) {
    products(
      first: $first
      sortKey: $sortKey
      reverse: $reverse
      query: $query
      after: $after
    ) {
      edges {
        node {
          ...ProductFields
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const GET_PRODUCTS_BY_COLLECTION = /* GraphQL */ `
  query GetProductsByCollection(
    $handle: String!
    $first: Int!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $after: String
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first
        sortKey: $sortKey
        reverse: $reverse
        after: $after
      ) {
        edges {
          node {
            ...ProductFields
          }
          cursor
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const GET_PRODUCT_RECOMMENDATIONS = /* GraphQL */ `
  query GetProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

import { MOCK_ARTIFACTS } from '../mocks';

export async function getProductByHandle(
  handle: string,
): Promise<Artifact | null> {
  try {
    const data = await shopifyFetch<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product: any | null;
    }>({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle },
      tags: [TAGS.products],
    });

    if (data.product) {
      return reshapeProduct(data.product);
    }
  } catch (error) {
    console.warn(`[Shopify API] Falling back to mock data for handle "${handle}":`, (error as Error).message);
  }

  const mock = MOCK_ARTIFACTS.find((a) => a.handle === handle);
  return mock ?? MOCK_ARTIFACTS[0] ?? null;
}

export async function getProducts(options: {
  first?: number;
  sortKey?: SortKey;
  reverse?: boolean;
  query?: string;
  after?: string;
} = {}): Promise<{
  artifacts: Artifact[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}> {
  const {
    first = DEFAULT_PAGE_SIZE,
    sortKey = 'CREATED_AT',
    reverse = true,
    query,
    after,
  } = options;

  try {
    const data = await shopifyFetch<{
      products: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        edges: { node: any; cursor: string }[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    }>({
      query: GET_PRODUCTS,
      variables: { first, sortKey, reverse, query, after },
      tags: [TAGS.products],
    });

    return {
      artifacts: reshapeProducts(data.products.edges.map((e) => e.node)),
      pageInfo: data.products.pageInfo,
    };
  } catch (error) {
    console.warn('[Shopify API] Falling back to mock artifacts for list query:', (error as Error).message);
    return {
      artifacts: MOCK_ARTIFACTS.slice(0, first),
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

export async function getProductsByCollection(
  collectionHandle: string,
  options: {
    first?: number;
    sortKey?: string;
    reverse?: boolean;
    after?: string;
  } = {},
): Promise<{
  artifacts: Artifact[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
} | null> {
  const { first = DEFAULT_PAGE_SIZE, reverse = false, after } = options;

  try {
    const data = await shopifyFetch<{
      collection: {
        id: string;
        handle: string;
        title: string;
        description: string;
        products: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          edges: { node: any; cursor: string }[];
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
        };
      } | null;
    }>({
      query: GET_PRODUCTS_BY_COLLECTION,
      variables: {
        handle: collectionHandle,
        first,
        sortKey: 'MANUAL',
        reverse,
        after,
      },
      tags: [TAGS.products, TAGS.collections],
    });

    if (!data.collection) return null;

    return {
      artifacts: reshapeProducts(
        data.collection.products.edges.map((e) => e.node),
      ),
      pageInfo: data.collection.products.pageInfo,
    };
  } catch (error) {
    console.warn(`[Shopify API] Falling back for collection "${collectionHandle}":`, (error as Error).message);
    return {
      artifacts: MOCK_ARTIFACTS.slice(0, first),
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  }
}

export async function getProductRecommendations(
  productId: string,
): Promise<Artifact[]> {
  try {
    const data = await shopifyFetch<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      productRecommendations: any[];
    }>({
      query: GET_PRODUCT_RECOMMENDATIONS,
      variables: { productId },
      tags: [TAGS.products],
    });

    return reshapeProducts(data.productRecommendations ?? []);
  } catch (error) {
    console.warn('[Shopify API] Falling back for recommendations:', (error as Error).message);
    return MOCK_ARTIFACTS.slice(0, 3);
  }
}

/**
 * OTARU — Shopify GraphQL Client
 *
 * Lightweight client using native fetch.
 * Automatic retry with exponential backoff.
 * Rate limiting awareness.
 */

import type { ShopifyResponse } from './types';

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? '';
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? '';
const SHOPIFY_API_VERSION = '2024-10';

const endpoint = SHOPIFY_DOMAIN
  ? `https://${SHOPIFY_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`
  : '';

interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
  tags?: string[];
  revalidate?: number | false;
}

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 500;

/**
 * Execute a GraphQL query against the Shopify Storefront API.
 */
export async function shopifyFetch<T>({
  query,
  variables = {},
  headers: extraHeaders = {},
  tags,
  revalidate,
}: ShopifyFetchOptions): Promise<T> {
  if (!endpoint || !SHOPIFY_TOKEN) {
    // If no Shopify credentials, fall back to mock data
    throw new ShopifyConfigError(
      'Shopify credentials not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local',
    );
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
          ...extraHeaders,
        },
        body: JSON.stringify({ query, variables }),
      };

      // Next.js cache configuration
      if (tags || revalidate !== undefined) {
        fetchOptions.next = {};
        if (tags) fetchOptions.next.tags = tags;
        if (revalidate !== undefined) fetchOptions.next.revalidate = revalidate;
      }

      const response = await fetch(endpoint, fetchOptions);

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : RETRY_BASE_DELAY * Math.pow(2, attempt);

        await new Promise((resolve) => setTimeout(resolve, waitMs));
        continue;
      }

      if (!response.ok) {
        throw new ShopifyApiError(
          `Shopify API error: ${response.status} ${response.statusText}`,
          response.status,
        );
      }

      const json: ShopifyResponse<T> = await response.json();

      if (json.errors) {
        const errorMessages = json.errors.map((e) => e.message).join(', ');
        throw new ShopifyQueryError(
          `Shopify GraphQL errors: ${errorMessages}`,
          json.errors,
        );
      }

      return json.data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry config or query errors
      if (
        error instanceof ShopifyConfigError ||
        error instanceof ShopifyQueryError
      ) {
        throw error;
      }

      // Exponential backoff for retriable errors
      if (attempt < MAX_RETRIES - 1) {
        const waitMs = RETRY_BASE_DELAY * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
    }
  }

  throw lastError ?? new Error('Shopify fetch failed after retries');
}

// ── Custom Error Classes ──

export class ShopifyConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShopifyConfigError';
  }
}

export class ShopifyApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ShopifyApiError';
    this.status = status;
  }
}

export class ShopifyQueryError extends Error {
  errors: { message: string }[];

  constructor(message: string, errors: { message: string }[]) {
    super(message);
    this.name = 'ShopifyQueryError';
    this.errors = errors;
  }
}

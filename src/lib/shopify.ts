/**
 * Shopify Storefront API client.
 *
 * Falls back to mock data automatically when credentials are absent so the
 * app is runnable end-to-end before secrets are provisioned. Once
 * NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
 * are set in .env.local, real GraphQL requests take over.
 */
import type { Artifact, Cart } from "@/types/shopify";
import { MOCK_ARTIFACTS, mockCreateCart } from "./mock-data";

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2025-01";

const isConfigured = Boolean(DOMAIN && TOKEN);

async function storefrontFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join("; "));
  }
  return json.data as T;
}

/** Fetch the full Artifact archive (paginated catalog). */
export async function getArtifacts(): Promise<Artifact[]> {
  if (!isConfigured) return MOCK_ARTIFACTS;

  // TODO: replace with real GraphQL query + response mapping once store is live.
  // const data = await storefrontFetch<{ products: { nodes: any[] } }>(PRODUCTS_QUERY);
  // return data.products.nodes.map(mapShopifyProductToArtifact);
  return MOCK_ARTIFACTS;
}

/** Fetch a single Artifact by its Shopify handle. */
export async function getArtifactByHandle(handle: string): Promise<Artifact | null> {
  if (!isConfigured) {
    return MOCK_ARTIFACTS.find((a) => a.handle === handle) ?? null;
  }

  // TODO: replace with real GraphQL query once store is live.
  return MOCK_ARTIFACTS.find((a) => a.handle === handle) ?? null;
}

/** Create a new cart. */
export async function createCart(): Promise<Cart> {
  if (!isConfigured) return mockCreateCart();

  // TODO: real cartCreate mutation.
  return mockCreateCart();
}

/** Add a line item to an existing cart. */
export async function addCartLine(cartId: string, merchandiseId: string, quantity: number): Promise<Cart> {
  if (!isConfigured) return mockCreateCart();

  // TODO: real cartLinesAdd mutation.
  return mockCreateCart();
}

export const shopifyConfigured = isConfigured;

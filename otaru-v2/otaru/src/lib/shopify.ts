/**
 * Shopify Storefront API client.
 *
 * Falls back to mock data automatically when credentials are absent so the
 * app is runnable end-to-end before secrets are provisioned. Once
 * NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
 * are set, every function below hits the real GraphQL API.
 */
import type { Artifact, ArtifactImage, ArtifactVariant, Cart, CartLine } from "@/types/shopify";
import { MOCK_ARTIFACTS, mockCreateCart } from "./mock-data";
import {
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_QUERY,
} from "./shopify-queries";

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2025-01";

export const shopifyConfigured = Boolean(DOMAIN && TOKEN);

class ShopifyApiError extends Error {
  constructor(message: string, public userErrors?: { field: string[]; message: string }[]) {
    super(message);
    this.name = "ShopifyApiError";
  }
}

async function storefrontFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60, tags: ["shopify"] },
  });

  if (!res.ok) {
    throw new ShopifyApiError(`Shopify Storefront API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new ShopifyApiError(json.errors.map((e: { message: string }) => e.message).join("; "));
  }
  return json.data as T;
}

// ---------------------------------------------------------------------------
// Response → domain type mapping
// ---------------------------------------------------------------------------

interface RawImageNode { id: string; url: string; altText: string | null; width: number; height: number }
interface RawVariantNode {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
}
interface RawProductNode {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string }; maxVariantPrice: { amount: string; currencyCode: string } };
  images: { nodes: RawImageNode[] };
  options: { id: string; name: string; values: string[] }[];
  variants: { nodes: RawVariantNode[] };
}

function mapImage(img: RawImageNode): ArtifactImage {
  return { id: img.id, url: img.url, altText: img.altText, width: img.width, height: img.height };
}

function mapVariant(v: RawVariantNode): ArtifactVariant {
  return {
    id: v.id,
    title: v.title,
    availableForSale: v.availableForSale,
    selectedOptions: v.selectedOptions,
    price: v.price,
    compareAtPrice: v.compareAtPrice,
  };
}

function mapProductToArtifact(p: RawProductNode): Artifact {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    descriptionHtml: p.descriptionHtml,
    vendor: p.vendor,
    tags: p.tags,
    availableForSale: p.availableForSale,
    priceRange: p.priceRange,
    images: p.images.nodes.map(mapImage),
    options: p.options,
    variants: p.variants.nodes.map(mapVariant),
  };
}

interface RawCartLineNode {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: { amount: string; currencyCode: string };
    product: { handle: string; title: string; images: { nodes: RawImageNode[] } };
  };
}
interface RawCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: { amount: string; currencyCode: string }; totalAmount: { amount: string; currencyCode: string } };
  lines: { nodes: RawCartLineNode[] };
}

function mapCartLine(l: RawCartLineNode): CartLine {
  return {
    id: l.id,
    quantity: l.quantity,
    merchandise: {
      id: l.merchandise.id,
      title: l.merchandise.title,
      price: l.merchandise.price,
      product: {
        handle: l.merchandise.product.handle,
        title: l.merchandise.product.title,
        images: l.merchandise.product.images.nodes.map(mapImage),
      },
    },
  };
}

function mapCart(c: RawCart): Cart {
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    cost: c.cost,
    lines: c.lines.nodes.map(mapCartLine),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * `country` drives the Storefront API's @inContext directive for
 * multi-currency pricing (see src/stores/currency-store.ts on the client).
 * Server Components can't read that client store directly — pass the
 * country through from a cookie (e.g. set by CurrencySelector via a server
 * action) once multi-currency Shopify Markets are configured. Defaults to
 * "US" so behavior is unchanged until that wiring exists.
 */

/** Fetch the full Artifact archive (paginated catalog). */
export async function getArtifacts(first = 24, country = "US"): Promise<Artifact[]> {
  if (!shopifyConfigured) return MOCK_ARTIFACTS;

  const data = await storefrontFetch<{ products: { nodes: RawProductNode[] } }>(PRODUCTS_QUERY, { first, country });
  return data.products.nodes.map(mapProductToArtifact);
}

/** Fetch a single Artifact by its Shopify handle. */
export async function getArtifactByHandle(handle: string, country = "US"): Promise<Artifact | null> {
  if (!shopifyConfigured) {
    return MOCK_ARTIFACTS.find((a) => a.handle === handle) ?? null;
  }

  const data = await storefrontFetch<{ product: RawProductNode | null }>(PRODUCT_BY_HANDLE_QUERY, { handle, country });
  return data.product ? mapProductToArtifact(data.product) : null;
}

/** Create a new cart, optionally seeded with one line. */
export async function createCart(merchandiseId?: string, quantity = 1): Promise<Cart> {
  if (!shopifyConfigured) return mockCreateCart();

  const lines = merchandiseId ? [{ merchandiseId, quantity }] : [];
  const data = await storefrontFetch<{ cartCreate: { cart: RawCart; userErrors: { field: string[]; message: string }[] } }>(
    CART_CREATE_MUTATION,
    { lines }
  );
  if (data.cartCreate.userErrors.length) {
    throw new ShopifyApiError(data.cartCreate.userErrors.map((e) => e.message).join("; "), data.cartCreate.userErrors);
  }
  return mapCart(data.cartCreate.cart);
}

/** Fetch a cart by ID (used to rehydrate on page load). */
export async function getCart(cartId: string): Promise<Cart | null> {
  if (!shopifyConfigured) return mockCreateCart();

  const data = await storefrontFetch<{ cart: RawCart | null }>(CART_QUERY, { cartId });
  return data.cart ? mapCart(data.cart) : null;
}

/** Add a line item to an existing cart. */
export async function addCartLine(cartId: string, merchandiseId: string, quantity: number): Promise<Cart> {
  if (!shopifyConfigured) return mockCreateCart();

  const data = await storefrontFetch<{ cartLinesAdd: { cart: RawCart; userErrors: { field: string[]; message: string }[] } }>(
    CART_LINES_ADD_MUTATION,
    { cartId, lines: [{ merchandiseId, quantity }] }
  );
  if (data.cartLinesAdd.userErrors.length) {
    throw new ShopifyApiError(data.cartLinesAdd.userErrors.map((e) => e.message).join("; "), data.cartLinesAdd.userErrors);
  }
  return mapCart(data.cartLinesAdd.cart);
}

/** Update quantity on an existing cart line. */
export async function updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  if (!shopifyConfigured) return mockCreateCart();

  const data = await storefrontFetch<{ cartLinesUpdate: { cart: RawCart; userErrors: { field: string[]; message: string }[] } }>(
    CART_LINES_UPDATE_MUTATION,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  if (data.cartLinesUpdate.userErrors.length) {
    throw new ShopifyApiError(data.cartLinesUpdate.userErrors.map((e) => e.message).join("; "), data.cartLinesUpdate.userErrors);
  }
  return mapCart(data.cartLinesUpdate.cart);
}

/** Remove a line item from the cart entirely. */
export async function removeCartLine(cartId: string, lineId: string): Promise<Cart> {
  if (!shopifyConfigured) return mockCreateCart();

  const data = await storefrontFetch<{ cartLinesRemove: { cart: RawCart; userErrors: { field: string[]; message: string }[] } }>(
    CART_LINES_REMOVE_MUTATION,
    { cartId, lineIds: [lineId] }
  );
  if (data.cartLinesRemove.userErrors.length) {
    throw new ShopifyApiError(data.cartLinesRemove.userErrors.map((e) => e.message).join("; "), data.cartLinesRemove.userErrors);
  }
  return mapCart(data.cartLinesRemove.cart);
}

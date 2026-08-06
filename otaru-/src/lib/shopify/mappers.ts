/**
 * OTARU — Shopify Response Mappers
 *
 * Transform raw Shopify GraphQL responses into clean Artifact types.
 * Handles metafield parsing, null safety, and edge/node unwrapping.
 */

import type { Artifact, ArtifactVariant, ShopifyImage, Cart, CartLine } from './types';

// ── Helper: extract metafield value ──
function getMetafieldValue(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any,
  fieldAlias: string,
  fallback = '',
): string {
  return product?.[fieldAlias]?.value ?? fallback;
}

// ── Helper: unwrap edges/nodes ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrapEdges<T>(connection: { edges: { node: T }[] } | undefined): T[] {
  return connection?.edges?.map((edge) => edge.node) ?? [];
}

/**
 * Map a raw Shopify product to a clean Artifact type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reshapeProduct(product: any): Artifact {
  const images: ShopifyImage[] = unwrapEdges(product.images);
  const variants: ArtifactVariant[] = unwrapEdges(product.variants).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (v: any) => ({
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      quantityAvailable: v.quantityAvailable ?? 0,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      selectedOptions: v.selectedOptions ?? [],
    }),
  );

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description ?? '',
    descriptionHtml: product.descriptionHtml ?? '',
    availableForSale: product.availableForSale ?? false,
    totalInventory: product.totalInventory ?? 0,
    price: product.priceRange?.minVariantPrice ?? { amount: '0', currencyCode: 'INR' },
    compareAtPrice: product.compareAtPriceRange?.minVariantPrice?.amount !== '0'
      ? product.compareAtPriceRange?.minVariantPrice
      : null,
    variants,
    images,
    featuredImage: product.featuredImage ?? images[0] ?? null,
    seo: {
      title: product.seo?.title ?? product.title,
      description: product.seo?.description ?? product.description,
    },
    tags: product.tags ?? [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,

    // Otaru metafields
    artifactNumber: getMetafieldValue(product, 'artifactNumber'),
    artifactName: getMetafieldValue(product, 'artifactName'),
    chapterId: getMetafieldValue(product, 'chapterId'),
    gsm: getMetafieldValue(product, 'gsm'),
    construction: getMetafieldValue(product, 'construction'),
    wash: getMetafieldValue(product, 'wash'),
    printTechnique: getMetafieldValue(product, 'printTechnique'),
    symbolMeaning: getMetafieldValue(product, 'symbolMeaning'),
  };
}

/**
 * Map multiple raw products to Artifacts, filtering out hidden ones.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reshapeProducts(products: any[]): Artifact[] {
  return products
    .filter((p) => p != null)
    .map(reshapeProduct);
}

/**
 * Map a raw Shopify cart to a clean Cart type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reshapeCart(rawCart: any): Cart {
  const lines: CartLine[] = unwrapEdges(rawCart.lines).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (line: any) => ({
      id: line.id,
      quantity: line.quantity,
      cost: {
        totalAmount: line.cost.totalAmount,
        amountPerQuantity: line.cost.amountPerQuantity,
      },
      merchandise: {
        id: line.merchandise.id,
        title: line.merchandise.title,
        selectedOptions: line.merchandise.selectedOptions ?? [],
        product: {
          id: line.merchandise.product.id,
          handle: line.merchandise.product.handle,
          title: line.merchandise.product.title,
          featuredImage: line.merchandise.product.featuredImage ?? null,
        },
      },
    }),
  );

  return {
    id: rawCart.id,
    checkoutUrl: rawCart.checkoutUrl,
    totalQuantity: rawCart.totalQuantity,
    cost: {
      subtotalAmount: rawCart.cost.subtotalAmount,
      totalAmount: rawCart.cost.totalAmount,
      totalTaxAmount: rawCart.cost.totalTaxAmount ?? null,
    },
    lines,
  };
}

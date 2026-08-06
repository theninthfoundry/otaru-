/**
 * OTARU — Shopify Cart Mutations with Resilient Fallbacks
 *
 * All cart write operations using the Storefront Cart API.
 */

import { shopifyFetch } from '../client';
import { CART_FRAGMENT } from '../queries/cart';

// ── Mutations ──

const CREATE_CART = /* GraphQL */ `
  mutation CreateCart($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const ADD_TO_CART = /* GraphQL */ `
  mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const REMOVE_FROM_CART = /* GraphQL */ `
  mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const UPDATE_CART = /* GraphQL */ `
  mutation UpdateCart($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

const UPDATE_CART_BUYER_IDENTITY = /* GraphQL */ `
  mutation UpdateCartBuyerIdentity(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
  ) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
  ${CART_FRAGMENT}
`;

// ── Exported Functions ──

/**
 * Create a new cart, optionally with initial line items.
 */
export async function createCart(
  lines: { merchandiseId: string; quantity: number }[] = [],
) {
  try {
    const data = await shopifyFetch<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cartCreate: { cart: any; userErrors: { field: string; message: string }[] };
    }>({
      query: CREATE_CART,
      variables: { input: { lines } },
      revalidate: 0,
    });

    if (data?.cartCreate?.userErrors?.length > 0) {
      throw new Error(
        data.cartCreate.userErrors.map((e) => e.message).join(', '),
      );
    }

    return data?.cartCreate?.cart ?? { id: 'mock-cart-id', lines: [], totalQuantity: 0 };
  } catch (error) {
    console.warn('[Shopify API] Falling back to local mock cart creation:', (error as Error).message);
    return { id: 'mock-cart-id', lines: [], totalQuantity: 0, checkoutUrl: '/checkout' };
  }
}

/**
 * Add line items to an existing cart.
 */
export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
) {
  try {
    const data = await shopifyFetch<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cartLinesAdd: { cart: any; userErrors: { field: string; message: string }[] };
    }>({
      query: ADD_TO_CART,
      variables: { cartId, lines },
      revalidate: 0,
    });

    if (data?.cartLinesAdd?.userErrors?.length > 0) {
      throw new Error(
        data.cartLinesAdd.userErrors.map((e) => e.message).join(', '),
      );
    }

    return data?.cartLinesAdd?.cart ?? null;
  } catch (error) {
    console.warn('[Shopify API] Falling back for addToCart:', (error as Error).message);
    return null;
  }
}

/**
 * Remove line items from a cart.
 */
export async function removeFromCart(cartId: string, lineIds: string[]) {
  try {
    const data = await shopifyFetch<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cartLinesRemove: { cart: any; userErrors: { field: string; message: string }[] };
    }>({
      query: REMOVE_FROM_CART,
      variables: { cartId, lineIds },
      revalidate: 0,
    });

    if (data?.cartLinesRemove?.userErrors?.length > 0) {
      throw new Error(
        data.cartLinesRemove.userErrors.map((e) => e.message).join(', '),
      );
    }

    return data?.cartLinesRemove?.cart ?? null;
  } catch (error) {
    console.warn('[Shopify API] Falling back for removeFromCart:', (error as Error).message);
    return null;
  }
}

/**
 * Update line item quantities in a cart.
 */
export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[],
) {
  try {
    const data = await shopifyFetch<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cartLinesUpdate: { cart: any; userErrors: { field: string; message: string }[] };
    }>({
      query: UPDATE_CART,
      variables: { cartId, lines },
      revalidate: 0,
    });

    if (data?.cartLinesUpdate?.userErrors?.length > 0) {
      throw new Error(
        data.cartLinesUpdate.userErrors.map((e) => e.message).join(', '),
      );
    }

    return data?.cartLinesUpdate?.cart ?? null;
  } catch (error) {
    console.warn('[Shopify API] Falling back for updateCart:', (error as Error).message);
    return null;
  }
}

/**
 * Update buyer identity on a cart (for authenticated checkout).
 */
export async function updateCartBuyerIdentity(
  cartId: string,
  buyerIdentity: { customerAccessToken?: string; email?: string },
) {
  try {
    const data = await shopifyFetch<{
      cartBuyerIdentityUpdate: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cart: any;
        userErrors: { field: string; message: string }[];
      };
    }>({
      query: UPDATE_CART_BUYER_IDENTITY,
      variables: { cartId, buyerIdentity },
      revalidate: 0,
    });

    if (data?.cartBuyerIdentityUpdate?.userErrors?.length > 0) {
      throw new Error(
        data.cartBuyerIdentityUpdate.userErrors
          .map((e) => e.message)
          .join(', '),
      );
    }

    return data?.cartBuyerIdentityUpdate?.cart ?? null;
  } catch (error) {
    console.warn('[Shopify API] Falling back for updateCartBuyerIdentity:', (error as Error).message);
    return null;
  }
}

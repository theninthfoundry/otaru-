import { shopifyFetch } from '../client';
import { IMAGE_FRAGMENT, MONEY_FRAGMENT } from './metafields';

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...MoneyFields
      }
      totalAmount {
        ...MoneyFields
      }
      totalTaxAmount {
        ...MoneyFields
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...MoneyFields
            }
            amountPerQuantity {
              ...MoneyFields
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                id
                handle
                title
                featuredImage {
                  ...ImageFields
                }
              }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;

const GET_CART = /* GraphQL */ `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FRAGMENT}
`;

export { CART_FRAGMENT };

export async function getCart(cartId: string) {
  try {
    const data = await shopifyFetch<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cart: any | null;
    }>({
      query: GET_CART,
      variables: { cartId },
      revalidate: 0,
    });

    return data.cart;
  } catch (error) {
    console.warn('[Shopify API] Falling back to null cart for ID:', cartId, (error as Error).message);
    return null;
  }
}

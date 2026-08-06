/**
 * OTARU — Shopify Customer Queries with Resilient Fallbacks
 */

import { shopifyFetch } from '../client';
import { MONEY_FRAGMENT, IMAGE_FRAGMENT } from './metafields';

const GET_CUSTOMER = /* GraphQL */ `
  query GetCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      email
      firstName
      lastName
      phone
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            totalPrice {
              ...MoneyFields
            }
            lineItems(first: 20) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    title
                    price {
                      ...MoneyFields
                    }
                    image {
                      ...ImageFields
                    }
                  }
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

/**
 * Get authenticated customer data including order history.
 */
export async function getCustomer(customerAccessToken: string) {
  try {
    const data = await shopifyFetch<{
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customer: any | null;
    }>({
      query: GET_CUSTOMER,
      variables: { customerAccessToken },
      revalidate: 0,
    });

    return data.customer;
  } catch (error) {
    console.warn('[Shopify API] Falling back to null customer session:', (error as Error).message);
    return null;
  }
}

/**
 * OTARU — Shopify Query Index
 *
 * Barrel re-exports for clean imports.
 */

// Products
export {
  getProductByHandle,
  getProducts,
  getProductsByCollection,
  getProductRecommendations,
} from './products';

// Collections
export { getCollections, getCollectionByHandle } from './collections';

// Cart
export { getCart } from './cart';

// Search
export { searchProducts } from './search';

// Customer
export { getCustomer } from './customer';

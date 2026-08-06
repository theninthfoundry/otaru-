/**
 * OTARU — Shopify Types
 *
 * Complete TypeScript interfaces for the Otaru data model (§4.4).
 * These types represent the clean, mapped output from Shopify's
 * GraphQL responses — not the raw API shapes.
 */

// ── Money ──
export interface Money {
  amount: string;
  currencyCode: string;
}

// ── Image ──
export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

// ── SEO ──
export interface SEO {
  title: string | null;
  description: string | null;
}

// ── Variant ──
export interface ArtifactVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: SelectedOption[];
}

export interface SelectedOption {
  name: string;
  value: string;
}

// ── Artifact (Product) ──
export interface Artifact {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  totalInventory: number;
  price: Money;
  compareAtPrice: Money | null;
  variants: ArtifactVariant[];
  images: ShopifyImage[];
  featuredImage: ShopifyImage | null;
  seo: SEO;
  tags: string[];
  createdAt: string;
  updatedAt: string;

  // Otaru-specific metafields (§4.4)
  artifactNumber: string;
  artifactName: string;
  chapterId: string;
  gsm: string;
  construction: string;
  wash: string;
  printTechnique: string;
  symbolMeaning: string;
}

// ── Collection / Chapter ──
export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  image: ShopifyImage | null;
  updatedAt: string;
}

// ── Cart ──
export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: CartLine[];
}

export interface CartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
    amountPerQuantity: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: ShopifyImage | null;
    };
  };
}

// ── Customer ──
export interface Customer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  orders: CustomerOrder[];
}

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: Money;
  lineItems: OrderLineItem[];
}

export interface OrderLineItem {
  title: string;
  quantity: number;
  variant: {
    title: string;
    price: Money;
    image: ShopifyImage | null;
  } | null;
}

// ── Page ──
export interface ShopifyPage {
  id: string;
  handle: string;
  title: string;
  body: string;
  bodySummary: string;
  seo: SEO;
  createdAt: string;
  updatedAt: string;
}

// ── Menu ──
export interface Menu {
  title: string;
  items: MenuItem[];
}

export interface MenuItem {
  title: string;
  url: string;
}

// ── Search ──
export interface SearchResult {
  artifacts: Artifact[];
  totalCount: number;
}

// ── Sort ──
export type SortKey =
  | 'RELEVANCE'
  | 'BEST_SELLING'
  | 'CREATED_AT'
  | 'PRICE'
  | 'TITLE';

export type SortDirection = 'ASC' | 'DESC';

export interface SortOption {
  label: string;
  key: SortKey;
  reverse: boolean;
}

// ── API Response Wrapper ──
export interface ShopifyResponse<T> {
  data: T;
  errors?: ShopifyError[];
}

export interface ShopifyError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
  extensions?: Record<string, unknown>;
}

// ── Pagination ──
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

export interface Edge<T> {
  node: T;
  cursor: string;
}

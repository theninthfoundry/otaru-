export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ArtifactVariant {
  id: string;
  title: string;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
  quantityAvailable?: number;
  selectedOptions: SelectedOption[];
}

export interface Artifact {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  price: Money;
  compareAtPrice: Money | null;
  images: ShopifyImage[];
  featuredImage: ShopifyImage | null;
  variants: ArtifactVariant[];
  availableForSale: boolean;
  totalInventory?: number;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;

  // Custom Otaru Metafields & Luxury Specs
  artifactNumber?: string;
  artifactName?: string;
  chapterId?: string;
  gsm?: string;
  construction?: string;
  wash?: string;
  printTechnique?: string;
  symbolMeaning?: string;

  seo: {
    title?: string;
    description?: string;
  };
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: ShopifyImage | null;
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

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount?: Money | null;
  };
  lines: CartLine[];
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  processedAt: string;
  totalPrice: Money;
  fulfillmentStatus: string;
  financialStatus: string;
}

export type SortKey = 'PRICE' | 'CREATED_AT' | 'BEST_SELLING' | 'RELEVANCE' | 'TITLE';

export interface SortOption {
  label: string;
  value: string;
  key: SortKey;
  reverse: boolean;
}

export interface SearchResult {
  artifacts: Artifact[];
  collections: Collection[];
}

export interface SEO {
  title?: string;
  description?: string;
}

export interface ShopifyError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
}

export interface ShopifyResponse<T> {
  data: T;
  errors?: ShopifyError[];
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

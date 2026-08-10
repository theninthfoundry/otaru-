/**
 * Minimal Shopify Storefront API type surface used by this app.
 * Extend as GraphQL queries grow. Kept intentionally small and explicit
 * rather than pulling in full generated codegen types for the scaffold.
 */
export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ArtifactImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ArtifactVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
}

export interface ArtifactOption {
  id: string;
  name: string;
  values: string[];
}

/** A "Product" in Shopify — surfaced everywhere in the UI as "Artifact". */
export interface Artifact {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  vendor: string;
  tags: string[];
  images: ArtifactImage[];
  variants: ArtifactVariant[];
  options: ArtifactOption[];
  priceRange: { minVariantPrice: MoneyV2; maxVariantPrice: MoneyV2 };
  availableForSale: boolean;
}

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: Pick<Artifact, "handle" | "title" | "images">;
    price: MoneyV2;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
  };
  lines: CartLine[];
}

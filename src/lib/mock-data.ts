/**
 * Mock data layer — used automatically when Shopify/Sanity env vars are
 * absent, so the app runs and renders end-to-end before real credentials
 * are wired up.
 */
import type { Artifact, Cart } from "@/types/shopify";
import type { Chapter, JournalEntry } from "@/types/sanity";

const placeholderImage = (seed: string, w = 1200, h = 1500) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const MOCK_ARTIFACTS: Artifact[] = [
  {
    id: "gid://mock/Product/1",
    handle: "raw-denim-chore-coat",
    title: "Raw Denim Chore Coat",
    description: "13oz Japanese selvedge denim, hand-finished brass hardware, built to break in over a decade of wear.",
    descriptionHtml:
      "<p>13oz Japanese selvedge denim, hand-finished brass hardware, built to break in over a decade of wear.</p>",
    tags: ["outerwear", "denim", "chapter-02"],
    price: { amount: "420.00", currencyCode: "USD" },
    compareAtPrice: null,
    images: [
      { url: placeholderImage("chore-coat-1"), altText: "Raw Denim Chore Coat, front", width: 1200, height: 1500 },
      { url: placeholderImage("chore-coat-2"), altText: "Raw Denim Chore Coat, detail", width: 1200, height: 1500 },
      { url: placeholderImage("chore-coat-3"), altText: "Raw Denim Chore Coat, back", width: 1200, height: 1500 },
    ],
    featuredImage: { url: placeholderImage("chore-coat-1"), altText: "Raw Denim Chore Coat", width: 1200, height: 1500 },
    variants: [
      { id: "v1", title: "S", availableForSale: true, selectedOptions: [{ name: "Size", value: "S" }], price: { amount: "420.00", currencyCode: "USD" }, compareAtPrice: null },
      { id: "v2", title: "M", availableForSale: true, selectedOptions: [{ name: "Size", value: "M" }], price: { amount: "420.00", currencyCode: "USD" }, compareAtPrice: null },
      { id: "v3", title: "L", availableForSale: false, selectedOptions: [{ name: "Size", value: "L" }], price: { amount: "420.00", currencyCode: "USD" }, compareAtPrice: null },
    ],
    availableForSale: true,
    seo: { title: "Raw Denim Chore Coat", description: "13oz Japanese selvedge denim." },
  },
  {
    id: "gid://mock/Product/2",
    handle: "structured-wool-overcoat",
    title: "Structured Wool Overcoat",
    description: "Architectural silhouette in double-face Italian wool, fully canvassed, half-lined for a cleaner drape.",
    descriptionHtml:
      "<p>Architectural silhouette in double-face Italian wool, fully canvassed, half-lined for a cleaner drape.</p>",
    tags: ["outerwear", "wool", "chapter-02"],
    price: { amount: "890.00", currencyCode: "USD" },
    compareAtPrice: { amount: "980.00", currencyCode: "USD" },
    images: [
      { url: placeholderImage("overcoat-1"), altText: "Structured Wool Overcoat, front", width: 1200, height: 1500 },
      { url: placeholderImage("overcoat-2"), altText: "Structured Wool Overcoat, detail", width: 1200, height: 1500 },
    ],
    featuredImage: { url: placeholderImage("overcoat-1"), altText: "Structured Wool Overcoat", width: 1200, height: 1500 },
    variants: [
      { id: "v4", title: "M", availableForSale: true, selectedOptions: [{ name: "Size", value: "M" }], price: { amount: "890.00", currencyCode: "USD" }, compareAtPrice: { amount: "980.00", currencyCode: "USD" } },
      { id: "v5", title: "L", availableForSale: true, selectedOptions: [{ name: "Size", value: "L" }], price: { amount: "890.00", currencyCode: "USD" }, compareAtPrice: { amount: "980.00", currencyCode: "USD" } },
    ],
    availableForSale: true,
    seo: { title: "Structured Wool Overcoat", description: "Architectural silhouette in double-face Italian wool." },
  },
  {
    id: "gid://mock/Product/3",
    handle: "kinetic-cargo-trouser",
    title: "Kinetic Cargo Trouser",
    description: "Articulated knee construction in a matte technical twill. Built for movement, cut for precision.",
    descriptionHtml:
      "<p>Articulated knee construction in a matte technical twill. Built for movement, cut for precision.</p>",
    tags: ["bottoms", "technical", "chapter-02"],
    price: { amount: "310.00", currencyCode: "USD" },
    compareAtPrice: null,
    images: [
      { url: placeholderImage("cargo-1"), altText: "Kinetic Cargo Trouser, front", width: 1200, height: 1500 },
    ],
    featuredImage: { url: placeholderImage("cargo-1"), altText: "Kinetic Cargo Trouser", width: 1200, height: 1500 },
    variants: [
      { id: "v6", title: "30", availableForSale: false, selectedOptions: [{ name: "Size", value: "30" }], price: { amount: "310.00", currencyCode: "USD" }, compareAtPrice: null },
      { id: "v7", title: "32", availableForSale: false, selectedOptions: [{ name: "Size", value: "32" }], price: { amount: "310.00", currencyCode: "USD" }, compareAtPrice: null },
    ],
    availableForSale: false,
    seo: { title: "Kinetic Cargo Trouser", description: "Articulated knee construction." },
  },
];

export const MOCK_CHAPTERS: Chapter[] = [
  {
    _id: "chapter-02",
    title: "Kinetic Architecture",
    slug: "kinetic-architecture",
    chapterNumber: 2,
    status: "active",
    tagline: "A study in structured movement — garments engineered like buildings, worn like second skin.",
  },
];

export const MOCK_JOURNAL: JournalEntry[] = [
  {
    _id: "journal-01",
    title: "The Case for Owning Fewer, Better Things",
    slug: "case-for-owning-fewer-better-things",
    excerpt: "On craftsmanship, permanence, and why Otaru refuses seasonal collections.",
    coverImage: { _type: "image", asset: { _ref: "image-journal-01", _type: "reference" } },
    author: "Otaru Studio",
    body: [],
    publishedAt: "2026-02-14T00:00:00Z",
  },
];

export function mockCreateCart(): Cart {
  return {
    id: "gid://mock/Cart/1",
    checkoutUrl: "https://mock.shopify.com/checkout",
    totalQuantity: 1,
    lines: [
      {
        id: "gid://mock/CartLine/1",
        quantity: 1,
        cost: {
          totalAmount: { amount: "420.00", currencyCode: "USD" },
          amountPerQuantity: { amount: "420.00", currencyCode: "USD" },
        },
        merchandise: {
          id: "v1",
          title: "S",
          selectedOptions: [{ name: "Size", value: "S" }],
          product: {
            id: "gid://mock/Product/1",
            handle: "raw-denim-chore-coat",
            title: "Raw Denim Chore Coat",
            featuredImage: { url: placeholderImage("chore-coat-1"), altText: "Chore coat", width: 1200, height: 1500 },
          },
        },
      },
    ],
    cost: {
      subtotalAmount: { amount: "420.00", currencyCode: "USD" },
      totalAmount: { amount: "420.00", currencyCode: "USD" },
      totalTaxAmount: { amount: "0.00", currencyCode: "USD" },
    },
  };
}

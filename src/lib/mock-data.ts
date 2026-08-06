/**
 * Mock data layer — used automatically when Shopify/Sanity env vars are
 * absent, so the app runs and renders end-to-end before real credentials
 * are wired up. Swap-out point: once NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and
 * NEXT_PUBLIC_SANITY_PROJECT_ID are set, src/lib/shopify.ts and
 * src/lib/sanity.ts hit the real APIs and this file stops being imported.
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
    descriptionHtml:
      "<p>13oz Japanese selvedge denim, hand-finished brass hardware, built to break in over a decade of wear.</p>",
    vendor: "Otaru",
    tags: ["outerwear", "denim", "chapter-02"],
    images: [
      { id: "img1", url: placeholderImage("chore-coat-1"), altText: "Raw Denim Chore Coat, front", width: 1200, height: 1500 },
      { id: "img2", url: placeholderImage("chore-coat-2"), altText: "Raw Denim Chore Coat, detail", width: 1200, height: 1500 },
      { id: "img3", url: placeholderImage("chore-coat-3"), altText: "Raw Denim Chore Coat, back", width: 1200, height: 1500 },
    ],
    variants: [
      { id: "v1", title: "S", availableForSale: true, selectedOptions: [{ name: "Size", value: "S" }], price: { amount: "420.00", currencyCode: "USD" }, compareAtPrice: null },
      { id: "v2", title: "M", availableForSale: true, selectedOptions: [{ name: "Size", value: "M" }], price: { amount: "420.00", currencyCode: "USD" }, compareAtPrice: null },
      { id: "v3", title: "L", availableForSale: false, selectedOptions: [{ name: "Size", value: "L" }], price: { amount: "420.00", currencyCode: "USD" }, compareAtPrice: null },
    ],
    options: [{ id: "opt1", name: "Size", values: ["S", "M", "L"] }],
    priceRange: { minVariantPrice: { amount: "420.00", currencyCode: "USD" }, maxVariantPrice: { amount: "420.00", currencyCode: "USD" } },
    availableForSale: true,
  },
  {
    id: "gid://mock/Product/2",
    handle: "structured-wool-overcoat",
    title: "Structured Wool Overcoat",
    descriptionHtml:
      "<p>Architectural silhouette in double-face Italian wool, fully canvassed, half-lined for a cleaner drape.</p>",
    vendor: "Otaru",
    tags: ["outerwear", "wool", "chapter-02"],
    images: [
      { id: "img4", url: placeholderImage("overcoat-1"), altText: "Structured Wool Overcoat, front", width: 1200, height: 1500 },
      { id: "img5", url: placeholderImage("overcoat-2"), altText: "Structured Wool Overcoat, detail", width: 1200, height: 1500 },
    ],
    variants: [
      { id: "v4", title: "M", availableForSale: true, selectedOptions: [{ name: "Size", value: "M" }], price: { amount: "890.00", currencyCode: "USD" }, compareAtPrice: { amount: "980.00", currencyCode: "USD" } },
      { id: "v5", title: "L", availableForSale: true, selectedOptions: [{ name: "Size", value: "L" }], price: { amount: "890.00", currencyCode: "USD" }, compareAtPrice: { amount: "980.00", currencyCode: "USD" } },
    ],
    options: [{ id: "opt2", name: "Size", values: ["M", "L"] }],
    priceRange: { minVariantPrice: { amount: "890.00", currencyCode: "USD" }, maxVariantPrice: { amount: "890.00", currencyCode: "USD" } },
    availableForSale: true,
  },
  {
    id: "gid://mock/Product/3",
    handle: "kinetic-cargo-trouser",
    title: "Kinetic Cargo Trouser",
    descriptionHtml:
      "<p>Articulated knee construction in a matte technical twill. Built for movement, cut for precision.</p>",
    vendor: "Otaru",
    tags: ["bottoms", "technical", "chapter-02"],
    images: [
      { id: "img6", url: placeholderImage("cargo-1"), altText: "Kinetic Cargo Trouser, front", width: 1200, height: 1500 },
    ],
    variants: [
      { id: "v6", title: "30", availableForSale: false, selectedOptions: [{ name: "Size", value: "30" }], price: { amount: "310.00", currencyCode: "USD" }, compareAtPrice: null },
      { id: "v7", title: "32", availableForSale: false, selectedOptions: [{ name: "Size", value: "32" }], price: { amount: "310.00", currencyCode: "USD" }, compareAtPrice: null },
    ],
    options: [{ id: "opt3", name: "Size", values: ["30", "32"] }],
    priceRange: { minVariantPrice: { amount: "310.00", currencyCode: "USD" }, maxVariantPrice: { amount: "310.00", currencyCode: "USD" } },
    availableForSale: false,
  },
];

export const MOCK_CHAPTERS: Chapter[] = [
  {
    _id: "chapter-02",
    _type: "chapter",
    title: "Kinetic Architecture",
    slug: { current: "kinetic-architecture" },
    number: 2,
    curatorNote:
      "A study in structured movement — garments engineered like buildings, worn like second skin.",
    heroImage: { asset: { _ref: "image-chapter-02", _type: "reference" }, alt: "Chapter 02 hero" },
    moodboard: [],
    artifactHandles: MOCK_ARTIFACTS.map((a) => a.handle),
    publishedAt: "2026-03-01T00:00:00Z",
  },
];

export const MOCK_JOURNAL: JournalEntry[] = [
  {
    _id: "journal-01",
    _type: "journal",
    title: "The Case for Owning Fewer, Better Things",
    slug: { current: "case-for-owning-fewer-better-things" },
    excerpt: "On craftsmanship, permanence, and why Otaru refuses seasonal collections.",
    coverImage: { asset: { _ref: "image-journal-01", _type: "reference" } },
    author: { name: "Otaru Studio" },
    body: [],
    publishedAt: "2026-02-14T00:00:00Z",
    readingTimeMinutes: 6,
  },
];

export function mockCreateCart(): Cart {
  return {
    id: "gid://mock/Cart/1",
    checkoutUrl: "#",
    totalQuantity: 0,
    cost: {
      subtotalAmount: { amount: "0.00", currencyCode: "USD" },
      totalAmount: { amount: "0.00", currencyCode: "USD" },
    },
    lines: [],
  };
}

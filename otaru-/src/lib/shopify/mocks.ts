import type { Artifact } from './types';

/**
 * OTARU — High-Fidelity Mock Artifacts for Development & Demo Modes.
 * Formatted strictly according to Otaru luxury domain standards.
 */
export const MOCK_ARTIFACTS: Artifact[] = [
  {
    id: 'gid://shopify/Product/001',
    handle: 'artifact-001-denim-jacket',
    title: 'Artifact #001 — Raw Selvage Denim Chore Coat',
    description:
      'Constructed from 14.5oz Japanese raw selvage denim with custom matte gunmetal buttons, reinforced triple-needle lap seams, and concealed utility pockets.',
    descriptionHtml:
      '<p>Constructed from 14.5oz Japanese raw selvage denim with custom matte gunmetal buttons, reinforced triple-needle lap seams, and concealed utility pockets.</p>',
    price: {
      amount: '380.00',
      currencyCode: 'USD',
      formatted: '$380',
    },
    compareAtPrice: null,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=85',
        altText: 'Raw Selvage Denim Chore Coat front view',
        width: 1200,
        height: 1600,
      },
      {
        url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
        altText: 'Raw Selvage Denim Chore Coat back detail',
        width: 1200,
        height: 1600,
      },
    ],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=85',
      altText: 'Raw Selvage Denim Chore Coat front view',
      width: 1200,
      height: 1600,
    },
    variants: [
      {
        id: 'gid://shopify/ProductVariant/001-1',
        title: 'Small / Ink Black',
        price: { amount: '380.00', currencyCode: 'USD', formatted: '$380' },
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'S' },
          { name: 'Color', value: 'Ink Black' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/001-2',
        title: 'Medium / Ink Black',
        price: { amount: '380.00', currencyCode: 'USD', formatted: '$380' },
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Color', value: 'Ink Black' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/001-3',
        title: 'Large / Ink Black',
        price: { amount: '380.00', currencyCode: 'USD', formatted: '$380' },
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Color', value: 'Ink Black' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/001-4',
        title: 'X-Large / Ink Black',
        price: { amount: '380.00', currencyCode: 'USD', formatted: '$380' },
        availableForSale: false,
        selectedOptions: [
          { name: 'Size', value: 'XL' },
          { name: 'Color', value: 'Ink Black' },
        ],
      },
    ],
    options: [
      { id: 'opt-size', name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { id: 'opt-color', name: 'Color', values: ['Ink Black'] },
    ],
    availableForSale: true,
    totalInventory: 14,
    tags: ['Chapter 02', 'Outerwear', 'Denim'],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
    metafields: {
      chapterNumber: 2,
      editionSize: 50,
      materialComposition: '100% Cotton Selvage (Kuroki Mills, Japan)',
      careInstructions: 'Dry clean only. Do not tumble dry.',
      provenanceCountry: 'Made in Japan',
      serialPrefix: 'OTR-CH2-001',
    },
    seo: {
      title: 'Artifact #001 — Raw Selvage Denim Chore Coat | Otaru',
      description: 'Japanese raw selvage denim chore coat crafted with permanent intention.',
    },
  },
  {
    id: 'gid://shopify/Product/002',
    handle: 'artifact-002-oversized-coat',
    title: 'Artifact #002 — Architectural Double Wool Overcoat',
    description:
      'Precision tailored double-faced virgin wool coat featuring drop-shoulder geometry, horn button closure, and internal chest wallet holster.',
    descriptionHtml:
      '<p>Precision tailored double-faced virgin wool coat featuring drop-shoulder geometry, horn button closure, and internal chest wallet holster.</p>',
    price: {
      amount: '620.00',
      currencyCode: 'USD',
      formatted: '$620',
    },
    compareAtPrice: null,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85',
        altText: 'Architectural Double Wool Overcoat',
        width: 1200,
        height: 1600,
      },
    ],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=85',
      altText: 'Architectural Double Wool Overcoat',
      width: 1200,
      height: 1600,
    },
    variants: [
      {
        id: 'gid://shopify/ProductVariant/002-1',
        title: 'Medium / Stone Gray',
        price: { amount: '620.00', currencyCode: 'USD', formatted: '$620' },
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Color', value: 'Stone Gray' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/002-2',
        title: 'Large / Stone Gray',
        price: { amount: '620.00', currencyCode: 'USD', formatted: '$620' },
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Color', value: 'Stone Gray' },
        ],
      },
    ],
    options: [
      { id: 'opt-size', name: 'Size', values: ['M', 'L'] },
      { id: 'opt-color', name: 'Color', values: ['Stone Gray'] },
    ],
    availableForSale: true,
    totalInventory: 8,
    tags: ['Chapter 02', 'Outerwear', 'Wool'],
    createdAt: '2026-01-18T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
    metafields: {
      chapterNumber: 2,
      editionSize: 30,
      materialComposition: '100% Melton Virgin Wool (Biella, Italy)',
      careInstructions: 'Specialist dry clean only.',
      provenanceCountry: 'Crafted in Italy',
      serialPrefix: 'OTR-CH2-002',
    },
    seo: {
      title: 'Artifact #002 — Architectural Double Wool Overcoat | Otaru',
      description: 'Double-faced virgin wool overcoat with drop-shoulder silhouette.',
    },
  },
  {
    id: 'gid://shopify/Product/007',
    handle: 'artifact-007-heavy-hoodie',
    title: 'Artifact #007 — "The Observer" Heavy Hoodie',
    description:
      'Crafted from 420 GSM heavy French Terry with reactive garment dye, silicone wash, and triple needle flatlock construction.',
    descriptionHtml:
      '<p>Crafted from 420 GSM heavy French Terry with reactive garment dye, silicone wash, and triple needle flatlock construction.</p>',
    price: {
      amount: '180.00',
      currencyCode: 'USD',
      formatted: '$180',
    },
    compareAtPrice: null,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85',
        altText: 'Heavy Hoodie front view',
        width: 1200,
        height: 1600,
      },
    ],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85',
      altText: 'Heavy Hoodie front view',
      width: 1200,
      height: 1600,
    },
    variants: [
      {
        id: 'gid://shopify/ProductVariant/007-1',
        title: 'Medium / Vintage Black',
        price: { amount: '180.00', currencyCode: 'USD', formatted: '$180' },
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'M' },
          { name: 'Color', value: 'Vintage Black' },
        ],
      },
      {
        id: 'gid://shopify/ProductVariant/007-2',
        title: 'Large / Vintage Black',
        price: { amount: '180.00', currencyCode: 'USD', formatted: '$180' },
        availableForSale: true,
        selectedOptions: [
          { name: 'Size', value: 'L' },
          { name: 'Color', value: 'Vintage Black' },
        ],
      },
    ],
    options: [
      { id: 'opt-size', name: 'Size', values: ['M', 'L'] },
      { id: 'opt-color', name: 'Color', values: ['Vintage Black'] },
    ],
    availableForSale: true,
    totalInventory: 24,
    tags: ['Chapter 01', 'Hoodies', 'Cotton'],
    createdAt: '2026-01-18T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
    metafields: {
      chapterNumber: 1,
      editionSize: 150,
      materialComposition: '420 GSM French Terry (100% Organic Cotton)',
      careInstructions: 'Reactive Garment Dye · Silicone Wash. Cold wash.',
      provenanceCountry: 'Made in India',
      serialPrefix: 'OTR-CH1-007',
    },
    seo: {
      title: 'Artifact #007 — "The Observer" Heavy Hoodie | Otaru',
      description: 'Heavyweight organic cotton French Terry hoodie with reactive dye wash.',
    },
  },
];

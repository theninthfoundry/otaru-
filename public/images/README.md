# Otaru Asset Directory

Place your custom photography and media assets here. Next.js automatically serves everything in `public/` from the root URL.

## Directory Structure:
- `public/images/products/` — Product photos (e.g. `041-primary.jpg`, `041-secondary.jpg`, `042-primary.jpg`)
- `public/images/chapters/` — Chapter collection photos (e.g. `chapter-1.jpg`, `chapter-2.jpg`)
- `public/images/hero/` — Hero editorial images
- `public/images/journal/` — Journal cover photos
- `public/images/swatches/` — Textile fabric swatches

## Connecting Assets:
After copying files into these folders, map their filenames in [`src/lib/images.ts`](file:///d:/otaru/src/lib/images.ts).
Example:
```ts
export const PRODUCT_IMAGES: Record<string, ProductImages> = {
  '041': {
    primary: '/images/products/041-primary.jpg',
    secondary: '/images/products/041-secondary.jpg',
    detail: '/images/products/041-detail.jpg',
    alt: 'Yama Field Jacket in Washed Indigo',
  },
};
```

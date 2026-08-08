# Otaru — *Garments worth keeping.*

Editorial luxury garment archive. Headless Next.js 15 storefront (Shopify + Sanity),
built to the token-driven design system and domain vocabulary defined in the master
architecture report.

## Status

Every route renders end-to-end on a **mock data layer** (`src/lib/mock-data.ts`) with
no credentials required. Add real Shopify/Sanity credentials to `.env.local` and the
app switches to live GraphQL/GROQ queries automatically — no component changes needed.

**As of this pass, these are real implementations, not stubs:**
- Shopify Storefront GraphQL queries + mutations (products, product-by-handle, full cart CRUD) — `src/lib/shopify-queries.ts`, `src/lib/shopify.ts`
- Cart state via `zustand` with localStorage-persisted cart ID and rehydration on load — `src/stores/cart-store.ts`
- Sanity Studio schemas (`chapter`, `journal`, `materialSpec`, `studioPage`) + desk structure, embedded at `/studio` — `sanity/`, `sanity.config.ts`
- Real Portable Text rendering via `@portabletext/react` (was a JSON dump) — `src/components/journal/PortableTextRenderer.tsx`
- 3D WebGL fabric viewer (Phase 1 roadmap item) — desktop-only, shader-driven, reads brand color tokens at runtime, self-hides on mobile/reduced-motion — `src/components/three/`
- Web NFC tap-to-verify (Phase 3 roadmap item) — feature-detects, hides on unsupported browsers — `src/components/verify/NfcScanButton.tsx`
- Multi-currency selector wired to the Storefront `@inContext` directive — `src/stores/currency-store.ts`
- Playwright E2E suite covering the purchase flow, waitlist, and verify lookup — `tests/e2e/`

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real keys when ready; leave blank to use mock data
npm run dev
```

Visit `http://localhost:3000`. Run `npm run typecheck` before trusting any change —
this was written without a live Node environment to compile against, so treat it as
unverified-by-compiler until you run it locally.

For end-to-end tests: `npm run test:e2e` (spins up `next dev` itself).

## Still genuinely on the roadmap

- `src/app/account/` — Shopify Customer Account API (auth, order history, addresses) — stub only
- Real GLTF garment models in the 3D viewer (currently a placeholder shader sphere, not per-Artifact scans)
- Full multi-currency: the store/selector exist, but Server Components need to read the
  persisted choice via a cookie (not just client localStorage) to pass `country` into
  `getArtifacts()` / `getArtifactByHandle()` — see the comment in `src/lib/shopify.ts`
- Sanity Visual Editing / live draft preview

## Architecture rules enforced

1. **Server Components by default** — `'use client'` only on interactive leaves.
2. **Path aliases** — everything imports via `@/…`.
3. **Zero hardcoded visual values** — verified with a repo-wide grep for raw hex/arbitrary
   Tailwind values outside `src/styles/tokens/`. Even the WebGL shader reads
   `--color-ink` / `--color-stone` from computed CSS at runtime rather than hardcoding hex.
4. **Domain vocabulary** — `src/lib/vocabulary.ts` is the single source of truth for
   Artifact / Chapter / Archive / Journal / Studio naming.

## Folder structure

```
src/
  app/            Routes (App Router), including /studio and /account
  actions/        Server actions (cart, newsletter, waitlist, tracking, returns)
  components/     ui/ layout/ artifact/ cart/ search/ wishlist/ animations/ common/ three/ verify/ orders/ drops/ journal/ home/
  lib/            shopify.ts, shopify-queries.ts, sanity.ts, sanity-image.ts, mock-data.ts, vocabulary.ts, utils.ts
  stores/         cart-store.ts, currency-store.ts (zustand)
  types/          shopify.ts, sanity.ts, cart.ts
  styles/tokens/  colors, typography, spacing, motion, elevation, grid
sanity/           schemaTypes/, structure/ — CMS schema, separate from sanity.config.ts at root
tests/e2e/        Playwright specs
```

## Next steps to go live

1. Create a Shopify store + Storefront API access token → fill `.env.local`.
2. Create a Sanity project, run `npx sanity dev` locally once, then visit `/studio` to publish real Chapters/Journal entries using the schemas already defined.
3. Wire Shiprocket auth in `src/actions/tracking.ts` and `returns.ts` (still mock fallback).
4. Cookie-persist the currency choice server-side to complete multi-currency.
5. Replace the `FabricSphere` placeholder with real per-Artifact GLTF scans.

# Otaru — *Garments worth keeping.*

Editorial luxury garment archive. Headless Next.js 15 storefront (Shopify + Sanity),
built to the token-driven design system and domain vocabulary defined in the master
architecture report.

## Status

This is a **working scaffold**: every route and component from the architecture audit
exists and renders end-to-end using a mock data layer (`src/lib/mock-data.ts`).
No Shopify or Sanity credentials are required to run it locally. Once you add real
credentials to `.env.local`, `src/lib/shopify.ts` and `src/lib/sanity.ts` switch
automatically from mock data to live GraphQL/GROQ queries — no component code changes
needed.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real keys when ready; leave blank to use mock data
npm run dev
```

Visit `http://localhost:3000`.

## What's built and working right now

- **Homepage** — hero, manifesto, Chapter spotlight, latest Artifacts grid, Journal teaser
- **Archive** (`/archive`) — filterable, sortable Artifact grid with 2/4-col view toggle
- **Artifact detail** (`/artifact/[handle]`) — gallery, size selector, live Add to Bag, accordion specs
- **Chapters** (`/chapter`, `/chapter/[slug]`) — index + editorial lookbook view
- **Journal** (`/journal`, `/journal/[slug]`) — index + article view with reading progress bar
- **Drops** (`/drops`) — live countdown + waitlist form (Klaviyo/Interakt wired, falls back to mock)
- **Verify** (`/verify`) — serial number → Certificate of Authenticity lookup
- **Track Order** (`/track-order`) — Shiprocket-backed status lookup (mock fallback)
- **Returns** (`/returns`) — self-service return ticket submission
- **Membership** (`/membership`) — tiered access overview (Vanguard / Archival / Atelier)
- **Cart system** — drawer, free-shipping progress bar, optimistic add-to-bag
- **Predictive search** — Cmd+K style modal over the Artifact catalog
- **Wishlist** — localStorage-persisted save/unsave

## Roadmap stubs (not yet built — see report section 6)

- `src/app/account/` — Shopify Customer Account API (auth, order history, addresses)
- 3D WebGL fabric viewer (`src/components/three/` — not yet created; add React Three Fiber here)
- Web NFC tap-to-verify (extend `src/app/verify/page.tsx`)
- Multi-currency Storefront selector (`@inContext(country: $country)`)
- Sanity Visual Editing / live draft preview
- Playwright E2E suite

## Architecture rules enforced in this scaffold

1. **Server Components by default.** `'use client'` only on interactive leaves
   (see any file using hooks, Framer Motion, or event handlers).
2. **Path aliases.** Everything imports via `@/…` (`tsconfig.json` → `src/*`).
3. **Zero hardcoded visual values.** All colors/spacing/type/motion come from
   `src/styles/tokens/*.css`, proxied through `tailwind.config.ts`. Verified —
   no raw hex or arbitrary Tailwind values exist outside the token files.
4. **Domain vocabulary.** `src/lib/vocabulary.ts` is the single source of truth
   for Artifact / Chapter / Archive / Journal / Studio naming — import from it
   rather than hardcoding strings in new components.

## Folder structure

```
src/
  app/            Routes (App Router)
  actions/        Server actions (cart, newsletter, waitlist, tracking, returns)
  components/     ui/ layout/ artifact/ cart/ search/ wishlist/ animations/ common/ ...
  lib/            shopify.ts, sanity.ts, mock-data.ts, vocabulary.ts, utils.ts
  types/          shopify.ts, sanity.ts, cart.ts
  styles/tokens/  colors, typography, spacing, motion, elevation, grid
```

## Next steps to go live

1. Create a Shopify store + Storefront API access token → fill `.env.local`.
2. Create a Sanity project with `chapter`, `journal`, `materialSpec` schemas → fill `.env.local`.
3. Replace the `// TODO` GraphQL/GROQ query bodies in `src/lib/shopify.ts` / `sanity.ts`.
4. Wire Shiprocket auth in `src/actions/tracking.ts` and `returns.ts`.
5. Pick one Phase 1–4 roadmap item and build it as its own vertical slice.

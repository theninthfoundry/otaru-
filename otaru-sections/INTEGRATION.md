# Wiring this into `theninthfoundry/otaru-`

Everything here was designed to sit **beside** your existing code, not replace it.
Your Hero is untouched. Nothing here talks to Shopify, Sanity, or a database —
every list (`DROPS`, `CHAPTERS`, `TIERS`, `POSTS`) is static placeholder data
you swap for your real fetch.

## 1. Files → where they go

Copy `components/*` into your existing `src/components/` tree (merge folders
if you already have `ui/`, `layout/`, `home/` etc.). Copy `examples/app/*`
into `src/app/` **only as reference** — don't overwrite your real `page.tsx`;
diff it in by hand so you keep whatever's already in your homepage.

```
src/components/ui/ImagePlaceholder.tsx
src/components/ui/SectionHeading.tsx
src/components/ui/RevealOnScroll.tsx
src/components/ui/MoonProgress.tsx
src/components/layout/SiteHeader.tsx      <- compare against your current nav first
src/components/layout/SiteFooter.tsx
src/components/home/NewDrops.tsx
src/components/home/ChapterShowcase.tsx
src/components/home/ArchiveTeaser.tsx
src/components/home/StoryJourney.tsx
src/components/home/Craftsmanship.tsx
src/components/home/Philosophy.tsx
src/components/home/MembershipTeaser.tsx
src/components/home/JournalTeaser.tsx
src/components/home/NewsletterSignup.tsx
src/components/auth/SignInForm.tsx
src/components/account/ProfileDashboard.tsx
```

## 2. Dependencies

These assume `framer-motion` and `clsx` are already installed, since a
motion-driven, token-based site like this almost always has them. If not:

```bash
npm install framer-motion clsx
```

## 3. Design tokens

Merge `styles/tokens.css` into your real token file(s) under
`src/styles/tokens/`. If you're on Tailwind, add matching entries to
`tailwind.config.ts` so you can use `bg-otaru-ink` etc. instead of the
`bg-[var(--otaru-ink)]` arbitrary-value form used throughout (arbitrary
values work fine either way — this is a preference, not a requirement):

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      "otaru-ink": "var(--otaru-ink)",
      "otaru-dusk": "var(--otaru-dusk)",
      "otaru-dusk-2": "var(--otaru-dusk-2)",
      "otaru-gold": "var(--otaru-gold)",
      "otaru-gold-dim": "var(--otaru-gold-dim)",
      "otaru-parchment": "var(--otaru-parchment)",
      "otaru-torii": "var(--otaru-torii)",
    },
    fontFamily: {
      display: ["var(--font-display)"],
      body: ["var(--font-body)"],
    },
  },
},
```

## 4. Fonts — use `next/font`, not a `<link>` tag

`preview.html` loads Newsreader + Inter from `fonts.googleapis.com` for a
standalone preview. In the real app, self-host them with `next/font/google`
instead — it avoids the external request entirely, which matters once you
tighten CSP (section 13 of your directive):

```ts
// app/layout.tsx
import { Newsreader, Inter } from "next/font/google";

const display = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

// <body className={`${display.variable} ${body.variable}`}>
```

## 5. Mount the moon-phase scroll indicator once

In your root layout, outside any single page:

```tsx
import { MoonProgress } from "@/components/ui/MoonProgress";
// ...
<MoonProgress hidden={pathname === "/sign-in"} />
```

## 6. Replace placeholders with real art

Every image slot renders through `<ImagePlaceholder ratio="..." label="..." />`.
When an asset is ready, swap that one call for:

```tsx
<div className="relative aspect-[4/5] overflow-hidden">
  <Image src={artifact.image} alt={artifact.name} fill className="object-cover" />
</div>
```

The `ratio` values used throughout (`portrait` 4:5, `wide` 16:9, `tall` 3:4,
`square`, `swatch`) tell you the aspect ratio to shoot or crop for.

## 7. `SiteHeader` — check before replacing

Your repo already has a nav (visible in your screenshots, with a working
transparent→solid transition and a mobile hamburger). `SiteHeader.tsx` here
is a full replacement candidate, but diff it against what you have first —
you may only need to port the active-state underline and the focus-visible
styling over rather than swap the whole component.

## 8. Cart

```
lib/types/cart.ts               <- Cart / CartLine types
lib/cart/cart-context.tsx       <- CartProvider + useCart() — client state, server is truth
components/cart/CartButton.tsx  <- header icon + item-count badge, opens the drawer
components/cart/CartDrawer.tsx  <- slide-in panel: lines, subtotal, checkout CTA, empty state
components/cart/CartLineItem.tsx<- quantity stepper + remove, per line
app/api/cart/route.ts           <- GET/POST — the ONLY place price/stock/subtotal are computed
```

Wrap your root layout in `<CartProvider>` (see `examples/app/layout.tsx`). The
important thing to preserve when you wire this to your real Prisma/Shopify
data: `app/api/cart/route.ts` never reads a price or stock number from the
request body — it looks both up itself via `getArtifactPriceAndStock()`,
which is a mock function you should replace with your real lookup. The
client (`cart-context.tsx`) only ever *displays* whatever the server
returns; it patches the UI optimistically for responsiveness, then
overwrites that patch with the server's actual response — including
rolling back if the request fails (e.g. the last one just sold out).

The in-memory `CARTS` map in the route is a placeholder — swap it for your
real store before this touches production traffic; as written it resets on
every server restart and won't work across multiple instances.

## 9. Search

```
lib/search/types.ts          <- SearchableRecord / SearchResult
lib/search/fuzzy-search.ts   <- the ranking algorithm itself (exact → prefix → substring → fuzzy subsequence)
lib/search/search-index.ts   <- DEMO_INDEX — replace with your real Artifact/Chapter/Journal data
lib/utils/debounce.ts        <- generic debounce, used elsewhere if you need it
hooks/useSearch.ts           <- debounced hook wrapping the algorithm, with stale-response guarding
components/search/SearchModal.tsx <- Cmd+K palette: keyboard nav, grouped results
```

`fuzzy-search.ts` has no dependency (no Fuse.js/Algolia) — it's a real
scored matcher (exact → starts-with → substring-with-position-bonus →
fuzzy subsequence with a compactness/earliness/run bonus), multi-word
queries require every token to match *something*, and results are ranked
by weighted field (title > subtitle > keyword). It's sized for the
few-hundred-to-low-thousands record range your mock catalog is currently
at. If the real archive ever gets meaningfully bigger than that, keep the
types and swap `search()`'s body for a real search service — the modal and
hook don't need to change.

Wire the search trigger: `SiteHeader`'s search button now dispatches an
`otaru:open-search` window event; `SearchModal` listens for it (and for
Cmd/Ctrl+K globally) so there's no prop drilling. Mount `<SearchModal />`
once near the root layout, same as `<MoonProgress />` (see
`examples/app/layout.tsx`).

## 10. The four full nav pages

The homepage sections (New Drops, Chapter showcase, Archive teaser, Journal
teaser) are previews. These are the real destinations the nav links to:

```
app/archive/page.tsx          <- filterable/sortable/paginated catalog
app/journal/page.tsx          <- featured post + full grid
app/studio/page.tsx           <- story, timeline, values, team, visit info
app/chapters/page.tsx         <- every chapter, current and archived

components/archive/ArchiveFilters.tsx   <- category + sort, writes to URL search params
components/archive/ArchiveGrid.tsx      <- results grid + pagination + empty state
components/journal/JournalGrid.tsx      <- featured post + grid
components/studio/Timeline.tsx
components/studio/ValuesList.tsx
components/studio/TeamGrid.tsx
components/chapters/ChapterIndexGrid.tsx
```

`app/archive/page.tsx` reads `?category=&sort=&page=` server-side and
filters/sorts/paginates the mock catalog there — replace `MOCK_CATALOG`
with your real query using the same params, and the URL-driven filtering
(shareable, survives a refresh) carries over unchanged.

`ArchiveFilters` calls `useSearchParams()`, so it's wrapped in
`<Suspense>` in the page — that's a Next.js App Router requirement for any
client component reading search params, not optional scaffolding.

`ImagePlaceholder` now accepts an optional `children` prop (used for the
"Sold out" / "Archived" badges on the Archive and Chapters grids) — pull
the latest version of that file if you copied it in before this update.

## 11. What this pass does *not* cover

The build directive you shared also asks for a full security/commerce audit —
Razorpay signature verification, webhook idempotency, an outbox pattern,
Redis rate limiting, CSP nonces. Your repo's own README doesn't show any of
that existing yet (it's currently on a mock data layer with no live
Shopify/Sanity credentials wired up), so there's nothing there for this pass
to harden. That work — real payment verification, auth, and the database
schema — needs an environment that can actually run your build and tests,
which this chat can't do. Claude Code is the right tool for that half.

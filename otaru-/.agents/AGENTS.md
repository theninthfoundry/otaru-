# Otaru — Agent Rules

## Identity
Otaru is a luxury fashion design house. Not a "store" — a curated experience.
Tagline: "Garments worth keeping."

## Vocabulary (MANDATORY)
| Commerce term  | Otaru term     |
|---------------|----------------|
| Product       | **Artifact**   |
| Collection    | **Chapter**    |
| Catalog       | **Archive**    |
| Blog          | **Journal**    |
| About         | **Studio**     |
| New Arrivals  | Latest Chapter |
| Sold Out      | Archive Sold   |

These terms: bag, checkout, size, price, order — stay in plain language. Clarity over poetry.

## Tech Stack
- **Framework**: Next.js 15 App Router + React 19 + TypeScript
- **Styling**: Tailwind CSS 3.4 + CSS custom properties (design tokens)
- **Animations**: Framer Motion + GSAP ScrollTrigger + Lenis smooth scroll
- **3D**: React Three Fiber + Drei + Three.js (lazy-loaded, desktop only)
- **CMS**: Sanity v3 (embedded studio at `/studio`)
- **Commerce**: Shopify Storefront API (headless)
- **Fonts**: Inter Variable (body) + Instrument Serif (display)

## Architecture Rules

### Server vs Client
- Default to **Server Components**. Only add `'use client'` when the component needs:
  - `useState`, `useEffect`, `useContext`, event handlers, browser APIs
  - Framer Motion `motion.*` elements
  - Three.js / R3F canvas
- Never put `'use client'` on a page.tsx that can be server-rendered.

### File Organization
```
src/
  app/             # Routes only. Minimal logic. Compose from components.
  components/
    ui/            # Atomic: Button, Badge, Pill, Modal, Drawer
    layout/        # Header, Footer, MegaMenu, MobileNav
    animations/    # RevealText, SplitText, Marquee, AnimatedParagraph
    three/         # R3F components (CanvasWrapper, Particles, Sphere)
    hero/          # Homepage hero + sub-components
    artifact/      # Product-related (ArtifactCard, Gallery, Variants)
    chapter/       # Collection-related
    journal/       # Blog/editorial
    editorial/     # Manifesto, PullQuote, FullBleed
    cart/           # Cart system
    wishlist/       # Wishlist system
    search/         # Search modal
    drops/          # Countdown, waitlist
    provenance/     # Authenticity
    common/         # ErrorBoundary, Image, Lenis, Loader, SEO
  hooks/           # Custom hooks (useReveal, useParallax, useMagnetic, etc.)
  lib/             # Utilities, API clients, constants, tokens
  actions/         # Server Actions
  styles/          # globals.css + tokens/*.css
  types/           # Type re-exports
```

### Import Aliases
Always use `@/` path aliases:
```ts
import { Button } from '@/components/ui/button';
import { useReveal } from '@/hooks/use-reveal';
import { cn } from '@/lib/utils';
```

### Naming
- Files: `kebab-case.tsx`
- Components: `PascalCase`
- Hooks: `use-kebab-case.ts` → exports `useCamelCase()`
- Types: `PascalCase`, suffixed with purpose (`Props`, `Config`, `State`)

## Design Token System
All visual values come from CSS custom properties in `src/styles/tokens/`:
- `colors.css` — Ink/Chalk/Cream/Stone palette
- `typography.css` — Display/Heading/Body/Caption/Overline scale
- `motion.css` — 4-level motion system
- `spacing.css` — 4px base unit
- `grid.css` — 12-column responsive grid
- `elevation.css` — Subtle shadows
- `breakpoints.css` — mobile/tablet/desktop/wide

**Never hardcode colors, font sizes, or spacing.** Always reference tokens via Tailwind classes or CSS variables.

## Motion Levels
| Level | Use Case | Duration | Example |
|-------|----------|----------|---------|
| 0 — Instant | Buttons, forms, checkout | 0ms | Size selector click |
| 1 — Subtle | Cards, images, nav | 150–300ms | Card hover, nav link |
| 2 — Editorial | Homepage, Journal, Chapter | 600–900ms | Scroll reveals, section enters |
| 3 — Immersive | Hero, 3D scenes | 1200ms+ | Camera moves, R3F animations |

All animations must respect `prefers-reduced-motion`.

## Component Conventions
- Every component must be typed (`interface ComponentProps {}`)
- Include JSDoc comment describing purpose
- Use `cn()` for conditional class merging
- Use semantic HTML (`section`, `article`, `nav`, `aside`)
- Include `id` and `aria-label` on sections
- Support `className` prop for composition
- Use Framer Motion `motion.*` for client-side animations
- Use GSAP only inside `useEffect` / `useLayoutEffect` with proper cleanup

## Performance Rules
- Lazy-load 3D components with `next/dynamic` + `ssr: false`
- Use `loading="lazy"` on below-fold images
- Use Next.js `<Image>` for optimized images
- Code-split with dynamic imports for heavy components
- Keep Lighthouse > 95 on pages without 3D
- 3D scenes: adaptive DPR, Suspense boundaries, mobile fallbacks

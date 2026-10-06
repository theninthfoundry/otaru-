# HOUSE OF OTARU — AGENT OPERATING MANIFESTO (AGENTS.MD)

> **Identity**: Otaru is an editorial luxury garment archive and digital maison combining Japanese material restraint with Indian textile heritage. A commerce system disguised as an archive.

---

## 1. Engineering Rules & Code Quality
- **Language & Runtime**: Strict TypeScript (`strict: true`). Zero implicit or explicit `any`.
- **Framework Idioms**: Next.js 15 App Router. Use React Server Components (RSC) by default; only declare `'use client'` when state, event listeners, or browser APIs are required.
- **Component Architecture**: Keep components small, focused, and composable. Avoid premature abstractions or god-components.
- **Dependencies**: Never introduce a new npm package without explicit architectural justification. Leverage the existing project stack.
- **Security & Data Integrity**: Never expose sensitive keys or server logic in client bundles. Respect server-enforced access control and idempotent checkout invariants.

---

## 2. Motion & Physics Rules
- **Stack Division**:
  - **GSAP (`@gsap/react`, `gsap`)**: Dedicated to complex multi-element timelines, hero entrance sequences, scroll-triggered pins, and canvas choreography.
  - **Framer Motion (`framer-motion`)**: Dedicated to local UI state transitions, modal entrances/exits, drawer sliders, and hover micro-interactions.
  - **Lenis (`lenis`)**: Dedicated to smooth inertial scrolling. Always synchronize Lenis scroll ticks with GSAP ScrollTrigger when both are active.
- **Cinematic Restraint**:
  - Avoid gratuitous bounce, cartoony elastic springs, or fast spinning animations.
  - Animations must emulate real physical mass: heavy textile weight, slow camera dolly pans, quiet fades, and mechanical precision.
- **Accessibility**: Strictly honor `prefers-reduced-motion`. Provide instantaneous state transitions when motion is disabled.

---

## 3. Design & Luxury Aesthetic
- **Visual Identity**:
  - Curated, muted palette: Japanese indigo, aged Deccan limestone, raw ecru, canal brick red, blackened steel, and handmade paper tones.
  - Avoid generic AI-generated layouts, over-saturated gradients, or off-the-shelf component styling.
  - High editorial typography: generous line-heights, deliberate tracking, monospaced archival codes (`ARC-041-YMA`), and asymmetric editorial balance.
- **Materiality**:
  - Emphasize raw texture: tactile woven slubs, boro repairs, waxed cotton water-repulsion, and brass hardware patina.
  - Zero placeholder images. Every visual must belong to the Otaru archive.

---

## 4. 3D & Spatial Experiences
- **WebGL Stack**: Three.js (`three`), React Three Fiber (`@react-three/fiber`), and Drei (`@react-three/drei`).
- **Performance**:
  - Lazy load 3D canvases using Next.js `dynamic(..., { ssr: false })`.
  - Cap canvas pixel ratio at `Math.min(window.devicePixelRatio, 2)` to protect mobile battery life and thermals.
  - Gracefully degrade if WebGL is unavailable.

---

## 5. QA & Verification Checklist
Before declaring any task or feature complete:
1. **Type Safety**: Verify TypeScript passes without diagnostics (`npm run typecheck`).
2. **Browser Validation**: Test responsive layouts across mobile (390px), tablet (768px), and widescreen desktop (1440px+).
3. **Console Cleanliness**: Ensure zero hydration mismatches, uncaught errors, or React warning banners in DevTools.
4. **Interactive Reliability**: Confirm drawers, modals, checkout inputs, and image fallbacks function as expected under slow network conditions.

# QA Report

**Date:** 2026-10-04  
**Branch:** `redesign/two-harbours`

## 1. Visual & Interaction Audit

| Component | Status | Notes |
|---|---|---|
| **Thread Animation** | ✅ PASS | ScrollTrigger drives SVG path correctly. Reduced motion disables it gracefully. |
| **Hero Typographic Layout** | ✅ PASS | clamp() scales correctly across 360px to 1440px. |
| **Waitlist Inline Form** | ✅ PASS | Input width responds correctly on mobile. |
| **DoorButton (Tadaima -> Okaeri)** | ✅ PASS | State machine fires correctly. Text swap animates cleanly. |
| **CraftPair Interaction** | ✅ PASS | Hover/Click reveals the shared idea plate. Smooth transition on opacity. |
| **Stamp** | ✅ PASS | Viewport intersection triggers rotation and scale-in. |
| **DropChip** | ✅ PASS | Pulse animation on 'early-access' state functions correctly. |

## 2. Technical Audit

| Area | Status | Notes |
|---|---|---|
| **Bundle Size** | ⚠️ WARN | Unused packages (three.js, etc.) are still in package.json but not imported in the new routes. Need to run `npm uninstall` before production. |
| **Middleware Redirects** | ✅ PASS | 301 redirects implemented for legacy routes (`/archive`, `/membership`, etc.) |
| **Build Guard** | ✅ PASS | `scripts/check-claims.ts` catches `[CONFIRM]` and `todo` tags. |
| **Prisma Schema** | ✅ PASS | `Resident` model appended. Requires `npx prisma generate` and `npx prisma db push` before running the waitlist API. |
| **Next/OG Card Gen** | ✅ PASS | Edge-compatible SVG/HTML rendering configured for `/api/card/[number]`. |

## 3. Accessibility & SEO

| Check | Status | Notes |
|---|---|---|
| **Contrast Ratios** | ✅ PASS | `--madder` on `--paper` exceeds 4.5:1. `--ink/60` on `--paper` is legible. |
| **Keyboard Navigation** | ✅ PASS | Focus states managed. `Skip to content` link present in layout. |
| **Reduced Motion** | ✅ PASS | CSS `@media (prefers-reduced-motion)` zeroes out animation durations. Thread logic checks `window.matchMedia`. |
| **Metadata** | ✅ PASS | Titles and OG images dynamic per-resident page. |

## 4. Known Issues for Pre-Launch

1. The API route for the waitlist will fail until the database is provisioned and the schema is pushed.
2. The `package.json` needs cleaning to remove the ~200KB of 3D dependencies left over from the old build.
3. The build guard is designed to intentionally fail the Vercel build right now because there are `[CONFIRM]` tags in the content files. This is working as intended.

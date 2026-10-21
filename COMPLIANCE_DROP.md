# Compliance + footer + 404 drop

Apply: copy these files over the repo (paths mirror the root), review `git diff`, commit on a branch.
Typechecked with `tsc --noEmit` (strict) — no new dependencies.

## New
- `content/legal.ts` — business identity + policy copy. Every `[CONFIRM]` must be replaced with a real fact.
  `npm run build` runs `scripts/check-claims.mjs` and FAILS while any `[CONFIRM]` remains. This is intentional.
- `src/app/[policy]/page.tsx` — serves /refunds /cancellation /cookies /accessibility /grievance /contact
  (`dynamicParams = false`, so every other unknown URL returns a real 404).
- `src/components/legal/LegalDocument.tsx`
- `src/lib/consent/consent.ts`, `src/components/consent/CookieConsent.tsx` — opt-in consent (cookie `otaru_consent`).
- `src/components/ui/StitchedWordmark.tsx` (embroidery), `src/components/ui/SeigaihaBand.tsx`
- `src/app/not-found.module.css`, `public/images/404/wanderer.jpg` (+ PROVENANCE.md)

## Changed
- `src/lib/analytics/provider.tsx` — GA4/Clarity need Analytics consent; Meta Pixel needs Marketing consent.
- `src/components/providers/AppProviders.tsx` — mounts the banner.
- `src/components/layout/SiteFooter.tsx` — Japanese details, embroidered wordmark, all policy links,
  "Cookie preferences", newsletter consent checkbox, removed the unverified "DPDP compliant" label.
- `src/actions/newsletter.ts`, `src/app/api/newsletter/route.ts` — server rejects sign-ups without consent.
- `src/app/not-found.tsx` — new creative 404 (real 404 status).
- `src/app/sitemap.ts`, `src/app/privacy/page.tsx` (removed "DPDP Compliant" claim).
- `public/preview.html` — the homepage prototype with the same footer/404, invented reviews/community photos
  removed, unverifiable promises replaced by links to policies, countdown hidden until a real date is set.

## Still on you (cannot be completed in code)
Legal name, address, GSTIN, grievance officer, phone, return/refund windows, preorder rules, real product
declarations (Legal Metrology), image licence for the 404 photo, and an Indian lawyer/CA review.

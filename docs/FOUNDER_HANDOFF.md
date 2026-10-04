# Founder Handoff

Welcome to the new House of Otaru architecture. This repository has been completely rebuilt to reflect the "Two Harbours" truth. 

## The Build Guard

To prevent any fictional heritage claims or placeholder text from accidentally going live, we have implemented a **Build Guard**. 

If you try to deploy this code right now, **it will fail**. This is intentional.

Before you can deploy to production, you must:

1. Open the files in the `content/` directory:
   - `content/site.ts`
   - `content/drop01.ts`
   - `content/claims.ts`
   - `content/craft-pairs.ts`
   - `content/strings.ts`
2. Search for the text `[CONFIRM]`.
3. Replace every instance of `[CONFIRM]` with real, factual data.
4. In `content/claims.ts`, change any `status: 'todo'` to `status: 'confirmed'` once you verify the claim is true.

The build guard (`scripts/check-claims.ts`) runs automatically on `npm run build`. Once all placeholders are resolved, the build will pass.

## The Waitlist (Residents)

The waitlist system is now backed by your own database using Prisma. 

Before opening the waitlist:
1. Ensure your `DATABASE_URL` is set in your `.env`.
2. Run `npx prisma db push` to create the `residents` table in your database.
3. Run `npx prisma generate` to update the TypeScript client.

When a user joins the waitlist, they receive an allocation number and a unique referral code. They are then redirected to a shareable Resident Card page (`/residents/[number]`) which generates a dynamic OpenGraph image so it looks beautiful when shared on iMessage or Twitter.

## Design System

The visual language is defined entirely in `src/styles/tokens.css`. We use CSS variables rather than Tailwind classes for colors and typography to maintain strict control over the brand's aesthetic.

- **Colors:** `--paper`, `--ink`, `--indigo`, `--madder`, `--turmeric`
- **Typography:** Shippori Mincho (Display), Hanken Grotesk (Body), DM Mono (Details), Tiro Devanagari Hindi (Hindi Script)

To change a color or font globally, edit `tokens.css`.

---
*End of Phase 9. The codebase is now yours.*

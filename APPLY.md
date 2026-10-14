# Otaru hardening drop — how to apply

Paths mirror the repo root. Copy over, review the diff, commit on a branch.

    git checkout -b hardening-payments
    # 1. security-critical upgrade FIRST (current pin is next 15.0.3 / react 19.0.0 — vulnerable)
    npm i next@latest react@latest react-dom@latest
    npx @next/codemod@canary upgrade latest      # Next 16: middleware -> proxy, async APIs, etc.
    # 2. new deps
    npm i zod razorpay @upstash/ratelimit @upstash/redis server-only @prisma/client@6
    npm i -D prisma@6
    # 3. copy this folder's files into the repo (overwrites next.config.mjs and .env.example)
    # 4. database
    cp .env.example .env.local   # fill DATABASE_URL, DIRECT_DATABASE_URL, Razorpay TEST keys
    npx prisma migrate dev --name init
    # 5. seed prisma Variant rows from your catalog (price in paise), then
    npm run typecheck && npm run build

Razorpay dashboard: webhook URL = https://<your-domain>/api/webhooks/razorpay,
events = payment.captured, order.paid, payment.failed, refund.processed.

Collision check before copying: src/middleware.ts, src/app/api/**, vercel.json may already exist — merge, don't overwrite.
Next 16 removed `next lint`: change the "lint" script to `eslint .`.

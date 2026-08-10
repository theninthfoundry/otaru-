# Otaru Master Release Candidate Git Commit Script

Write-Host "=== Staging All Master Release Candidate Changes ===" -ForegroundColor Green

git add .

$commitMessage = @"
feat(release-candidate): achieve official Otaru Release Candidate status

- Security Hardening: Enforced strict production check rejecting mock payment signatures with 403 Forbidden in /api/checkout/razorpay/verify.
- Gateway Resilience: Configured /api/checkout/razorpay/order to fail-fast with HTTP 503 Service Unavailable when payment gateway API fails.
- Distributed Edge Limiting: Migrated middleware.ts to Upstash Redis edge rate limiting with fail-closed production policy for checkout and admin paths.
- Admin Authorization: Enforced mandatory Bearer token authentication guard on all /admin/* and /api/admin/* routes.
- Zero Production Deception: Updated Shopify queries to return null on error (triggering 404) and removed fake NFC tag simulation on unsupported devices.
- Adaptive Mobile WebGL: Implemented low-DPR mobile 3D WebGL profile (dpr={[0.75, 1]}) in CanvasWrapper.tsx.
- Distributed Nonce Store: Migrated single-use payment nonces to Upstash Redis (issueNonceAsync & consumeNonceAsync).
- Safety-Net Reconciler: Created runPaymentReconciliation() engine cross-auditing Razorpay payments, PostgreSQL orders, inventory locks, and outbox events.
- Production Invariant Scanner: Built static AST scanner and ENV matrix checker integrated into npm run production:verify.
- Documentation Redesign: Rewrote master README.md into a world-class 30-section digital house documentation experience.
"@

git commit -m "$commitMessage"

Write-Host "=== Pushing Release Candidate Commit to Origin Main ===" -ForegroundColor Green

git push

Write-Host "=== Master Release Candidate Successfully Committed & Pushed ===" -ForegroundColor Green

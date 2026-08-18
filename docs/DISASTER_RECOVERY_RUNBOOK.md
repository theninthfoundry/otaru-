# Otaru Artifact OS — Disaster Recovery Runbook

This operational runbook details recovery objectives, disaster scenarios, and step-by-step mitigation workflows for mission-critical incidents.

---

## 🎯 Recovery Objectives (SLOs)

* **RPO (Recovery Point Objective)**: $< 5\text{ minutes}$ (Max tolerable transactional data loss).
* **RTO (Recovery Time Objective)**: $< 30\text{ minutes}$ (Max tolerable service downtime).
* **Financial Ledger Loss**: $0\text{ bytes}$ (Zero tolerance for unrecorded payments or lost audit events).

---

## 🚨 Incident Scenarios & Response Runbooks

### 1. Database Failure / Corruption
1. **Engage Maintenance / Drop Kill-Switch**:
   ```bash
   # Engage emergency kill switch to prevent inbound orders
   curl -X POST https://otaru.co/api/admin/kill-switch -H "Authorization: Bearer $ADMIN_SECRET"
   ```
2. **Promote Read Replica or Restore Point-in-Time Backup**:
   * Restore PostgreSQL instance to latest verified snapshot ($<5$ min).
3. **Verify Cryptographic Audit Hash Chain**:
   * Run `ArtifactLedger.verifyTimelineIntegrity()` to confirm no hash breakage.
4. **Reconcile Payment State**:
   * Trigger `/api/cron/reconcile` to compare restored database state with live Razorpay gateway transactions.
5. **Resume Outbox Workers**:
   * Execute `WorkerLeaseManager.reclaimExpiredLeases()` and restart event drainers.

---

### 2. Redis Edge Rate Limiter Outage
* **Failure Mode**: Middleware automatically fails open for general browsing and fails closed for `/api/checkout` to protect inventory invariants.
* **Remediation**:
  1. Switch `UPSTASH_REDIS_REST_URL` to standby regional replica.
  2. Edge middleware recovers automatically without requiring application redeployment.

---

### 3. Payment Gateway (Razorpay) Timeout / Network Partition
* **Failure Mode**: In-flight checkouts fail gracefully; webhook store queues pending events.
* **Remediation**:
  1. Payment state machine retains `PAYMENT_INIT` state.
  2. Incoming webhooks are received by `WebhookEventStore` and safely ingested for delayed processing.
  3. `FinancialControlPlane` automatically flags any captured transactions missing local confirmation for automated resolution.

import { describe, it, expect } from 'vitest';
import { OrderStateMachine } from '@/lib/commerce/order-state-machine';
import { PaymentStateMachine } from '@/lib/payments/payment-state-machine';
import { PhysicalInventoryEngine } from '@/lib/inventory/reservation-engine';
import { ArtifactLedger } from '@/lib/provenance/artifact-ledger';
import { NFCProvenanceAuth } from '@/lib/provenance/challenge-response';
import { WebhookEventStore } from '@/lib/webhooks/event-store';
import { WebhookGateway } from '@/lib/webhooks/webhook-gateway';
import { WorkerLeaseManager } from '@/lib/queue/worker-lease';
import { EventReplayEngine } from '@/lib/queue/replay-engine';
import { FinancialControlPlane } from '@/lib/payments/financial-control-plane';
import { VirtualWaitingRoom } from '@/lib/drops/waiting-room';
import { DropOrchestrator } from '@/lib/drops/drop-orchestrator';
import { RiskEngine } from '@/lib/security/risk-engine';
import { RBACEngine } from '@/lib/security/rbac';
import { DualControlWorkflow } from '@/lib/security/dual-control';
import { ProviderCircuitBreaker } from '@/lib/resilience/provider-circuit-breaker';

describe('Otaru Artifact OS — P0 & P1 Core Subsystems Verification', () => {
  describe('1. Order State Machine', () => {
    it('allows legal forward transitions and rejects illegal backward jumps', async () => {
      const orderId = 'ORD-TEST-001';

      // CREATED -> RESERVED (Legal)
      const res1 = await OrderStateMachine.transition(orderId, 'CREATED', 'RESERVED', {
        actor: 'customer:test@otaru.co',
        reason: 'Item added to bag',
        correlationId: 'corr_001',
      });
      expect(res1.success).toBe(true);
      expect(res1.newState).toBe('RESERVED');

      // RESERVED -> SHIPPED (Illegal jump - must go through PAYMENT_INIT, PAID, CONFIRMED, PACKING)
      const res2 = await OrderStateMachine.transition(orderId, 'RESERVED', 'SHIPPED', {
        actor: 'admin:bad_actor',
        reason: 'Illegal fast forward',
        correlationId: 'corr_002',
      });
      expect(res2.success).toBe(false);
      expect(res2.error).toContain('Illegal order state transition');

      // Verify history
      const history = OrderStateMachine.getHistory(orderId);
      expect(history.length).toBe(1);
      expect(history[0].fromState).toBe('CREATED');
      expect(history[0].toState).toBe('RESERVED');
    });
  });

  describe('2. Payment State Machine & Invariant Guard', () => {
    it('captures payment and blocks refunds exceeding captured volume', async () => {
      const payment = PaymentStateMachine.createPayment('PAY-001', 'ORD-001', 'RAZORPAY', 'rzp_order_123', 50000);
      expect(payment.state).toBe('INITIALIZED');

      // Capture
      const capRes = await PaymentStateMachine.capture('PAY-001', 'rzp_pay_999', 'corr_pay_01');
      expect(capRes.success).toBe(true);
      expect(capRes.record?.state).toBe('CAPTURED');

      // Partial refund ($200.00 -> 20,000 minor)
      const refRes1 = await PaymentStateMachine.refund('PAY-001', 20000, 'Customer requested size exchange', 'corr_pay_02');
      expect(refRes1.success).toBe(true);
      expect(refRes1.record?.state).toBe('PARTIALLY_REFUNDED');
      expect(refRes1.record?.refundedMinor).toBe(20000);

      // Excessive refund ($400.00 -> 40,000 minor; total would be 60,000 > 50,000)
      const refRes2 = await PaymentStateMachine.refund('PAY-001', 40000, 'Excessive refund attempt', 'corr_pay_03');
      expect(refRes2.success).toBe(false);
      expect(refRes2.error).toContain('Financial Invariant Violation');
    });
  });

  describe('3. Physical Inventory Reservation & Allocation Engine', () => {
    it('manages serialized units and allocates them to confirmed orders', async () => {
      const units = PhysicalInventoryEngine.registerUnits('selvage-denim', 'size-m', 5, 101);
      expect(units.length).toBe(5);
      expect(units[0].serialNumber).toBe('OTARU-SEL-101');

      // Reserve 2 units
      const res = PhysicalInventoryEngine.reserveUnits('selvage-denim', 'size-m', 2, 'cart_alpha_123', 600);
      expect(res.success).toBe(true);
      expect(res.reservedUnits.length).toBe(2);

      // Allocate to confirmed order
      const alloc = await PhysicalInventoryEngine.allocateToOrder(
        [res.reservedUnits[0].serialNumber, res.reservedUnits[1].serialNumber],
        'ORD-CONFIRMED-99',
        'corr_alloc_01'
      );
      expect(alloc.success).toBe(true);
      expect(alloc.allocatedUnits[0].state).toBe('ALLOCATED');
      expect(alloc.allocatedUnits[0].allocatedOrderId).toBe('ORD-CONFIRMED-99');
    });
  });

  describe('4. 16-State Artifact Provenance Ledger', () => {
    it('chains milestones with SHA-256 cryptographic hashes and verifies integrity', async () => {
      const serial = 'OTARU-DEN-101';

      await ArtifactLedger.recordMilestone(serial, 'ARTIFACT_CREATED', {
        actor: 'atelier:master_weaver',
        details: '14.5oz raw selvage woven on vintage Toyoda G3 shuttle loom',
        location: 'Kojima, Okayama',
      });

      await ArtifactLedger.recordMilestone(serial, 'QUALITY_CHECKED', {
        actor: 'inspector:04',
        details: 'Passed structural tension, dye uniformity, and seam tension inspection',
      });

      await ArtifactLedger.recordMilestone(serial, 'NFC_BOUND', {
        actor: 'atelier:nfc_station',
        details: 'Bound to hardware encrypted NFC chip UID 04:A2:3B:19',
      });

      const timeline = ArtifactLedger.getTimeline(serial);
      expect(timeline.length).toBe(3);
      expect(timeline[1].prevHash).toBe(timeline[0].entryHash);
      expect(timeline[2].prevHash).toBe(timeline[1].entryHash);

      const verification = ArtifactLedger.verifyTimelineIntegrity(serial);
      expect(verification.isValid).toBe(true);
      expect(verification.verifiedEntries).toBe(3);
    });
  });

  describe('5. Hardware NFC Challenge-Response Anti-Counterfeit Auth', () => {
    it('issues nonces and validates cryptographic responses against hardware seed', async () => {
      const serial = 'OTARU-ARC-777';
      NFCProvenanceAuth.registerCertificate(serial, '1 of 50', '04:88:99:AA', 'patron@otaru.co');

      const challenge = NFCProvenanceAuth.issueChallenge(serial);
      expect(challenge.challengeId).toBeDefined();
      expect(challenge.nonce).toBeDefined();

      // Verify dev proof response
      const verifyRes = await NFCProvenanceAuth.verifyResponse(
        challenge.challengeId,
        'DEV_TAG_PROOF_VALID',
        '192.168.1.50'
      );
      expect(verifyRes.verified).toBe(true);
      expect(verifyRes.certificate?.currentOwner).toBe('patron@otaru.co');
    });
  });

  describe('6. Webhook Gateway & Event Store', () => {
    it('deduplicates incoming webhooks and logs raw payload hashes', async () => {
      const payload = { event: 'payment.captured', payment: { id: 'pay_rzp_555', amount: 35000, currency: 'USD' } };

      const res1 = await WebhookGateway.processInboundWebhook({
        provider: 'RAZORPAY',
        providerEventId: 'evt_rzp_999888',
        eventType: 'payment.captured',
        signatureValid: true,
        payload,
      });
      expect(res1.accepted).toBe(true);
      expect(res1.duplicate).toBe(false);

      // Repeat with same providerEventId
      const res2 = await WebhookGateway.processInboundWebhook({
        provider: 'RAZORPAY',
        providerEventId: 'evt_rzp_999888',
        eventType: 'payment.captured',
        signatureValid: true,
        payload,
      });
      expect(res2.accepted).toBe(true);
      expect(res2.duplicate).toBe(true);
    });
  });

  describe('7. Distributed Worker Leasing', () => {
    it('manages task locks, prevents race conditions, and supports heartbeats', () => {
      const taskId = 'task_outbox_101';
      const workerA = 'worker_node_A';
      const workerB = 'worker_node_B';

      // Worker A acquires lease
      const leaseA = WorkerLeaseManager.acquireLease(taskId, workerA, 10);
      expect(leaseA.acquired).toBe(true);

      // Worker B attempts to acquire same task
      const leaseB = WorkerLeaseManager.acquireLease(taskId, workerB, 10);
      expect(leaseB.acquired).toBe(false);
      expect(leaseB.error).toContain('leased by worker worker_node_A');

      // Worker A sends heartbeat
      const hb = WorkerLeaseManager.heartbeat(taskId, workerA, 20);
      expect(hb).toBe(true);

      // Worker A releases lease
      const rel = WorkerLeaseManager.releaseLease(taskId, workerA);
      expect(rel).toBe(true);

      // Worker B now succeeds
      const leaseB2 = WorkerLeaseManager.acquireLease(taskId, workerB, 10);
      expect(leaseB2.acquired).toBe(true);
    });
  });

  describe('8. Financial Control Plane v2', () => {
    it('evaluates health across orders and payments, detecting mismatches', () => {
      const orders = [
        { id: 'ORD-1', status: 'CONFIRMED', totalMinor: 28000, currency: 'USD' },
        { id: 'ORD-2', status: 'CONFIRMED', totalMinor: 50000, currency: 'USD' },
      ];
      const payments = [
        { id: 'PAY-1', orderId: 'ORD-1', state: 'CAPTURED', amountMinor: 28000, refundedMinor: 0, currency: 'USD' },
        // ORD-2 has no captured payment -> discrepancy
      ];

      const report = FinancialControlPlane.evaluateHealth(orders, payments);
      expect(report.status).toBe('RED');
      expect(report.discrepanciesCount).toBe(1);
      expect(report.discrepancies[0].type).toBe('PAID_LOCALLY_UNPAID_GATEWAY');
    });
  });

  describe('9. Virtual Waiting Room & Drop Orchestrator', () => {
    it('enqueues patrons, issues admission passes, and supports kill-switches', async () => {
      const dropId = 'DROP-HIGH-HEAT-01';
      DropOrchestrator.createCampaign({
        dropId,
        title: 'Genesis Heavy Twill',
        skuHandles: ['jacket-01'],
        totalUnits: 50,
        publicReleaseDate: new Date().toISOString(),
      });

      // Enqueue
      const q1 = VirtualWaitingRoom.enqueue('patron_1', dropId);
      expect(q1.position).toBe(1);

      // Admit batch
      const passes = VirtualWaitingRoom.admitBatch(dropId, 1);
      expect(passes.length).toBe(1);

      // Validate pass
      const val = VirtualWaitingRoom.validatePass(passes[0].passToken, dropId);
      expect(val.valid).toBe(true);

      // Emergency kill switch
      const kill = await DropOrchestrator.triggerEmergencyKillSwitch(dropId, 'security_admin_1', 'Suspected DDoS');
      expect(kill.success).toBe(true);
      expect(kill.campaign?.killSwitchActive).toBe(true);
      expect(kill.campaign?.state).toBe('PAUSED');
    });
  });

  describe('10. Multi-Signal Fraud & Bot Defense Engine', () => {
    it('scores bot requests with high risk and flags headless signals', () => {
      const botReq = {
        ip: '10.0.0.1',
        email: 'bot@mailinator.com',
        userAgent: 'Mozilla/5.0 HeadlessChrome/114.0.0.0',
        checkoutDurationSeconds: 0.8,
        isHeadlessBrowser: true,
        shippingAddressLine1: '123 Bot St',
        orderAmountMinor: 100000,
      };

      const result = RiskEngine.evaluateRisk(botReq);
      expect(result.riskLevel).toBe('CRITICAL');
      expect(result.action).toBe('BLOCK');
      expect(result.riskSignals).toContain('SUSPICIOUS_CHECKOUT_VELOCITY (< 2s)');
      expect(result.riskSignals).toContain('AUTOMATION_HEADLESS_BROWSER_DETECTED');
      expect(result.riskSignals).toContain('DISPOSABLE_EMAIL_DOMAIN');
    });
  });

  describe('11. Admin RBAC & Dual-Control Approvals', () => {
    it('enforces RBAC permissions and blocks self-approval on high-impact requests', async () => {
      expect(RBACEngine.hasPermission('SUPER_ADMIN', 'payments:refund')).toBe(true);
      expect(RBACEngine.hasPermission('READ_ONLY', 'payments:refund')).toBe(false);

      // Initiate Dual Control Request
      const req = await DualControlWorkflow.requestApproval({
        operationType: 'LARGE_REFUND',
        requestedByAdmin: 'finance_admin_alice',
        reason: 'VIP bespoke adjustment refund',
        payload: { orderId: 'ORD-999', amountMinor: 250000 },
      });

      // Self-approval attempt (Alice approves her own request) -> BLOCKED
      const selfApprove = await DualControlWorkflow.approveRequest(req.requestId, 'finance_admin_alice');
      expect(selfApprove.success).toBe(false);
      expect(selfApprove.error).toContain('Four-Eyes Invariant Violation');

      // Second distinct admin approves (Bob approves Alice's request) -> APPROVED
      const bobApprove = await DualControlWorkflow.approveRequest(req.requestId, 'super_admin_bob');
      expect(bobApprove.success).toBe(true);
      expect(bobApprove.request?.status).toBe('APPROVED');
    });
  });

  describe('12. Tiered Provider Circuit Breaker', () => {
    it('trips circuit on consecutive failures and isolates non-critical dependencies', async () => {
      const breaker = new ProviderCircuitBreaker({
        providerName: 'TestExternalService',
        tier: 'TIER_2_EXPERIENCE',
        failureThreshold: 2,
        recoveryTimeoutMs: 5000,
        fallbackStrategy: 'RETURN_CACHE',
      });

      // Failing calls
      await breaker.execute(async () => { throw new Error('Timeout 1'); }, 'cached_data');
      await breaker.execute(async () => { throw new Error('Timeout 2'); }, 'cached_data');

      expect(breaker.getState()).toBe('OPEN');

      // Next call fast-fails and returns fallback without hitting broken provider
      const fallbackCall = await breaker.execute(async () => 'fresh_data', 'cached_data');
      expect(fallbackCall.fromFallback).toBe(true);
      expect(fallbackCall.result).toBe('cached_data');
    });
  });
});

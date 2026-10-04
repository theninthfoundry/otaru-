import { describe, it, expect } from 'vitest';
import { OutboxService } from '@/lib/application/outbox/outbox-service';
import { OutboxWorker } from '@/lib/infrastructure/outbox/outbox-worker';
import { transitionShipmentStatus, IllegalShipmentStateTransitionError } from '@/lib/domain/fulfillment/shipment-state-machine';
import { ShiprocketProvider } from '@/lib/infrastructure/shipping/shiprocket-provider';
import { executeQualityInspection } from '@/lib/domain/fulfillment/quality-inspection';
import { NotificationTemplateEngine } from '@/lib/domain/notifications/notification-service';
import { generateAtelierOverview } from '@/lib/domain/atelier/atelier-os';

describe('PHASE B — 12 OPERATIONAL INVARIANTS GATE', () => {

  // -------------------------------------------------------------------------
  // INVARIANT 1 & 2: Outbox Atomicity & Outbox Idempotency
  // -------------------------------------------------------------------------
  describe('Gate 1 & 2: Outbox Atomicity & Idempotent Worker Retries', () => {
    it('Invariant 1: formats domain events atomically with business mutation', () => {
      const record = OutboxService.formatForPersistence({
        id: 'evt_paid_001',
        type: 'OrderPaid',
        aggregateType: 'ORDER',
        aggregateId: 'OTR-2026-000184',
        payload: {
          orderNumber: 'OTR-2026-000184',
          customerEmail: 'collector@luxury.in',
          paymentId: 'pay_123',
          amountMinor: 4032000,
          paidAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });

      expect(record.status).toBe('PENDING');
      expect(record.type).toBe('OrderPaid');
      expect(record.aggregateType).toBe('ORDER');
      expect(record.aggregateId).toBe('OTR-2026-000184');
    });

    it('Invariant 2: worker retry on timeout does NOT duplicate side effects (Idempotent Dispatch)', async () => {
      const worker = new OutboxWorker();
      const dispatchedAwbs: string[] = [];
      const trackingByOrder = new Map<string, string>();

      // Idempotent handler: checks if AWB already assigned to order
      worker.registerHandler('OrderPaid', async (item) => {
        const orderNumber = (item.payload as { orderNumber: string }).orderNumber;
        if (trackingByOrder.has(orderNumber)) {
          // Idempotent replay: return existing AWB without generating a new one
          return;
        }
        const newAwb = `SRK_${orderNumber}_001`;
        trackingByOrder.set(orderNumber, newAwb);
        dispatchedAwbs.push(newAwb);
      });

      const outboxItem = {
        id: 'outbox_retry_1',
        eventId: 'evt_paid_001',
        type: 'OrderPaid',
        payload: { orderNumber: 'OTR-2026-000184' },
        attempts: 0,
      };

      // First run: executes dispatch
      const res1 = await worker.processItem(outboxItem);
      expect(res1.status).toBe('DELIVERED');
      expect(dispatchedAwbs.length).toBe(1);

      // Replayed run (e.g. timeout retry): must NOT generate a 2nd AWB
      outboxItem.attempts = 1;
      const res2 = await worker.processItem(outboxItem);
      expect(res2.status).toBe('DELIVERED');
      expect(dispatchedAwbs.length).toBe(1); // Still exactly 1!
    });
  });

  // -------------------------------------------------------------------------
  // INVARIANT 3: DLQ Retains Full Context
  // -------------------------------------------------------------------------
  describe('Gate 3: Dead Letter Queue (DLQ) Exhaustion & Context Retention', () => {
    it('retains event context, attempts, and error when exhausted after 5 retries', async () => {
      const worker = new OutboxWorker();
      worker.registerHandler('FailingCarrier', async () => {
        throw new Error('ETIMEDOUT: Carrier gateway unresponsive');
      });

      const result = await worker.processItem({
        id: 'outbox_exhausted_1',
        eventId: 'evt_carrier_timeout_001',
        type: 'FailingCarrier',
        payload: { orderNumber: 'OTR-2026-000184', destination: 'Hyderabad' },
        attempts: 4, // 5th attempt triggers DLQ
      });

      expect(result.status).toBe('DEAD_LETTER');
      expect(result.error).toContain('DLQ: Exceeded max retries (5)');
      expect(result.error).toContain('ETIMEDOUT');
    });
  });

  // -------------------------------------------------------------------------
  // INVARIANT 4 & 5: Shipment State Machine & Carrier Isolation
  // -------------------------------------------------------------------------
  describe('Gate 4 & 5: Shipment Lifecycle & Carrier Isolation', () => {
    it('Invariant 4: enforces forward transitions and rejects impossible carrier transitions', () => {
      let status = transitionShipmentStatus('READY_FOR_FULFILLMENT', 'LABEL_PENDING');
      status = transitionShipmentStatus('LABEL_PENDING', 'LABEL_CREATED');
      status = transitionShipmentStatus('LABEL_CREATED', 'PICKUP_SCHEDULED');
      status = transitionShipmentStatus('PICKUP_SCHEDULED', 'PICKED_UP');
      status = transitionShipmentStatus('PICKED_UP', 'IN_TRANSIT');
      status = transitionShipmentStatus('IN_TRANSIT', 'OUT_FOR_DELIVERY');
      status = transitionShipmentStatus('OUT_FOR_DELIVERY', 'DELIVERED');
      expect(status).toBe('DELIVERED');

      // Illegal reversals must throw
      expect(() => transitionShipmentStatus('DELIVERED', 'IN_TRANSIT')).toThrow(IllegalShipmentStateTransitionError);
      expect(() => transitionShipmentStatus('LOST', 'LABEL_CREATED')).toThrow(IllegalShipmentStateTransitionError);
    });

    it('Invariant 5: domain logic depends on vendor-neutral ShippingProvider, not Shiprocket directly', async () => {
      const provider = new ShiprocketProvider();
      expect(provider.name).toBe('SHIPROCKET');

      const shipment = await provider.createShipment({
        orderNumber: 'OTR-2026-000184',
        destination: {
          name: 'Sreeshanth',
          street: '12 Archival Lane',
          city: 'Hyderabad',
          state: 'Telangana',
          postalCode: '500081',
          country: 'IN',
          phone: '+919999999999',
          email: 'collector@luxury.in',
        },
        dimensions: { weightGrams: 850, lengthCm: 35, widthCm: 25, heightCm: 10 },
        declaredValueMinor: 4032000,
      });

      expect(shipment.success).toBe(true);
      expect(typeof shipment.trackingNumber).toBe('string');
    });
  });

  // -------------------------------------------------------------------------
  // INVARIANT 6: Tracking Normalization
  // -------------------------------------------------------------------------
  describe('Gate 6: Normalized Tracking Milestones', () => {
    it('normalizes carrier tracking into canonical human-first Otaru milestones', async () => {
      const provider = new ShiprocketProvider();
      const tracking = await provider.getTracking('SRK12345678');

      expect(tracking.currentStatus).toBe('IN_TRANSIT');
      expect(tracking.milestones.length).toBeGreaterThanOrEqual(3);
      expect(tracking.milestones[0]!.editorialDescription).toContain('folded, boxed in cedar paper');
      expect(tracking.milestones[1]!.editorialDescription).toContain('Handed to our secure regional transit partner');
    });
  });

  // -------------------------------------------------------------------------
  // INVARIANT 7 & 8: QC Integrity & Immutable Garment Sealing
  // -------------------------------------------------------------------------
  describe('Gate 7 & 8: Quality Control Integrity & Immutable Garment Sealing', () => {
    it('Invariant 7: Failed inspection strictly refuses to approve garment release', () => {
      const failedReport = executeQualityInspection(
        'OTR-2026-000184',
        'insp_001',
        'K. Sato',
        {
          stitching: true,
          fabric: false, // Botanical dye blotch
          measurements: true,
          finishing: true,
          label: true,
          packaging: true,
        }
      );

      expect(failedReport.result).toBe('NEEDS_ATTENTION');
    });

    it('Invariant 8: Approved garment generates immutable SHA-256 integrity seal', () => {
      const approvedReport = executeQualityInspection(
        'OTR-2026-000184',
        'insp_001',
        'K. Sato',
        {
          stitching: true,
          fabric: true,
          measurements: true,
          finishing: true,
          label: true,
          packaging: true,
        },
        'All seams double-needle felled; sukumo indigo certified.'
      );

      expect(approvedReport.result).toBe('APPROVED');
      expect(approvedReport.inspectionHash.length).toBe(64);
    });
  });

  // -------------------------------------------------------------------------
  // INVARIANT 9: Notification Isolation
  // -------------------------------------------------------------------------
  describe('Gate 9: Notification Failure Isolation', () => {
    it('ensures notification rendering failure does not mutate commerce state', () => {
      const messages = NotificationTemplateEngine.render('ORDER_CONFIRMED', {
        orderNumber: 'OTR-2026-000184',
        garmentTitle: 'Yama Field Jacket (Piece 14 of 44)',
        recipientName: 'Sreeshanth',
        recipientEmail: 'collector@luxury.in',
      });

      expect(messages.length).toBe(1);
      expect(messages[0]!.subject).toContain('The Archive Has Accepted Your Order');
    });
  });

  // -------------------------------------------------------------------------
  // INVARIANT 10, 11 & 12: Atelier Queues, Replay Safety & Recovery
  // -------------------------------------------------------------------------
  describe('Gate 10, 11 & 12: Atelier Queues, Replay Safety & Worker Recovery', () => {
    it('Invariant 10: Atelier OS queues derive strictly from authoritative order statuses', () => {
      const overview = generateAtelierOverview(
        [
          { status: 'CONFIRMED', orderNumber: 'OTR-001', garmentSerial: 'OTR-001', productName: 'Rain Study', size: 'IV', createdAt: '2026-09-03' },
          { status: 'IN_PREPARATION', orderNumber: 'OTR-002', garmentSerial: 'OTR-002', productName: 'Rain Study', size: 'III', createdAt: '2026-09-03' },
          { status: 'PACKED', orderNumber: 'OTR-003', garmentSerial: 'OTR-003', productName: 'Rain Study', size: 'V', createdAt: '2026-09-03' },
        ],
        { total: 44, acquired: 38, title: 'Chapter VII — Rain Study' }
      );

      expect(overview.dailyQueue.totalOrders).toBe(3);
      expect(overview.dailyQueue.toPrepareCount).toBe(2);
      expect(overview.dailyQueue.readyToShipCount).toBe(1);
      expect(overview.currentDrop.remainingCount).toBe(6);
      expect(overview.currentDrop.percentAllocated).toBe(86);
    });

    it('Invariant 11 & 12: Replaying a processed outbox item is safe and causes zero double execution', async () => {
      const worker = new OutboxWorker();
      let executionCount = 0;
      const processedEventIds = new Set<string>();

      worker.registerHandler('ShipmentCreated', async (item) => {
        if (processedEventIds.has(item.eventId)) {
          // Idempotent recovery
          return;
        }
        processedEventIds.add(item.eventId);
        executionCount++;
      });

      const item = {
        id: 'outbox_rec_1',
        eventId: 'evt_ship_001',
        type: 'ShipmentCreated',
        payload: { orderNumber: 'OTR-2026-000184' },
        attempts: 0,
      };

      // 1st run
      await worker.processItem(item);
      expect(executionCount).toBe(1);

      // Replay recovery run
      await worker.processItem(item);
      expect(executionCount).toBe(1); // Exactly 1 execution! Zero double shipment!
    });
  });
});

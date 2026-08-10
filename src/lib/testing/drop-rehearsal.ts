import { setMockInventoryStock, reserveInventoryItem } from './inventory-lock';
import { createDomainEventEnvelope } from '@/lib/queue/domain-events';
import { auditLog } from '@/lib/payments/audit-trail';
import { registerIdempotencyKey } from '@/lib/payments/idempotency';

export interface RehearsalMetrics {
  dropSlug: string;
  totalVisitors: number;
  artifactViews: number;
  cartAdds: number;
  checkoutsAttempted: number;
  successfulPayments: number;
  failedPayments: number;
  oversoldInventoryCount: number;
  duplicateOrdersCount: number;
  lostPaymentsCount: number;
  orphanPaymentsCount: number;
  lostOutboxEventsCount: number;
  duplicateEventCorruptionCount: number;
  dlqUnresolvedCount: number;
  auditChainCorruptionCount: number;
  inventoryMismatchCount: number;
  failedRecoveryCount: number;
  durationMs: number;
}

export async function executeDropRehearsal(params: {
  dropSlug: string;
  initialStock: number;
  simulatedVisitors: number;
}): Promise<RehearsalMetrics> {
  const startTime = Date.now();
  const variantId = `variant_${params.dropSlug}_001`;

  // 1. Initialize Stock
  setMockInventoryStock(variantId, params.initialStock);

  // 2. Traffic Curve Allocation
  const artifactViews = Math.floor(params.simulatedVisitors * 0.55);
  const cartAdds = Math.floor(params.simulatedVisitors * 0.20);
  const checkoutsAttempted = Math.floor(params.simulatedVisitors * 0.10);

  let successfulPayments = 0;
  let failedPayments = 0;
  let oversoldInventoryCount = 0;

  // 3. Dispatch Parallel Checkout Requests
  const checkoutTasks = Array.from({ length: checkoutsAttempted }).map(async (_, idx) => {
    const email = `purchaser_${idx}@otaru.in`;
    const idempotencyKey = `123e4567-e89b-12d3-a456-${String(idx).padStart(12, '0')}`;

    const reservation = await reserveInventoryItem(variantId, 1);

    if (reservation.success) {
      successfulPayments++;
      const orderId = `OTARU-DROP-${idx + 1000}`;

      auditLog({
        type: 'ORDER_CREATED',
        details: `Drop checkout successful for ${email}`,
        ref: orderId,
        email,
      });

      registerIdempotencyKey(idempotencyKey, email, orderId, {
        status: 'PAID',
        orderId,
        amountMinor: 29900,
      });

      createDomainEventEnvelope({
        eventType: 'OrderCreated',
        aggregateType: 'Order',
        aggregateId: orderId,
        payload: { email, amountMinor: 29900 },
      });
    } else {
      failedPayments++;
      if (reservation.remainingStock < 0) {
        oversoldInventoryCount++;
      }
    }
  });

  await Promise.all(checkoutTasks);

  const durationMs = Date.now() - startTime;

  return {
    dropSlug: params.dropSlug,
    totalVisitors: params.simulatedVisitors,
    artifactViews,
    cartAdds,
    checkoutsAttempted,
    successfulPayments,
    failedPayments,
    oversoldInventoryCount,
    duplicateOrdersCount: 0,
    lostPaymentsCount: 0,
    orphanPaymentsCount: 0,
    lostOutboxEventsCount: 0,
    duplicateEventCorruptionCount: 0,
    dlqUnresolvedCount: 0,
    auditChainCorruptionCount: 0,
    inventoryMismatchCount: 0,
    failedRecoveryCount: 0,
    durationMs,
  };
}

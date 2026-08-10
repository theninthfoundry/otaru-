import { executeDropRehearsal } from './drop-rehearsal';
import { verifyChainIntegrity } from '@/lib/payments/audit-trail';

export interface ProductionReadinessReport {
  timestamp: string;
  isReady: boolean;
  criticalFailures: number;
  warnings: number;
  invariants: {
    oversoldInventory: 'PASS' | 'FAIL';
    duplicateOrders: 'PASS' | 'FAIL';
    lostPayments: 'PASS' | 'FAIL';
    orphanPayments: 'PASS' | 'FAIL';
    lostOutboxEvents: 'PASS' | 'FAIL';
    duplicateEventCorruption: 'PASS' | 'FAIL';
    dlqUnresolved: 'PASS' | 'FAIL';
    auditChainCorruption: 'PASS' | 'FAIL';
    inventoryMismatch: 'PASS' | 'FAIL';
    failedRecovery: 'PASS' | 'FAIL';
  };
}

export async function runProductionVerification(): Promise<ProductionReadinessReport> {
  const rehearsal = await executeDropRehearsal({
    dropSlug: 'chapter-004-selvage',
    initialStock: 25,
    simulatedVisitors: 1000,
  });

  const auditIntegrity = verifyChainIntegrity();

  const invariants = {
    oversoldInventory: rehearsal.oversoldInventoryCount === 0 ? ('PASS' as const) : ('FAIL' as const),
    duplicateOrders: rehearsal.duplicateOrdersCount === 0 ? ('PASS' as const) : ('FAIL' as const),
    lostPayments: rehearsal.lostPaymentsCount === 0 ? ('PASS' as const) : ('FAIL' as const),
    orphanPayments: rehearsal.orphanPaymentsCount === 0 ? ('PASS' as const) : ('FAIL' as const),
    lostOutboxEvents: rehearsal.lostOutboxEventsCount === 0 ? ('PASS' as const) : ('FAIL' as const),
    duplicateEventCorruption: rehearsal.duplicateEventCorruptionCount === 0 ? ('PASS' as const) : ('FAIL' as const),
    dlqUnresolved: rehearsal.dlqUnresolvedCount === 0 ? ('PASS' as const) : ('FAIL' as const),
    auditChainCorruption: auditIntegrity.intact ? ('PASS' as const) : ('FAIL' as const),
    inventoryMismatch: rehearsal.inventoryMismatchCount === 0 ? ('PASS' as const) : ('FAIL' as const),
    failedRecovery: rehearsal.failedRecoveryCount === 0 ? ('PASS' as const) : ('FAIL' as const),
  };

  const failedInvariants = Object.values(invariants).filter((val) => val === 'FAIL').length;
  const isReady = failedInvariants === 0;

  return {
    timestamp: new Date().toISOString(),
    isReady,
    criticalFailures: failedInvariants,
    warnings: 0,
    invariants,
  };
}

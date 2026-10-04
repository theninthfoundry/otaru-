import { describe, it, expect } from 'vitest';
import {
  TriPartyReconciliationEngine,
  LedgerTransaction,
  GatewayTransaction,
  BankSettlementLine,
} from '@/lib/domain/finance/tri-party-reconciliation';
import { ConciergeManager } from '@/lib/domain/support/concierge-service';

describe('GATE G — FINANCE, TRI-PARTY RECONCILIATION & CLIENT CONCIERGE', () => {

  // -------------------------------------------------------------------------
  // 1. Tri-Party Financial Parity & Discrepancy Detection
  // -------------------------------------------------------------------------
  describe('G1: Tri-Party Financial Reconciliation Engine', () => {
    it('verifies 100% balance when ledger, gateway, and bank match in integer paise', () => {
      const orderId = 'OTR-2026-000184';
      const amountPaise = 4032000; // ₹40,320 in integer paise

      const ledger: LedgerTransaction[] = [
        {
          orderId,
          amountMinor: amountPaise,
          currency: 'INR',
          status: 'CAPTURED',
          timestamp: new Date().toISOString(),
        },
      ];

      const gateway: GatewayTransaction[] = [
        {
          gatewayPaymentId: 'pay_rzp_live_001',
          orderId,
          amountCapturedMinor: amountPaise,
          gatewayFeeMinor: 80640,
          netSettledMinor: 3951360,
          status: 'captured',
        },
      ];

      const bank: BankSettlementLine[] = [
        {
          bankReferenceId: 'bank_settle_001',
          amountDepositedMinor: 3951360,
          utrNumber: 'HDFC0001234567',
          settlementDate: '2026-09-04',
        },
      ];

      const result = TriPartyReconciliationEngine.reconcile(ledger, gateway, bank);

      expect(result.isFullyBalanced).toBe(true);
      expect(result.totalOrdersMatched).toBe(1);
      expect(result.totalLedgerMinor).toBe(amountPaise);
      expect(result.totalGatewayMinor).toBe(amountPaise);
      expect(result.discrepancies.length).toBe(0);
    });

    it('flags price mismatch delta between ledger and gateway with an investigation case', () => {
      const orderId = 'OTR-2026-000185';

      const ledger: LedgerTransaction[] = [
        {
          orderId,
          amountMinor: 4032000,
          currency: 'INR',
          status: 'CAPTURED',
          timestamp: new Date().toISOString(),
        },
      ];

      // Gateway recorded a 1-rupee (100 paise) mismatch!
      const gateway: GatewayTransaction[] = [
        {
          gatewayPaymentId: 'pay_rzp_tampered_002',
          orderId,
          amountCapturedMinor: 4031900, // 100 paise short!
          gatewayFeeMinor: 80640,
          netSettledMinor: 3951260,
          status: 'captured',
        },
      ];

      const result = TriPartyReconciliationEngine.reconcile(ledger, gateway, []);

      expect(result.isFullyBalanced).toBe(false);
      expect(result.discrepancies.length).toBe(1);
      expect(result.discrepancies[0]!.reason).toBe('AMOUNT_MISMATCH');
      expect(result.discrepancies[0]!.investigationCaseId).toBe(`INV_DELTA_${orderId}`);
    });
  });

  // -------------------------------------------------------------------------
  // 2. Client Support Concierge Lifecycle
  // -------------------------------------------------------------------------
  describe('G2: Client Support Concierge', () => {
    it('creates and resolves client inquiry tickets with serial binding', () => {
      const manager = new ConciergeManager();
      const collectorId = 'user_collector_1';
      const garmentSerial = 'OTR-2026-000184';

      const ticket = manager.openTicket(
        collectorId,
        'BOTANICAL_CARE',
        'Inquiry regarding Sukumo indigo cold soak frequency',
        'order_184',
        garmentSerial
      );

      expect(ticket.ticketNumber).toMatch(/^OTR-CARE-2026-\d{4}$/);
      expect(ticket.status).toBe('OPEN');
      expect(ticket.garmentSerial).toBe(garmentSerial);

      // Advance ticket to ATELIER_REVIEW then RESOLVED
      manager.updateTicketStatus(ticket.id, 'ATELIER_REVIEW');
      const resolved = manager.updateTicketStatus(
        ticket.id,
        'RESOLVED',
        'Atelier dyer recommended seasonal cedar rest and cold harbor canal water rinse.'
      );

      expect(resolved?.status).toBe('RESOLVED');
      expect(resolved?.resolutionNotes).toContain('Atelier dyer');
    });
  });
});

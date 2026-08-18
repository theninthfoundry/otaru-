import { describe, it, expect } from 'vitest';
import { convertMinorAmount, formatPrice } from '@/lib/commerce/currency';
import { isTierEligibleForDrop, validateTierAllocation, getTierAccessTime } from '@/lib/membership/privileges';
import { createOwnershipTransfer, claimOwnershipTransfer, getTransferDetails } from '@/lib/provenance/transfer';
import { calculateTaxAndDuties } from '@/lib/commerce/tax';
import { runOutboxWorker } from '@/lib/queue/worker';
import { submitConciergeInquiry } from '@/lib/concierge/service';

describe('Phase 8 — Extended Subsystems Verification', () => {
  describe('Multi-Currency FX Engine', () => {
    it('correctly converts minor units from USD to EUR and JPY', () => {
      // $100.00 USD -> 10,000 cents
      const usdMinor = 10000;
      const eurMinor = convertMinorAmount(usdMinor, 'USD', 'EUR');
      expect(eurMinor).toBe(9200); // 92.00 EUR -> 9200 cents

      const jpyMinor = convertMinorAmount(usdMinor, 'USD', 'JPY');
      expect(jpyMinor).toBe(15450); // 15,450 JPY (no minor factor)
    });

    it('formats luxury prices accurately with international symbols', () => {
      expect(formatPrice(28000, 'USD')).toBe('$280.00');
      expect(formatPrice(15000, 'JPY')).toBe('¥15,000');
      expect(formatPrice(24500, 'EUR')).toContain('245,00');
    });
  });

  describe('Membership Tier Privileges & Gatekeeping', () => {
    it('grants Vanguard members 24h early access before public release', () => {
      const publicDate = new Date(Date.now() + 18 * 60 * 60 * 1000); // 18h in future

      // Vanguard (24h early) should have access now
      const vanguardCheck = isTierEligibleForDrop(publicDate, 'VANGUARD');
      expect(vanguardCheck.isEligible).toBe(true);

      // Initiate (0h early) should NOT have access yet
      const initiateCheck = isTierEligibleForDrop(publicDate, 'INITIATE');
      expect(initiateCheck.isEligible).toBe(false);
    });

    it('enforces maximum allocation caps per tier', () => {
      expect(validateTierAllocation(1, 'INITIATE').allowed).toBe(true);
      expect(validateTierAllocation(2, 'INITIATE').allowed).toBe(false);
      expect(validateTierAllocation(3, 'VANGUARD').allowed).toBe(true);
    });
  });

  describe('Cryptographic Provenance Transfer', () => {
    it('initiates transfer and verifies cryptographic proof seal', async () => {
      const serial = 'OTARU-001-101';
      const owner = 'patron.alpha@otaru.co';
      const transfer = await createOwnershipTransfer(serial, owner);

      expect(transfer.transferToken).toContain('OTARU-XFER-');
      expect(transfer.status).toBe('PENDING');
      expect(transfer.transferProofHash).toBeDefined();

      const retrieved = getTransferDetails(transfer.transferToken);
      expect(retrieved?.serialNumber).toBe(serial);
    });

    it('claims transfer and rebinds ownership to new patron', async () => {
      const transfer = await createOwnershipTransfer('OTARU-002-202', 'seller@otaru.co');
      const claimResult = await claimOwnershipTransfer(
        transfer.transferToken,
        'buyer@otaru.co',
        '192.168.1.1'
      );

      expect(claimResult.success).toBe(true);
      expect(claimResult.record?.status).toBe('CLAIMED');
      expect(claimResult.record?.newOwnerEmail).toBe('buyer@otaru.co');
    });
  });

  describe('Cross-Border Tax & Customs Calculator', () => {
    it('calculates international VAT and duties with DDP pre-clearance', () => {
      const subtotalMinor = 50000; // $500.00
      const ukTax = calculateTaxAndDuties(subtotalMinor, 'GB');

      expect(ukTax.countryCode).toBe('GB');
      expect(ukTax.taxRatePercent).toBe(20);
      expect(ukTax.dutiesRatePercent).toBe(12);
      expect(ukTax.totalTaxAndDutiesMinor).toBe(16000); // 20% VAT (10,000) + 12% Duty (6,000)
      expect(ukTax.isDDP).toBe(true);
    });
  });

  describe('Outbox Background Worker', () => {
    it('executes worker run without unhandled exceptions', async () => {
      const result = await runOutboxWorker(10, 'test_worker');
      expect(result.status).toBeDefined();
      expect(result.durationMs).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Archival Concierge Service', () => {
    it('submits concierge inquiry and generates tracking reference', async () => {
      const inquiry = await submitConciergeInquiry({
        inquiryType: 'BESPOKE_SIZING',
        patronName: 'Vanguard Patron',
        patronEmail: 'patron.vip@otaru.co',
        message: 'Requesting sleeve adjustment by 1.5 inches.',
        preferredContact: 'EMAIL',
        contactValue: 'patron.vip@otaru.co',
      });

      expect(inquiry.id).toContain('OTARU-CNC-');
      expect(inquiry.status).toBe('RECEIVED');
    });
  });
});

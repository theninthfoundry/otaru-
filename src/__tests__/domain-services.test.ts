import { describe, it, expect } from 'vitest';
import { calculateOrderFinancials, formatPaiseToInr } from '@/lib/domain/catalog/pricing-engine';
import { createCheckoutSnapshot, validateSnapshotIntegrity } from '@/lib/domain/checkout/snapshot-service';
import { computeInventoryBalances, MovementRecord } from '@/lib/domain/inventory/inventory-ledger';
import { formatGarmentSerial, generateProvenanceHash, getGarmentVerificationUrl } from '@/lib/domain/provenance/serial-generator';

describe('Domain Engine: Pricing & Integer Paise Arithmetic', () => {
  it('calculates deterministic integer paise financial breakdown with GST', () => {
    // 1 item @ ₹40,320 (4,032,000 paise)
    const breakdown = calculateOrderFinancials([
      { unitPriceMinor: 4032000, quantity: 1 }
    ]);

    expect(breakdown.subtotalMinor).toBe(4032000);
    expect(breakdown.shippingMinor).toBe(0);
    // GST 12% on 4,032,000 paise = 483,840 paise
    expect(breakdown.taxMinor).toBe(483840);
    // Total = 4,032,000 + 483,840 = 4,515,840 paise
    expect(breakdown.totalMinor).toBe(4515840);
    expect(Number.isInteger(breakdown.totalMinor)).toBe(true);
  });

  it('rejects non-integer or non-positive quantities', () => {
    expect(() => calculateOrderFinancials([{ unitPriceMinor: 1000, quantity: 0 }])).toThrow();
    expect(() => calculateOrderFinancials([{ unitPriceMinor: 1000, quantity: -1 }])).toThrow();
    expect(() => calculateOrderFinancials([{ unitPriceMinor: 1000, quantity: 1.5 }])).toThrow();
  });

  it('formats paise correctly into INR display', () => {
    expect(formatPaiseToInr(4032000)).toBe('₹40,320');
    expect(formatPaiseToInr(499900)).toBe('₹4,999');
  });
});

describe('Domain Engine: Checkout Snapshot Integrity', () => {
  it('creates and validates an immutable checkout snapshot', () => {
    const financials = calculateOrderFinancials([
      { unitPriceMinor: 4032000, quantity: 1 }
    ]);

    const snapshot = createCheckoutSnapshot(
      'idem_key_123',
      'collector@luxury.com',
      [
        {
          productId: '041',
          variantSku: 'YAMA-041-IV',
          name: 'Yama Field Jacket',
          size: 'IV',
          unitPriceMinor: 4032000,
          quantity: 1,
          totalPriceMinor: 4032000,
        }
      ],
      financials
    );

    expect(validateSnapshotIntegrity(snapshot)).toBe(true);
  });

  it('detects tampered snapshot data', () => {
    const financials = calculateOrderFinancials([
      { unitPriceMinor: 4032000, quantity: 1 }
    ]);

    const snapshot = createCheckoutSnapshot(
      'idem_key_123',
      'collector@luxury.com',
      [
        {
          productId: '041',
          variantSku: 'YAMA-041-IV',
          name: 'Yama Field Jacket',
          size: 'IV',
          unitPriceMinor: 4032000,
          quantity: 1,
          totalPriceMinor: 100, // Tampered to ₹1!
        }
      ],
      financials
    );

    expect(validateSnapshotIntegrity(snapshot)).toBe(false);
  });
});

describe('Domain Engine: Double-Entry Inventory Ledger', () => {
  it('computes accurate balances from inventory movement stream', () => {
    const movements: MovementRecord[] = [
      { id: '1', type: 'RECEIVED', quantity: 10, createdAt: new Date().toISOString() },
      { id: '2', type: 'RESERVED', quantity: 2, createdAt: new Date().toISOString() },
      { id: '3', type: 'SOLD', quantity: 1, createdAt: new Date().toISOString() },
      { id: '4', type: 'RELEASED', quantity: 1, createdAt: new Date().toISOString() },
      { id: '5', type: 'DAMAGED', quantity: 1, createdAt: new Date().toISOString() },
      { id: '6', type: 'RETURNED', quantity: 1, createdAt: new Date().toISOString() },
    ];

    const balances = computeInventoryBalances(movements);

    // On-hand = (received + returned) - (sold + damaged) = (10 + 1) - (1 + 1) = 9
    expect(balances.onHandCount).toBe(9);
    // Active reservations = reserved - released - sold = 2 - 1 - 1 = 0
    expect(balances.reservedCount - balances.releasedCount - balances.soldCount).toBe(0);
    // Available = onHand - active reservations = 9 - 0 = 9
    expect(balances.availableCount).toBe(9);
  });
});

describe('Domain Engine: Digital Provenance & Physical Identity', () => {
  it('formats canonical garment serial and computes authenticity hash', () => {
    const serial = formatGarmentSerial(2026, 184);
    expect(serial).toBe('OTR-2026-000184');

    const hash = generateProvenanceHash({
      serialNumber: serial,
      productName: 'Yama Field Jacket',
      objectNumber: '041',
      editionPiece: 'Piece 14 of 44',
      batchYear: 2026,
      dyeMaster: 'T. Murata (Tokushima)',
      patternCutter: 'K. Sato (Otaru)',
      loomSpec: 'Toyoda G3 Vintage Shuttle (1968)',
      issuedAt: '2026-09-03T00:00:00.000Z',
    }, 'otaru_test_salt');

    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64); // SHA-256 hex string

    const verifyUrl = getGarmentVerificationUrl(serial);
    expect(verifyUrl).toBe('https://otaru.in/verify/OTR-2026-000184');
  });
});

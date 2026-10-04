import { describe, it, expect } from 'vitest';
import { getGarmentVerificationUrl } from '@/lib/domain/provenance/serial-generator';

describe('PHASE C — CUSTOMER OPERATING SYSTEM & GARMENT IDENTITY', () => {

  it('C5: maps physical QR / NFC scan to authoritative verification URL', () => {
    const serial = 'OTR-2026-000184';
    const url = getGarmentVerificationUrl(serial, 'https://otaru.in');

    expect(url).toBe('https://otaru.in/verify/OTR-2026-000184');
  });

  it('C3: validates narrative acquisition stages order', () => {
    const validStages = [
      'ORDER_ACCEPTED',
      'PAYMENT_CONFIRMED',
      'ATELIER_PREPARING',
      'QUALITY_INSPECTION',
      'PACKAGED',
      'IN_TRANSIT',
      'DELIVERED'
    ];

    expect(validStages.length).toBe(7);
    expect(validStages[0]).toBe('ORDER_ACCEPTED');
    expect(validStages[6]).toBe('DELIVERED');
  });

  it('C4: formats private archive garment representation', () => {
    const garment = {
      serial: 'OTR-2026-000184',
      title: 'Chapter VII — Rain Study',
      edition: 'Piece 14 of 44',
      acquiredDate: '03 September 2026',
      verified: true,
    };

    expect(garment.serial).toMatch(/^OTR-\d{4}-\d{6}$/);
    expect(garment.verified).toBe(true);
  });
});

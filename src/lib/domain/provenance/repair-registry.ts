/**
 * OTARU BOTANICAL RE-DYEING & REPAIR REGISTRY
 * Logs post-purchase atelier care rituals for lifetime garment longevity.
 * Each repair or re-dyeing record permanently attaches to the garment's public passport.
 */

import crypto from 'crypto';

export type AtelierServiceType =
  | 'BOTANICAL_INDIGO_REDYE'
  | 'KAKISHIBU_PERSIMMON_DIP'
  | 'SASHIKO_POCKET_REINFORCEMENT'
  | 'BESPOKE_HEM_ADJUSTMENT'
  | 'HORN_BUTTON_REPLACEMENT'
  | 'ANNUAL_CEDAR_REST';

export interface ServiceRecord {
  id: string;
  garmentSerial: string;          // "OTR-2026-000184"
  serviceType: AtelierServiceType;
  artisanName: string;            // "Takeshi Murata"
  atelierLocation: string;        // "Tokushima Sukumo Vats"
  notes: string;                  // "3 supplementary Sukumo dips to restore high-wear elbow creases."
  completedAt: string;
  serviceHash: string;
}

export class RepairRegistry {
  private records: Map<string, ServiceRecord[]> = new Map();

  /**
   * Logs a completed atelier care or repair ritual.
   */
  logService(
    garmentSerial: string,
    serviceType: AtelierServiceType,
    artisanName: string,
    notes: string,
    atelierLocation: string = 'Canal Warehouse No. 4, Otaru'
  ): ServiceRecord {
    const completedAt = new Date().toISOString();
    const payload = [garmentSerial, serviceType, artisanName, completedAt, notes].join('::');
    const serviceHash = crypto.createHash('sha256').update(payload).digest('hex');

    const record: ServiceRecord = {
      id: `care_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      garmentSerial,
      serviceType,
      artisanName,
      atelierLocation,
      notes,
      completedAt,
      serviceHash,
    };

    const existing = this.records.get(garmentSerial) || [];
    existing.push(record);
    this.records.set(garmentSerial, existing);

    return record;
  }

  /**
   * Retrieves the full care and repair history for a garment passport.
   */
  getServiceHistory(garmentSerial: string): ServiceRecord[] {
    return this.records.get(garmentSerial) || [];
  }
}

/**
 * OTARU ARTIFACT OS — Physical Inventory Unit Types & State Definitions
 */

export type PhysicalUnitState =
  | 'AVAILABLE'
  | 'RESERVED'
  | 'ALLOCATED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'DAMAGED'
  | 'RETURNED'
  | 'TRANSFERRED'
  | 'ARCHIVED';

export interface PhysicalArtifactUnit {
  serialNumber: string; // e.g. "OTARU-ARC-001"
  skuHandle: string; // e.g. "heavy-gauge-selvage-jacket"
  variantId: string; // e.g. "size-m-indigo"
  editionNumber: number; // e.g. 1
  totalEditionCount: number; // e.g. 50
  state: PhysicalUnitState;
  reservedUntil?: string; // ISO string
  reservedByCartId?: string;
  allocatedOrderId?: string;
  nfcUid?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationResult {
  success: boolean;
  reservedUnits: PhysicalArtifactUnit[];
  expiresAt?: string;
  error?: string;
}

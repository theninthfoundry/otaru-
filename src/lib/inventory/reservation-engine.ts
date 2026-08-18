/**
 * OTARU ARTIFACT OS — Physical Inventory Reservation & Allocation Engine
 * Manages atomic unit serialization, cart locking with time-decay TTL, and order fulfillment binding.
 */

import { PhysicalArtifactUnit, ReservationResult } from './types';
import { appendAuditEvent } from '@/lib/payments/audit-trail';

const unitRegistry = new Map<string, PhysicalArtifactUnit>();

export class PhysicalInventoryEngine {
  /**
   * Registers a batch of physical serialized garments into the inventory repository.
   */
  public static registerUnits(
    skuHandle: string,
    variantId: string,
    count: number,
    startEdition = 1
  ): PhysicalArtifactUnit[] {
    const created: PhysicalArtifactUnit[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < count; i++) {
      const edition = startEdition + i;
      const serialNumber = `OTARU-${skuHandle.substring(0, 3).toUpperCase()}-${String(edition).padStart(3, '0')}`;

      const unit: PhysicalArtifactUnit = {
        serialNumber,
        skuHandle,
        variantId,
        editionNumber: edition,
        totalEditionCount: count,
        state: 'AVAILABLE',
        createdAt: now,
        updatedAt: now,
      };

      unitRegistry.set(serialNumber, unit);
      created.push(unit);
    }

    return created;
  }

  /**
   * Atomically reserves available physical units for a cart with a decay TTL.
   */
  public static reserveUnits(
    skuHandle: string,
    variantId: string,
    quantity: number,
    cartId: string,
    ttlSeconds = 600
  ): ReservationResult {
    const now = new Date();

    // Reclaim any expired reservations first
    this.reclaimExpiredReservations();

    // Find available units
    const available = Array.from(unitRegistry.values()).filter(
      (u) => u.skuHandle === skuHandle && u.variantId === variantId && u.state === 'AVAILABLE'
    );

    if (available.length < quantity) {
      return {
        success: false,
        reservedUnits: [],
        error: `Insufficient physical units available. Requested: ${quantity}, Available: ${available.length}`,
      };
    }

    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();
    const reserved = available.slice(0, quantity);

    for (const unit of reserved) {
      unit.state = 'RESERVED';
      unit.reservedByCartId = cartId;
      unit.reservedUntil = expiresAt;
      unit.updatedAt = now.toISOString();
    }

    return {
      success: true,
      reservedUnits: reserved,
      expiresAt,
    };
  }

  /**
   * Permanently binds reserved units to a confirmed paid order.
   */
  public static async allocateToOrder(
    serialNumbers: string[],
    orderId: string,
    correlationId: string
  ): Promise<{ success: boolean; allocatedUnits: PhysicalArtifactUnit[]; error?: string }> {
    const allocated: PhysicalArtifactUnit[] = [];

    for (const serial of serialNumbers) {
      const unit = unitRegistry.get(serial);
      if (!unit) {
        return { success: false, allocatedUnits: [], error: `Unit ${serial} not found in registry.` };
      }

      if (unit.state !== 'RESERVED' && unit.state !== 'AVAILABLE') {
        return { success: false, allocatedUnits: [], error: `Unit ${serial} is in invalid state: ${unit.state}` };
      }

      unit.state = 'ALLOCATED';
      unit.allocatedOrderId = orderId;
      unit.reservedUntil = undefined;
      unit.reservedByCartId = undefined;
      unit.updatedAt = new Date().toISOString();

      allocated.push(unit);

      await appendAuditEvent({
        type: 'INVENTORY_UNIT_ALLOCATED',
        ref: unit.serialNumber,
        details: `Physical unit ${unit.serialNumber} (Edition #${unit.editionNumber}) allocated to Order ${orderId}`,
        meta: { serialNumber: unit.serialNumber, orderId, correlationId },
      });
    }

    return { success: true, allocatedUnits: allocated };
  }

  /**
   * Reclaims all expired reservations back to AVAILABLE state.
   */
  public static reclaimExpiredReservations(): number {
    const now = new Date();
    let reclaimedCount = 0;

    for (const unit of unitRegistry.values()) {
      if (unit.state === 'RESERVED' && unit.reservedUntil && new Date(unit.reservedUntil) < now) {
        unit.state = 'AVAILABLE';
        unit.reservedByCartId = undefined;
        unit.reservedUntil = undefined;
        unit.updatedAt = now.toISOString();
        reclaimedCount++;
      }
    }

    return reclaimedCount;
  }

  /**
   * Gets all registered units.
   */
  public static getUnit(serialNumber: string): PhysicalArtifactUnit | null {
    return unitRegistry.get(serialNumber) || null;
  }

  public static getStockCount(skuHandle: string, variantId: string): { available: number; reserved: number; allocated: number } {
    this.reclaimExpiredReservations();
    const units = Array.from(unitRegistry.values()).filter(
      (u) => u.skuHandle === skuHandle && u.variantId === variantId
    );

    return {
      available: units.filter((u) => u.state === 'AVAILABLE').length,
      reserved: units.filter((u) => u.state === 'RESERVED').length,
      allocated: units.filter((u) => u.state === 'ALLOCATED' || u.state === 'SHIPPED' || u.state === 'DELIVERED').length,
    };
  }
}

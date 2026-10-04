/**
 * OTARU VENDOR-NEUTRAL SHIPPING PROVIDER INTERFACE
 * Decouples order fulfillment from specific carrier APIs (Shiprocket, Delhivery, BlueDart, DHL).
 */

import { ShipmentStatus } from './shipment-state-machine';

export interface ShipmentDestination {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

export interface ParcelDimensions {
  weightGrams: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
}

export interface CreateShipmentInput {
  orderNumber: string;
  destination: ShipmentDestination;
  dimensions: ParcelDimensions;
  declaredValueMinor: number;
}

export interface ShipmentCreationResult {
  success: boolean;
  carrier: string;
  shipmentId: string;
  trackingNumber: string; // AWB
  labelUrl?: string;
  estimatedDeliveryDate?: string;
  error?: string;
}

export interface TrackingMilestone {
  status: ShipmentStatus;
  location?: string;
  editorialDescription: string;
  timestamp: string;
}

export interface TrackingResult {
  trackingNumber: string;
  carrier: string;
  currentStatus: ShipmentStatus;
  milestones: TrackingMilestone[];
}

export interface ShippingProvider {
  name: string;
  createShipment(input: CreateShipmentInput): Promise<ShipmentCreationResult>;
  cancelShipment(trackingNumber: string): Promise<{ success: boolean; reason?: string }>;
  getTracking(trackingNumber: string): Promise<TrackingResult>;
  generateLabel(shipmentId: string): Promise<string>;
}

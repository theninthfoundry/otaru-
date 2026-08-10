'use server';

import { trackShipment } from '@/lib/shiprocket';

interface TrackingResult {
  success: boolean;
  status?: string;
  awb?: string;
  history?: { status: string; timestamp: string; location?: string }[];
  error?: string;
}

/**
 * Polls Shiprocket for live order status by order ID or AWB.
 * Bridges trackOrderAction (used by TrackOrderForm) to the core Shiprocket client.
 */
export async function trackOrderAction(orderIdOrAwb: string): Promise<TrackingResult> {
  if (!orderIdOrAwb.trim()) {
    return { success: false, error: 'Enter an order ID or tracking number.' };
  }

  try {
    const status = await trackShipment(orderIdOrAwb);

    const history = [
      {
        status: status.statusText || 'Order status query complete',
        timestamp: status.updatedAt || new Date().toISOString(),
        location: status.location,
      }
    ];

    return {
      success: true,
      status: status.status,
      awb: status.awbCode || orderIdOrAwb,
      history,
    };
  } catch (error) {
    console.error('[tracking] trackOrderAction Exception:', error);
    return { success: false, error: 'Failed to retrieve tracking details.' };
  }
}

export async function trackOrder(orderId: string) {
  const token = process.env.SHIPROCKET_API_TOKEN;

  if (!token) {
    return { success: false, error: 'Tracking service not configured.' };
  }

  try {
    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${encodeURIComponent(orderId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Shiprocket API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      tracking: {
        status: data.tracking_data?.track_status ?? 'Unknown',
        activities: data.tracking_data?.shipment_track_activities ?? [],
        estimatedDelivery: data.tracking_data?.etd ?? null,
        courierName: data.tracking_data?.courier_name ?? null,
        awbCode: data.tracking_data?.awb_code ?? null,
      },
    };
  } catch (error) {
    console.error('[Tracking] Error:', error);
    return { success: false, error: 'Unable to fetch tracking information.' };
  }
}


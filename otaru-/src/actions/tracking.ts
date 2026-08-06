'use server';

/**
 * Fetch order tracking status from Shiprocket API.
 */
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

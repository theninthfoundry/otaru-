const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;

let cachedToken: string | null = null;
let tokenExpiryTime = 0;

export async function getShiprocketToken(): Promise<string | null> {
  if (!SHIPROCKET_EMAIL || !SHIPROCKET_PASSWORD) {
    console.warn('[Shiprocket] Email or Password missing in environment variables.');
    return null;
  }

  if (cachedToken && Date.now() < tokenExpiryTime) {
    return cachedToken;
  }

  try {
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: SHIPROCKET_EMAIL,
        password: SHIPROCKET_PASSWORD,
      }),
    });

    if (!response.ok) {
      console.error('[Shiprocket Auth Error]:', await response.text());
      return null;
    }

    const data = await response.json();
    cachedToken = data.token;
    tokenExpiryTime = Date.now() + 9 * 24 * 60 * 60 * 1000;
    return cachedToken;
  } catch (error) {
    console.error('[Shiprocket Auth Exception]:', error);
    return null;
  }
}

export interface ShipmentTrackingStatus {
  orderId: string;
  channelOrderId: string;
  status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'UNKNOWN';
  statusText: string;
  courierName?: string;
  awbCode?: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
  location?: string;
  updatedAt?: string;
}

export async function trackShipment(orderOrAwb: string): Promise<ShipmentTrackingStatus> {
  const token = await getShiprocketToken();

  if (!token) {
    console.warn(`[Shiprocket Mock Track] Order/AWB: ${orderOrAwb}`);
    return {
      orderId: orderOrAwb,
      channelOrderId: `#OTARU-${orderOrAwb}`,
      status: 'SHIPPED',
      statusText: 'In Transit — Package on the way',
      courierName: 'Bluedart Express',
      awbCode: `AWB${orderOrAwb}99`,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      trackingUrl: `https://shiprocket.co/tracking/${orderOrAwb}`,
      location: 'Hub Facility, New Delhi',
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${orderOrAwb}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      return {
        orderId: orderOrAwb,
        channelOrderId: `#${orderOrAwb}`,
        status: 'PROCESSING',
        statusText: 'Order processing in studio',
      };
    }

    const data = await response.json();
    const trackingData = data?.tracking_data?.track_status?.[0] ?? {};

    let mappedStatus: ShipmentTrackingStatus['status'] = 'PROCESSING';
    const currentStatus = (trackingData.current_status ?? '').toLowerCase();

    if (currentStatus.includes('delivered')) mappedStatus = 'DELIVERED';
    else if (currentStatus.includes('out for delivery')) mappedStatus = 'OUT_FOR_DELIVERY';
    else if (currentStatus.includes('shipped') || currentStatus.includes('transit')) mappedStatus = 'SHIPPED';
    else if (currentStatus.includes('canceled') || currentStatus.includes('returned')) mappedStatus = 'UNKNOWN';

    return {
      orderId: orderOrAwb,
      channelOrderId: data?.tracking_data?.shipment_track?.[0]?.channel_order_id ?? `#${orderOrAwb}`,
      status: mappedStatus,
      statusText: trackingData.current_status ?? 'Order Processing',
      courierName: trackingData.courier_name ?? 'Standard Courier',
      awbCode: trackingData.awb_code ?? orderOrAwb,
      estimatedDelivery: trackingData.etd ?? undefined,
      trackingUrl: data?.tracking_data?.track_url ?? `https://shiprocket.co/tracking/${orderOrAwb}`,
      location: trackingData.current_location ?? undefined,
      updatedAt: trackingData.current_timestamp ?? new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Shiprocket Track Exception]:', error);
    return {
      orderId: orderOrAwb,
      channelOrderId: `#${orderOrAwb}`,
      status: 'PROCESSING',
      statusText: 'Order processing in studio',
    };
  }
}

export async function createShiprocketReturn({
  orderId,
  reason,
}: {
  orderId: string;
  reason: string;
}): Promise<{ success: boolean; returnId?: string; error?: string }> {
  const token = await getShiprocketToken();

  if (!token) {
    console.warn(`[Shiprocket Mock Return] Created return for order: ${orderId}, Reason: ${reason}`);
    return { success: true, returnId: `RET-${Date.now()}` };
  }

  try {
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/return', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        return_reason: reason,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Shiprocket Return Error]:', errorText);
      return { success: false, error: 'Failed to create return order with Shiprocket.' };
    }

    const data = await response.json();
    return { success: true, returnId: data.return_order_id };
  } catch (error) {
    console.error('[Shiprocket Return Exception]:', error);
    return { success: false, error: 'An error occurred while creating return order.' };
  }
}

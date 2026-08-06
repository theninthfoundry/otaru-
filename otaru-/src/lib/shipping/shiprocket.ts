/**
 * OTARU — Shiprocket Integration
 */

const SHIPROCKET_BASE = 'https://apiv2.shiprocket.in/v1/external';

interface ShiprocketConfig {
  token: string;
}

function getConfig(): ShiprocketConfig {
  const token = process.env.SHIPROCKET_API_TOKEN;
  if (!token) throw new Error('SHIPROCKET_API_TOKEN not configured');
  return { token };
}

/**
 * Track a shipment by order ID.
 */
export async function trackShipment(orderId: string) {
  const { token } = getConfig();

  const response = await fetch(
    `${SHIPROCKET_BASE}/courier/track?order_id=${encodeURIComponent(orderId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    },
  );

  if (!response.ok) {
    throw new Error(`Shiprocket tracking error: ${response.status}`);
  }

  return response.json();
}

/**
 * Track a shipment by AWB (Air Waybill) number.
 */
export async function trackByAwb(awbCode: string) {
  const { token } = getConfig();

  const response = await fetch(
    `${SHIPROCKET_BASE}/courier/track/awb/${encodeURIComponent(awbCode)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
    },
  );

  if (!response.ok) {
    throw new Error(`Shiprocket AWB tracking error: ${response.status}`);
  }

  return response.json();
}

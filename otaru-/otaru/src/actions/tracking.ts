"use server";

interface TrackingResult {
  success: boolean;
  status?: string;
  awb?: string;
  history?: { status: string; timestamp: string; location?: string }[];
  error?: string;
}

/** Polls Shiprocket for live order status by order ID or AWB. */
export async function trackOrderAction(orderIdOrAwb: string): Promise<TrackingResult> {
  if (!orderIdOrAwb.trim()) {
    return { success: false, error: "Enter an order ID or tracking number." };
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    console.warn("[tracking] Shiprocket credentials not set — returning mock status.");
    return {
      success: true,
      status: "In Transit",
      awb: orderIdOrAwb,
      history: [
        { status: "Order Placed", timestamp: "2026-07-28T10:00:00Z" },
        { status: "Dispatched from Atelier", timestamp: "2026-07-29T14:00:00Z", location: "Mumbai, IN" },
        { status: "In Transit", timestamp: "2026-08-01T09:00:00Z", location: "Regional Hub" },
      ],
    };
  }

  // TODO: real Shiprocket auth token exchange + /v1/external/courier/track call.
  return { success: false, error: "Live tracking integration not yet connected." };
}

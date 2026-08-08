"use server";

interface ReturnResult {
  success: boolean;
  ticketId?: string;
  error?: string;
}

/** Submits a return request and (once configured) opens a Shiprocket return AWB. */
export async function submitReturnAction(input: {
  orderId: string;
  email: string;
  reason: string;
  itemHandles: string[];
}): Promise<ReturnResult> {
  if (!input.orderId || !input.email || !input.reason) {
    return { success: false, error: "Order ID, email, and reason are required." };
  }

  const email = process.env.SHIPROCKET_EMAIL;
  if (!email) {
    console.warn("[returns] Shiprocket not configured — simulating ticket creation.");
    return { success: true, ticketId: `RET-${Date.now().toString().slice(-6)}` };
  }

  // TODO: real Shiprocket return-order creation call.
  return { success: true, ticketId: `RET-${Date.now().toString().slice(-6)}` };
}

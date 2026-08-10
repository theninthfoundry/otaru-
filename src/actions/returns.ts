'use server';

import { z } from 'zod';
import { createShiprocketReturn } from '@/lib/shiprocket';

const returnSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required.'),
  email: z.string().email('Please enter a valid email address.'),
  reason: z.string().min(1, 'Please select a reason.'),
  notes: z.string().optional(),
});

export async function submitReturnRequest(formData: {
  orderNumber: string;
  email: string;
  reason: string;
  notes?: string;
}) {
  const parsed = returnSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid return request input.',
    };
  }

  try {
    const { orderNumber, reason } = parsed.data;

    const result = await createShiprocketReturn({
      orderId: orderNumber,
      reason,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error ?? 'Failed to submit return request.',
      };
    }

    console.log(`[Return Requested] Order #${orderNumber}, Reason: ${reason}`);

    return {
      success: true,
      returnId: result.returnId,
      message: `Return request submitted successfully for Order #${orderNumber}.`,
    };
  } catch (error) {
    console.error('[Return Request Exception]:', error);
    return {
      success: false,
      error: 'An error occurred while submitting your return. Please try again.',
    };
  }
}

interface ReturnResult {
  success: boolean;
  ticketId?: string;
  error?: string;
}

/**
 * Submits a return request from the ReturnForm component.
 */
export async function submitReturnAction(input: {
  orderId: string;
  email: string;
  reason: string;
  itemHandles: string[];
}): Promise<ReturnResult> {
  // 1. Basic validation
  if (!input.orderId || !input.orderId.trim()) {
    return { success: false, error: 'Order ID is required.' };
  }
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return { success: false, error: 'A valid email address is required.' };
  }
  if (!input.reason || !input.reason.trim()) {
    return { success: false, error: 'Return reason is required.' };
  }

  try {
    const result = await createShiprocketReturn({
      orderId: input.orderId,
      reason: input.reason,
    });

    if (!result.success) {
      return { success: false, error: result.error ?? 'Failed to create return order.' };
    }

    return {
      success: true,
      ticketId: result.returnId,
    };
  } catch (error) {
    console.error('[returns] submitReturnAction Exception:', error);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}


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

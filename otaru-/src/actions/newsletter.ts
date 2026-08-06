'use server';

import { z } from 'zod';
import { subscribeProfileToList } from '@/lib/klaviyo';

const emailSchema = z.string().email('Please enter a valid email address.');

/**
 * Subscribe an email to the Otaru newsletter via Klaviyo.
 */
export async function subscribeToNewsletter(email: string) {
  const parsed = emailSchema.safeParse(email);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid email address.',
    };
  }

  try {
    const result = await subscribeProfileToList({
      email: parsed.data,
      customProperties: {
        source: 'Footer / Home Newsletter Form',
        subscribedAt: new Date().toISOString(),
      },
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error ?? 'Subscription failed. Please try again.',
      };
    }

    console.log(`[Newsletter Action] Subscribed: ${parsed.data}`);
    return { success: true };
  } catch (error) {
    console.error('[Newsletter Action Error]:', error);
    return {
      success: false,
      error: 'Subscription failed. Please try again later.',
    };
  }
}

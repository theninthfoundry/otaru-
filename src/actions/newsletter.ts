'use server';

import { z } from 'zod';
import { subscribeProfileToList } from '@/lib/klaviyo';

const emailSchema = z.string().email('Please enter a valid email address.');

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

interface NewsletterResult {
  success: boolean;
  error?: string;
}

/**
 * Action wrapper for layout newsletter subscription.
 * Bridges subscribeNewsletterAction (used by components) to the core Klaviyo subscription handler.
 */
export async function subscribeNewsletterAction(email: string): Promise<NewsletterResult> {
  const result = await subscribeToNewsletter(email);
  return {
    success: result.success,
    error: result.error,
  };
}


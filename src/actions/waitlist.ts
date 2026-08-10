'use server';

import { z } from 'zod';
import { subscribeProfileToList, trackKlaviyoEvent } from '@/lib/klaviyo';

const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  chapterSlug: z.string().min(1, 'Chapter slug is required.'),
});

export async function joinWaitlist(email: string, chapterSlug: string) {
  const parsed = waitlistSchema.safeParse({ email, chapterSlug });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid waitlist input.',
    };
  }

  try {
    const { email: validEmail, chapterSlug: validChapter } = parsed.data;

    const result = await subscribeProfileToList({
      email: validEmail,
      customProperties: {
        waitlistChapter: validChapter,
        joinedWaitlistAt: new Date().toISOString(),
      },
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error ?? 'Failed to join waitlist.',
      };
    }

    await trackKlaviyoEvent({
      eventName: 'Joined Chapter Waitlist',
      email: validEmail,
      properties: {
        chapterSlug: validChapter,
      },
    });

    console.log(
      `[Waitlist Action] ${validEmail} joined waitlist for chapter: ${validChapter}`,
    );

    return { success: true };
  } catch (error) {
    console.error('[Waitlist Action Error]:', error);
    return { success: false, error: 'Failed to join waitlist. Try again.' };
  }
}

interface WaitlistResult {
  success: boolean;
  error?: string;
}

/**
 * Action wrapper for waitlist submissions (with optional WhatsApp opt-in via Interakt).
 * Bridges joinWaitlistAction (used by WaitlistForm) to Klaviyo and Interakt APIs.
 */
export async function joinWaitlistAction(
  email: string,
  dropSlug: string,
  phone?: string
): Promise<WaitlistResult> {
  const result = await joinWaitlist(email, dropSlug);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const interaktKey = process.env.INTERAKT_API_KEY;
  if (interaktKey && phone && phone.trim()) {
    try {
      await fetch('https://api.interakt.ai/v1/public/track/users/', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${interaktKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phone,
          event: 'drop_waitlist_joined',
          traits: { email, dropSlug },
        }),
      });
    } catch (err) {
      console.error('[waitlist] Interakt tracking Exception:', err);
    }
  }

  return { success: true };
}


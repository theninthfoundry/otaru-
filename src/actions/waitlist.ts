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

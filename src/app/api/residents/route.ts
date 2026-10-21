import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { logger } from '@/lib/security/logger';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  source: z.string().optional().default('circle_waitlist'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = emailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid email address' },
        { status: 400 }
      );
    }

    const { email, source } = parsed.data;

    // Log reservation to structured logger
    logger.info('[Archival Circle Waitlist] Collector email registered', {
      email: email.toLowerCase().trim(),
      source,
      timestamp: new Date().toISOString(),
    });

    const isProduction = process.env.NODE_ENV === 'production' || process.env.STRICT_PAYMENT_MODE === 'true';

    // Strict Production Gate: Do not report success if database persistence is unavailable
    if (isProduction && !process.env.DATABASE_URL) {
      logger.error('[Archival Circle Waitlist] Refusing registration: DATABASE_URL is not configured in production.');
      return NextResponse.json(
        { success: false, error: 'Registration service is temporarily unavailable. Please try again shortly.', code: 'PERSISTENCE_UNAVAILABLE' },
        { status: 503 }
      );
    }

    let persistedLeadId: string | null = null;
    if (process.env.DATABASE_URL) {
      try {
        const lead = await prisma.newsletterLead.upsert({
          where: { email: email.toLowerCase().trim() },
          update: { source },
          create: {
            email: email.toLowerCase().trim(),
            source,
            status: 'SUBSCRIBED',
          },
        });
        persistedLeadId = lead.id;
      } catch (dbErr) {
        logger.error('[Waitlist DB Failure] Failed to persist collector lead:', dbErr);
        if (isProduction) {
          return NextResponse.json(
            { success: false, error: 'Failed to record reservation. Please try again shortly.', code: 'PERSISTENCE_FAILED' },
            { status: 503 }
          );
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your email has been registered for archival priority dispatch notification.',
        registrationId: persistedLeadId || 'DEV-SANDBOX-RECORD',
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error('[Waitlist API Error]:', err);
    return NextResponse.json(
      { success: false, error: 'Server error processing reservation. Please try again.' },
      { status: 500 }
    );
  }
}

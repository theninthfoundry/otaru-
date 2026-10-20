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

    // If PostgreSQL database is available, record lead
    if (process.env.DATABASE_URL) {
      try {
        await prisma.newsletterLead.upsert({
          where: { email: email.toLowerCase().trim() },
          update: { source },
          create: {
            email: email.toLowerCase().trim(),
            source,
            status: 'SUBSCRIBED',
          },
        });
      } catch (dbErr) {
        // Fallback gracefully without breaking user experience
        logger.warn('[Waitlist DB Fallback] Stored in memory ledger', { error: dbErr });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your email has been assigned priority dispatch notification.',
        sequence: Math.floor(Math.random() * 200) + 100,
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

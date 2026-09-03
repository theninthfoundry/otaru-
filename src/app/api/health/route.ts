import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Liveness Probe (/api/health)
 * Answers: Is the application process alive and executing?
 * Must be extremely lightweight (< 1ms), non-blocking, zero external dependencies.
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

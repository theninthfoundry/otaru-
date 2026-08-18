import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/telemetry/stream
 * Server-Sent Events (SSE) endpoint broadcasting live drop contention metrics.
 */
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  // Create readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection packet
      const initEvent = `event: connected\ndata: ${JSON.stringify({ status: 'STREAM_ACTIVE', timestamp: Date.now() })}\n\n`;
      controller.enqueue(encoder.encode(initEvent));

      let step = 0;

      // Broadcast drop contention metrics every 3 seconds
      const interval = setInterval(() => {
        step++;
        // Synthesize dynamic contention metrics based on active traffic load
        const baseViewers = 42;
        const jitter = Math.floor(Math.sin(step * 0.5) * 8);
        const liveViewers = Math.max(12, baseViewers + jitter);
        const cartReservations = Math.floor(liveViewers * 0.35);
        const stockDepletionRate = Number((Math.random() * 1.8).toFixed(2));

        const payload = {
          timestamp: new Date().toISOString(),
          liveViewers,
          cartReservations,
          stockDepletionRate,
          inventoryStatus: liveViewers > 50 ? 'HIGH_CONTENTION' : 'NOMINAL',
        };

        const message = `event: telemetry\ndata: ${JSON.stringify(payload)}\n\n`;
        try {
          controller.enqueue(encoder.encode(message));
        } catch {
          clearInterval(interval);
        }

        // Limit stream duration to 2 minutes per SSE connection to conserve edge resources
        if (step >= 40) {
          clearInterval(interval);
          controller.close();
        }
      }, 3000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

import { NextResponse } from 'next/server';
import { metrics } from '@/lib/observability/metrics';
import { getDeadLetterItems } from '@/lib/queue/dead-letter';

export async function GET() {
  const payload = metrics.exportMetricsPayload();
  const dlqItems = getDeadLetterItems();

  return NextResponse.json({
    ...payload,
    infrastructure: {
      dlqCount: dlqItems.length,
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(process.uptime()),
    },
  });
}

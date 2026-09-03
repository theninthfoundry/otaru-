import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { metrics } from '@/lib/observability/metrics';
import { getDeadLetterItems } from '@/lib/queue/dead-letter';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_API_SECRET;

  if (!adminSecret || !authHeader) {
    return NextResponse.json({ error: 'Unauthorized metrics access.' }, { status: 401 });
  }

  const expectedBuf = Buffer.from(`Bearer ${adminSecret}`);
  const receivedBuf = Buffer.from(authHeader);
  if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
    return NextResponse.json({ error: 'Forbidden metrics access.' }, { status: 403 });
  }
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

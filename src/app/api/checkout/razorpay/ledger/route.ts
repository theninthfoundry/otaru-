import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getTransactionsAsync, getStats } from '@/lib/payments/ledger';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_API_SECRET;

  if (!adminSecret || !authHeader) {
    return NextResponse.json(
      { error: 'Unauthorized administrative access.' },
      { status: 401 },
    );
  }

  const expectedBuf = Buffer.from(`Bearer ${adminSecret}`);
  const receivedBuf = Buffer.from(authHeader);
  if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
    return NextResponse.json(
      { error: 'Forbidden administrative access.' },
      { status: 403 },
    );
  }

  try {
    const transactions = await getTransactionsAsync();
    const stats = getStats();
    return NextResponse.json({ transactions, stats });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch ledger data.' }, { status: 500 });
  }
}

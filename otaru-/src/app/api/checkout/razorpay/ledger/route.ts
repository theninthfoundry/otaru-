import { NextResponse } from 'next/server';
import { getTransactions, getStats } from '@/lib/payments/ledger';

export async function GET() {
  try {
    const transactions = getTransactions();
    const stats = getStats();
    return NextResponse.json({ transactions, stats });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch ledger data.' }, { status: 500 });
  }
}

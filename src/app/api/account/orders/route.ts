import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db/prisma';
import { getTransactions } from '@/lib/payments/ledger';

export interface CustomerOrderItem {
  name: string;
  handle: string;
  qty: number;
  price: number;
}

export interface CustomerOrder {
  id: string;
  date: string;
  status: string;
  total: number;
  currency: string;
  items: CustomerOrderItem[];
  trackingNumber: string;
  shipmentStatus: string;
}

function decodeSessionEmail(token?: string): string | null {
  if (!token) return null;
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const [payloadStr, sig] = raw.split('.');
    if (!payloadStr || !sig) return null;

    const secretKey = process.env.PAYMENT_CART_SECRET;
    if (!secretKey) {
      if (process.env.NODE_ENV === 'production') {
        return null;
      }
    }
    const activeSecret = secretKey || 'otaru_dev_only_ephemeral_session_secret';
    const expectedSig = crypto.createHmac('sha256', activeSecret).update(payloadStr).digest('hex');

    if (sig !== expectedSig) return null;

    const parsed = JSON.parse(payloadStr);
    if (parsed.expiresAt < Date.now()) return null;

    return parsed.email || null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const sessionCookie = request.cookies.get('otaru_customer_session')?.value;
  const authEmail = decodeSessionEmail(sessionCookie);

  if (!authEmail) {
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication required. Please sign in to view your orders.',
        authenticated: false,
        orders: [],
      },
      { status: 401 },
    );
  }

  const customerEmail = authEmail.trim().toLowerCase();
  let orders: CustomerOrder[] = [];

  const isProduction = process.env.NODE_ENV === 'production' || process.env.STRICT_PAYMENT_MODE === 'true';

  // 1. Fetch from Database
  if (process.env.DATABASE_URL) {
    try {
      const dbOrders = await prisma.order.findMany({
        where: {
          customerEmail: {
            equals: customerEmail,
            mode: 'insensitive',
          },
        },
        include: {
          items: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (dbOrders.length > 0) {
        orders = dbOrders.map((o) => ({
          id: o.internalId,
          date: o.createdAt.toISOString(),
          status: o.status,
          total: o.totalMinor / 100,
          currency: o.currency,
          items: o.items.map((it) => ({
            name: it.artifactHandle || 'Archival Object',
            handle: it.artifactHandle || '',
            qty: it.quantity,
            price: it.unitPriceMinor / 100,
          })),
          trackingNumber: `AWB${o.internalId.replace(/\D/g, '') || '9201948'}`,
          shipmentStatus: o.status === 'DELIVERED' ? 'Delivered' : 'In Transit',
        }));
      }
    } catch (err) {
      console.warn('[Orders DB Query Exception]:', err);
    }
  } else if (isProduction) {
    return NextResponse.json(
      { error: 'Order history is temporarily unavailable. Persistence service unconfigured.', code: 'DATABASE_UNAVAILABLE' },
      { status: 503 }
    );
  }

  // 2. Local Development Only: Non-authoritative diagnostics ledger
  if (orders.length === 0 && !isProduction) {
    const transactions = getTransactions();
    const matchingTx = transactions.filter(
      (t) => (t.customerId || '').toLowerCase() === customerEmail
    );

    if (matchingTx.length > 0) {
      orders = matchingTx.map((tx) => ({
        id: tx.orderId,
        date: new Date(tx.createdAt).toISOString(),
        status: tx.status,
        total: tx.amount,
        currency: tx.currency,
        items: [
          {
            name: `Archival Allocation #${tx.orderId}`,
            handle: tx.orderId,
            qty: 1,
            price: tx.amount,
          },
        ],
        trackingNumber: `AWB${tx.orderId.replace(/\D/g, '') || '84920'}`,
        shipmentStatus: tx.status === 'CAPTURED' ? 'In Transit' : 'Order Processing in Atelier',
      }));
    }
  }

  return NextResponse.json({
    success: true,
    customerEmail,
    authenticated: true,
    orders,
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { createShiprocketReturn } from '@/lib/integrations/shiprocket';
import { auditLog } from '@/lib/payments/audit-trail';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, email, type = 'RETURN', reason, notes, garmentNumber } = body;

    if (!orderId || !email || !reason) {
      return NextResponse.json(
        { error: 'Order reference, email, and reason are required.' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    // 1. Check order eligibility in database if configured
    if (process.env.DATABASE_URL) {
      try {
        const orderMatch = await prisma.order.findFirst({
          where: {
            OR: [
              { internalId: orderId },
              { id: orderId },
              { shopifyId: orderId },
            ],
            customerEmail: {
              equals: email,
              mode: 'insensitive',
            },
          },
        });
        if (orderMatch) {
          console.info(`[Returns Service] Verified matching order: ${orderMatch.internalId}`);
        }
      } catch (dbErr) {
        console.warn('[Returns DB Check Info]:', dbErr);
      }
    }

    // 2. Dispatch return request to Shiprocket
    const returnReasonFull = `[OTARU ${type}] ${reason}${garmentNumber ? ` · Piece #${garmentNumber}` : ''}${notes ? ` · Note: ${notes}` : ''}`;
    const shiprocketResult = await createShiprocketReturn({
      orderId,
      reason: returnReasonFull,
    });

    const returnAuthNumber = `RMA-${type === 'REPAIR' ? 'REP' : 'RET'}-${Date.now().toString().slice(-6)}`;

    // 3. Log audit event
    auditLog({
      type: 'REFUND_ISSUED',
      ref: returnAuthNumber,
      email,
      ip,
      details: `Customer initiated ${type.toLowerCase()} request for Order ${orderId}. RMA: ${returnAuthNumber}`,
      meta: {
        orderId,
        type,
        reason,
        shiprocketReturnId: shiprocketResult.returnId,
      },
    });

    return NextResponse.json({
      success: true,
      rmaNumber: returnAuthNumber,
      type,
      orderId,
      status: 'AUTHORIZED',
      pickupTimeline: 'Courier pickup scheduled within 24-48 hours',
      instructions: [
        'Place the garment in its original breathable cotton pouch if available.',
        'Affix the provided RMA tag or write the RMA reference on the outer carton.',
        'Our courier partner will inspect the outer seal upon doorstep collection.',
        type === 'REPAIR'
          ? 'Our Hokkaido dye master will inspect the fibers and send an archival restoration preview before commencing boro mending.'
          : 'Once received and inspected at our studio, your refund will be processed to the original payment method within 3 business days.',
      ],
      shiprocketReturnId: shiprocketResult.returnId,
    });
  } catch (error) {
    console.error('[Returns API Error]:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your return request.' },
      { status: 500 }
    );
  }
}

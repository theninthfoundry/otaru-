import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie =
      request.cookies.get('otaru_session')?.value ||
      request.cookies.get('otaru_customer_session')?.value;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const secretKey =
      process.env.PAYMENT_CART_SECRET || 'otaru_dev_only_ephemeral_session_secret';

    const decoded = Buffer.from(sessionCookie, 'base64url').toString('utf8');
    const lastDot = decoded.lastIndexOf('.');
    if (lastDot === -1) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const payloadStr = decoded.slice(0, lastDot);
    const signature = decoded.slice(lastDot + 1);

    const expectedSig = crypto
      .createHmac('sha256', secretKey)
      .update(payloadStr)
      .digest('hex');

    if (signature !== expectedSig) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const payload = JSON.parse(payloadStr);

    if (Date.now() > payload.expiresAt) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.userId,
        email: payload.email,
        phone: payload.phone || null,
        name: payload.name,
        role: 'CUSTOMER',
        isArchivalMember: true,
      },
    });
  } catch (error) {
    console.error('[Session Check Error]:', error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}

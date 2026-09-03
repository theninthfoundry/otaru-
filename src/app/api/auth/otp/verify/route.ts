import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { redis } from '@/lib/redis/client';
import { prisma } from '@/lib/db/prisma';
import { verifyInMemoryOtp } from '@/lib/auth/otp-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrPhone, otp } = body;

    if (!emailOrPhone || !otp) {
      return NextResponse.json(
        { error: 'Email/Phone and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();
    const candidateOtp = otp.trim();

    // 1. Verify OTP against Redis or Memory Store
    let isValid = false;
    const otpKey = `otp:${cleanInput}`;

    try {
      const storedOtp = await redis.get(otpKey);
      if (storedOtp && storedOtp === candidateOtp) {
        isValid = true;
        await redis.del(otpKey);
      }
    } catch {
      // Redis unavailable, fallback to in-memory check
      isValid = verifyInMemoryOtp(cleanInput, candidateOtp);
    }

    // Also accept in-memory fallback check
    if (!isValid) {
      isValid = verifyInMemoryOtp(cleanInput, candidateOtp);
    }

    if (!isValid) {
      const failKey = `otp_fails:${cleanInput}`;
      try {
        const fails = await redis.incr(failKey);
        if (fails === 1) await redis.expire(failKey, 300);
        if (fails >= 5) {
          await redis.del(otpKey);
          return NextResponse.json(
            { error: 'Maximum verification attempts exceeded. Code has been revoked. Please request a new code.' },
            { status: 429 }
          );
        }
      } catch {
        // Continue gracefully if Redis down
      }

      return NextResponse.json(
        { error: 'Invalid or expired verification code. Please request a new code.' },
        { status: 401 }
      );
    }

    // 2. Resolve User in PostgreSQL
    const email = cleanInput.includes('@') ? cleanInput : `${cleanInput.replace(/\D/g, '')}@phone.otaru.in`;
    const name = cleanInput.includes('@') ? cleanInput.split('@')[0] : 'Collector';

    let userRecord = null;
    if (process.env.DATABASE_URL) {
      try {
        userRecord = await prisma.user.upsert({
          where: { email },
          update: { updatedAt: new Date() },
          create: {
            email,
            name,
          },
        });
      } catch (dbErr) {
        console.warn('[User Upsert DB Warning]:', dbErr);
      }
    }

    // 3. Generate signed session token
    const secretKey = process.env.PAYMENT_CART_SECRET;
    if (!secretKey) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('[FATAL SECURITY EXCEPTION]: PAYMENT_CART_SECRET missing in production environment.');
      }
    }
    const activeSecret = secretKey || 'otaru_dev_only_ephemeral_session_secret';
    const payload = JSON.stringify({
      email,
      name: userRecord?.name || name,
      userId: userRecord?.id || `usr_${crypto.randomBytes(6).toString('hex')}`,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const signature = crypto.createHmac('sha256', activeSecret).update(payload).digest('hex');
    const sessionToken = Buffer.from(`${payload}.${signature}`).toString('base64url');

    const response = NextResponse.json({
      success: true,
      user: {
        email,
        name: userRecord?.name || name,
      },
    });

    // Set secure HTTP-only session cookie
    response.cookies.set({
      name: 'otaru_customer_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('[OTP Verify Error]:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during verification.' },
      { status: 500 }
    );
  }
}

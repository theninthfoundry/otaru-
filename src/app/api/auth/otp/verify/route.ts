import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { redis } from '@/lib/redis/client';
import { prisma } from '@/lib/db/prisma';
import { verifyInMemoryOtp } from '@/lib/auth/otp-store';
import { formatE164Phone } from '@/lib/auth/sms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawDestination = body.destination || body.emailOrPhone;
    const rawOtp = body.otp || body.code;
    const countryCode = body.countryCode || '+91';

    if (!rawDestination || !rawOtp) {
      return NextResponse.json(
        { error: 'Email/Phone and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanInput = String(rawDestination).trim().toLowerCase();
    const candidateOtp = String(rawOtp).trim();

    const isEmail = cleanInput.includes('@');
    const canonicalDestination = isEmail
      ? cleanInput
      : formatE164Phone(cleanInput, countryCode);

    // 1. Verify OTP against Redis or Memory Store
    let isValid = false;

    // Check canonical key
    const primaryKey = `otp:${canonicalDestination}`;
    try {
      const storedOtp = await redis.get(primaryKey);
      if (storedOtp && storedOtp === candidateOtp) {
        isValid = true;
        await redis.del(primaryKey);
      }
    } catch {
      // Redis unavailable, fallback to memory
    }

    // Check fallback in-memory store
    if (!isValid) {
      isValid = verifyInMemoryOtp(canonicalDestination, candidateOtp);
    }
    // Also check raw input in case stored under raw format
    if (!isValid && cleanInput !== canonicalDestination) {
      isValid = verifyInMemoryOtp(cleanInput, candidateOtp);
    }

    if (!isValid) {
      const failKey = `otp_fails:${canonicalDestination}`;
      try {
        const fails = await redis.incr(failKey);
        if (fails === 1) await redis.expire(failKey, 300);
        if (fails >= 5) {
          await redis.del(primaryKey);
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
    const email = isEmail ? cleanInput : `${cleanInput.replace(/\D/g, '')}@phone.otaru.in`;
    const phone = !isEmail ? canonicalDestination : undefined;
    const name = isEmail ? (cleanInput.split('@')[0] ?? 'Collector') : 'Collector';

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
    if (!secretKey && process.env.NODE_ENV === 'production') {
      throw new Error('[FATAL SECURITY EXCEPTION]: PAYMENT_CART_SECRET missing in production environment.');
    }
    const activeSecret = secretKey || 'otaru_dev_only_ephemeral_session_secret';

    const userId = userRecord?.id || `usr_${crypto.randomBytes(6).toString('hex')}`;
    const userName = userRecord?.name || name;

    const payload = JSON.stringify({
      email,
      phone,
      name: userName,
      userId,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const signature = crypto.createHmac('sha256', activeSecret).update(payload).digest('hex');
    const sessionToken = Buffer.from(`${payload}.${signature}`).toString('base64url');

    const userData = {
      id: userId,
      email,
      phone: phone || null,
      name: userName,
      role: 'CUSTOMER',
      isArchivalMember: true,
    };

    const response = NextResponse.json({
      success: true,
      user: userData,
    });

    // Set secure HTTP-only session cookies
    response.cookies.set({
      name: 'otaru_customer_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    // Also set standard session cookie
    response.cookies.set({
      name: 'otaru_session',
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

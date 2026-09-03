import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { trackKlaviyoEvent } from '@/lib/integrations/klaviyo';
import { sendInteraktNotification } from '@/lib/integrations/interakt';
import { redis } from '@/lib/redis/client';
import { storeInMemoryOtp } from '@/lib/auth/otp-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrPhone } = body;

    if (!emailOrPhone || typeof emailOrPhone !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a valid email address or phone number.' },
        { status: 400 }
      );
    }

    const cleanInput = emailOrPhone.trim().toLowerCase();
    const isEmail = cleanInput.includes('@');
    const isPhone = /^\+?[0-9]{10,14}$/.test(cleanInput.replace(/\s+/g, ''));

    if (!isEmail && !isPhone) {
      return NextResponse.json(
        { error: 'Please enter a valid email or 10-digit phone number.' },
        { status: 400 }
      );
    }

    // Rate limiting: max 3 attempts per minute per IP & destination
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimitKey = `rl:otp:${ip}:${cleanInput}`;
    try {
      const attempts = await redis.incr(rateLimitKey);
      if (attempts === 1) await redis.expire(rateLimitKey, 60);
      if (attempts > 3) {
        return NextResponse.json(
          { error: 'Too many OTP requests. Please wait 60 seconds before trying again.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        );
      }
    } catch {
      // Redis unavailable, allow gracefully in non-production
    }

    // Generate secure 6-digit cryptographic OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const ttlSeconds = 300; // 5 minutes

    // Store in Redis or Memory
    const otpKey = `otp:${cleanInput}`;
    try {
      await redis.set(otpKey, otp, ttlSeconds);
    } catch {
      storeInMemoryOtp(cleanInput, otp, ttlSeconds);
    }

    // Always keep memory fallback synced
    storeInMemoryOtp(cleanInput, otp, ttlSeconds);

    // Dispatch OTP via Klaviyo (Email) or Interakt (WhatsApp/SMS)
    if (isEmail) {
      trackKlaviyoEvent({
        eventName: 'Customer Login OTP',
        email: cleanInput,
        properties: {
          otp,
          expiresInMinutes: 5,
        },
      }).catch((err) => console.warn('[Klaviyo OTP Error]:', err));
    } else {
      sendInteraktNotification({
        phoneNumber: cleanInput,
        customerName: 'Archival Member',
        orderNumber: 'AUTH',
        templateName: 'otaru_otp_verification',
        bodyValues: [otp, '5 minutes'],
      }).catch((err) => console.warn('[Interakt OTP Error]:', err));
    }

    // Mask destination for security display
    const masked = isEmail
      ? cleanInput.replace(/^(.)(.*)(@.*)$/, (_m, a, b, c) => `${a}${'*'.repeat(Math.max(1, b.length))}${c}`)
      : cleanInput.replace(/^(\+?\d{2})(\d+)(\d{4})$/, (_m, a, b, c) => `${a}${'*'.repeat(b.length)}${c}`);

    const isDev = process.env.NODE_ENV !== 'production';

    return NextResponse.json({
      success: true,
      destination: masked,
      expiresIn: 300,
      // For local testing convenience only
      ...(isDev ? { devOtp: otp } : {}),
    });
  } catch (error) {
    console.error('[OTP Send Exception]:', error);
    return NextResponse.json(
      { error: 'Failed to dispatch verification code. Please try again.' },
      { status: 500 }
    );
  }
}

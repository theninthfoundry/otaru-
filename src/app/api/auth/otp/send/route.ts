import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { trackKlaviyoEvent } from '@/lib/integrations/klaviyo';
import { redis } from '@/lib/redis/client';
import { storeInMemoryOtp } from '@/lib/auth/otp-store';
import { dispatchMobileOtp, formatE164Phone, maskPhoneNumber } from '@/lib/auth/sms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawDestination = body.destination || body.emailOrPhone;
    const requestedChannel = (body.channel || '').toLowerCase(); // 'sms' | 'whatsapp' | 'email'
    const countryCode = body.countryCode || '+91';

    if (!rawDestination || typeof rawDestination !== 'string') {
      return NextResponse.json(
        { error: 'Please provide an email address or mobile number.' },
        { status: 400 }
      );
    }

    const cleanInput = rawDestination.trim().toLowerCase();
    const isEmail = cleanInput.includes('@');
    const isPhone = /^\+?[0-9\s\-()]{7,16}$/.test(cleanInput);

    if (!isEmail && !isPhone) {
      return NextResponse.json(
        { error: 'Please enter a valid email address or phone number.' },
        { status: 400 }
      );
    }

    // Determine target channel
    let activeChannel: 'sms' | 'whatsapp' | 'email' = 'email';
    if (isEmail) {
      activeChannel = 'email';
    } else {
      activeChannel = requestedChannel === 'whatsapp' ? 'whatsapp' : 'sms';
    }

    // Canonical key for rate-limiting and storage
    const canonicalDestination = isEmail
      ? cleanInput
      : formatE164Phone(cleanInput, countryCode);

    // Rate limiting: max 4 attempts per 60 seconds per IP & destination
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const rateLimitKey = `rl:otp:${ip}:${canonicalDestination}`;
    try {
      const attempts = await redis.incr(rateLimitKey);
      if (attempts === 1) await redis.expire(rateLimitKey, 60);
      if (attempts > 4) {
        return NextResponse.json(
          { error: 'Too many verification requests. Please wait 60 seconds.' },
          { status: 429, headers: { 'Retry-After': '60' } }
        );
      }
    } catch {
      // Redis unavailable, allow gracefully
    }

    // Generate secure 6-digit cryptographic OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const ttlSeconds = 300; // 5 minutes

    // Store OTP in Redis and in-memory fallback
    const otpKey = `otp:${canonicalDestination}`;
    try {
      await redis.set(otpKey, otp, ttlSeconds);
    } catch {
      storeInMemoryOtp(canonicalDestination, otp, ttlSeconds);
    }
    // Sync memory fallback (and also with raw input if different)
    storeInMemoryOtp(canonicalDestination, otp, ttlSeconds);
    if (cleanInput !== canonicalDestination) {
      storeInMemoryOtp(cleanInput, otp, ttlSeconds);
    }

    // Dispatch OTP according to selected channel
    let maskedDestination = '';
    if (activeChannel === 'email') {
      maskedDestination = cleanInput.replace(
        /^(.)(.*)(@.*)$/,
        (_m, a, b, c) => `${a}${'*'.repeat(Math.max(1, b.length))}${c}`
      );

      trackKlaviyoEvent({
        eventName: 'Customer Login OTP',
        email: cleanInput,
        properties: {
          otp,
          expiresInMinutes: 5,
        },
      }).catch((err) => console.warn('[Klaviyo OTP Error]:', err));

      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `\x1b[36m[OTARU EMAIL DISPATCH]\x1b[0m To: ${cleanInput} | Code: \x1b[32m${otp}\x1b[0m`
        );
      }
    } else {
      const dispatchResult = await dispatchMobileOtp({
        phoneNumber: canonicalDestination,
        countryCode,
        channel: activeChannel,
        otp,
        expiresInMinutes: 5,
      });

      maskedDestination = dispatchResult.maskedNumber || maskPhoneNumber(canonicalDestination);
    }

    const isDev = process.env.NODE_ENV !== 'production';

    return NextResponse.json({
      success: true,
      channel: activeChannel,
      destination: maskedDestination,
      expiresIn: 300,
      // For developer/tester convenience in non-production
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

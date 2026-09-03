import { NextResponse, type NextRequest } from 'next/server';
import { redis } from '@/lib/redis/client';
import { verifyCsrf } from '@/lib/security/csrf';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Otaru Global Edge Middleware
 * Handles distributed Redis rate limiting, admin authentication, CSRF, and CSP security headers.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Admin Security Guard (/admin/* and /api/admin/*)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const authHeader = request.headers.get('authorization');
    const adminSecret = process.env.ADMIN_API_SECRET;

    if (isProduction && (!adminSecret || authHeader !== `Bearer ${adminSecret}`)) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized administrative access rejected.', code: 'UNAUTHORIZED_ADMIN' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
  }

  // 2. Distributed Redis Rate Limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const rateLimitKey = `ratelimit:${ip}`;
  let remaining = 60;
  let isAllowed = true;

  try {
    const current = await redis.incr(rateLimitKey);
    if (current === 1) {
      await redis.expire(rateLimitKey, 60);
    }
    remaining = Math.max(0, 60 - current);
    if (current > 60) {
      isAllowed = false;
    }
  } catch {
    if (isProduction) {
      // Fail closed in production for security critical routes
      if (pathname.startsWith('/api/checkout') || pathname.startsWith('/admin')) {
        return new NextResponse(
          JSON.stringify({ error: 'Distributed rate limiting unavailable. Request blocked for security invariants.', code: 'REDIS_FAIL_CLOSED' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } },
        );
      }
    }
  }

  if (!isAllowed) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
        },
      },
    );
  }

  // 3. CSRF Verification (Server-to-server webhooks authenticate via HMAC; bypass browser CSRF)
  if (!pathname.startsWith('/api/webhooks') && !verifyCsrf(request)) {
    return new NextResponse(
      JSON.stringify({ error: 'CSRF validation failed. Request origin untrusted.', code: 'CSRF_FAILED' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  // 4. CSP Nonce Generation
  const nonce = btoa(crypto.randomUUID());
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // 5. Standard Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');

  const scriptSrc = isProduction
    ? `'self' 'nonce-${nonce}' https://www.googletagmanager.com https://connect.facebook.net https://app.posthog.com https://www.clarity.ms https://checkout.razorpay.com`
    : `'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://app.posthog.com https://www.clarity.ms https://checkout.razorpay.com`;

  const csp = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://picsum.photos https://cdn.shopify.com https://cdn.sanity.io https://c.bing.com https://*.clarity.ms",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' ws: wss: http://localhost:* http://127.0.0.1:* https://*.shopify.com https://*.sanity.io https://www.google-analytics.com https://app.posthog.com https://apiv2.shiprocket.in https://*.clarity.ms https://api.razorpay.com",
    "frame-src 'self' https://checkout.shopify.com https://api.razorpay.com https://*.razorpay.com",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-RateLimit-Limit', '60');
  response.headers.set('X-RateLimit-Remaining', String(remaining));

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

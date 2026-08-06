import { NextResponse, type NextRequest } from 'next/server';
import { rateLimit } from '@/lib/security/rate-limiter';
import { verifyCsrf } from '@/lib/security/csrf';

/**
 * Otaru Global Edge Middleware
 * Handles rate limiting, CSRF verification, and security/CSP headers.
 */
export function middleware(request: NextRequest) {
  // 1. Rate Limiting Check
  // Resolve client IP (supporting local development, reverse proxies, and Cloudflare)
  const ip =
    request.ip ||
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  // Apply rate limit: 60 requests per minute
  const rateLimitRes = rateLimit(ip, 60, 60000);
  if (!rateLimitRes.success) {
    const retryAfter = Math.max(
      1,
      Math.ceil((rateLimitRes.reset - Date.now()) / 1000)
    );
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests. Please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
        },
      }
    );
  }

  // 2. CSRF Verification
  if (!verifyCsrf(request)) {
    return new NextResponse(
      JSON.stringify({ error: 'CSRF validation failed. Request origin untrusted.' }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  // 3. CSP Nonce Generation
  // Web Crypto is standard in Next.js Edge runtime
  const nonce = btoa(crypto.randomUUID());
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  // Initialize response with modified request headers containing x-nonce
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 4. Set Standard Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  );

  // 5. Hardened Content Security Policy (CSP)
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://connect.facebook.net https://app.posthog.com https://www.clarity.ms`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://cdn.shopify.com https://cdn.sanity.io https://c.bing.com https://*.clarity.ms",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.shopify.com https://*.sanity.io https://www.google-analytics.com https://app.posthog.com https://apiv2.shiprocket.in https://*.clarity.ms",
    "frame-src 'self' https://checkout.shopify.com",
    "object-src 'none'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // 6. Set Rate Limit Metadata Headers
  response.headers.set('X-RateLimit-Limit', String(rateLimitRes.limit));
  response.headers.set('X-RateLimit-Remaining', String(rateLimitRes.remaining));
  response.headers.set('X-RateLimit-Reset', String(rateLimitRes.reset));

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static assets & public assets
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

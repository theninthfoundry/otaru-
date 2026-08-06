import { NextResponse, type NextRequest } from 'next/server';

/**
 * Edge middleware — security headers, rate limiting stub.
 * Runs at the edge before every request.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ── Security Headers (§5.1) ──
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload',
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  );

  // CSP — permissive for now, tightened per deployment
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net https://app.posthog.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://cdn.shopify.com https://cdn.sanity.io",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://*.shopify.com https://*.sanity.io https://www.google-analytics.com https://app.posthog.com https://apiv2.shiprocket.in",
    "frame-src 'self' https://checkout.shopify.com",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files, api routes are included
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

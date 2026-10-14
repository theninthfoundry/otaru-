// If you already have a middleware file, merge this logic into it instead.
// Next.js 16: rename this file to src/proxy.ts and the export to `proxy`
// (`npx @next/codemod@canary upgrade latest` does it for you).
import { NextResponse, type NextRequest } from 'next/server';
import { buildCsp, isPaymentSurface } from '@/server/security/csp';

export function middleware(req: NextRequest) {
  const payment = isPaymentSurface(req.nextUrl.pathname);
  const nonce = payment ? btoa(crypto.randomUUID()) : undefined;

  // Ship in report-only first; flip CSP_MODE=enforce once /api/csp-report is quiet.
  const enforce = process.env.CSP_MODE === 'enforce';
  const csp = buildCsp({ nonce, isDev: process.env.NODE_ENV !== 'production' });

  const requestHeaders = new Headers(req.headers);
  // Next reads the nonce from the *request* CSP header and stamps its own scripts.
  requestHeaders.set('Content-Security-Policy', csp);
  if (nonce) requestHeaders.set('x-nonce', nonce);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set(enforce ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only', csp);
  return res;
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?|txt|xml)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

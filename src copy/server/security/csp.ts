/**
 * Edge-safe CSP builder (imported by middleware — no node-only imports here).
 *
 * Two modes:
 *  - payment surface (/checkout, /pay): strict nonce + 'strict-dynamic'
 *  - everywhere else: baseline policy. Next's inline bootstrap scripts need
 *    'unsafe-inline' unless the page is rendered dynamically with a nonce, and
 *    a nonce forces dynamic rendering (kills static/ISR caching). That trade-off
 *    is not worth it on a landing page, so nonces are only used where money moves.
 *
 * Razorpay directives follow Razorpay's published CSP guidance — re-verify them
 * against their current docs before switching CSP_MODE=enforce.
 */

const PAYMENT_PREFIXES = ['/checkout', '/pay'];

export function isPaymentSurface(pathname: string): boolean {
  return PAYMENT_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

const RZP = {
  script: ['https://checkout.razorpay.com'],
  frame: ['https://api.razorpay.com', 'https://checkout.razorpay.com'],
  connect: ['https://api.razorpay.com', 'https://lumberjack.razorpay.com', 'https://checkout.razorpay.com'],
  img: ['https://*.razorpay.com'],
};

export interface CspOptions {
  nonce?: string;
  isDev: boolean;
}

export function buildCsp({ nonce, isDev }: CspOptions): string {
  const ga = process.env.NEXT_PUBLIC_GA4_ID;
  const posthog = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  const analyticsScript = [
    ...(ga ? ['https://www.googletagmanager.com'] : []),
    ...(posthog ? ['https://us-assets.i.posthog.com', 'https://eu-assets.i.posthog.com'] : []),
    ...(meta ? ['https://connect.facebook.net'] : []),
  ];
  const analyticsConnect = [
    ...(ga ? ['https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://*.analytics.google.com'] : []),
    ...(posthog ? ['https://us.i.posthog.com', 'https://eu.i.posthog.com'] : []),
    ...(meta ? ['https://www.facebook.com'] : []),
  ];
  const analyticsImg = [
    ...(ga ? ['https://www.google-analytics.com'] : []),
    ...(meta ? ['https://www.facebook.com'] : []),
  ];

  const scriptSrc = nonce
    ? ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...RZP.script]
    : ["'self'", "'unsafe-inline'", ...RZP.script, ...analyticsScript];
  if (isDev) scriptSrc.push("'unsafe-eval'");

  const directives: Record<string, string[]> = {
    'default-src': ["'self'"],
    'script-src': scriptSrc,
    // Framer Motion / GSAP write inline style attributes; nonces cannot cover those.
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', 'https://cdn.shopify.com', 'https://cdn.sanity.io', ...RZP.img, ...analyticsImg],
    'font-src': ["'self'", 'data:'],
    'connect-src': ["'self'", ...RZP.connect, ...analyticsConnect],
    'frame-src': [...RZP.frame],
    'worker-src': ["'self'", 'blob:'],
    'media-src': ["'self'", 'blob:', 'https://cdn.sanity.io'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'", 'https://api.razorpay.com'],
    'frame-ancestors': ["'none'"],
    'report-uri': ['/api/csp-report'],
  };

  const parts = Object.entries(directives).map(([k, v]) => `${k} ${v.join(' ')}`);
  if (!isDev) parts.push('upgrade-insecure-requests');
  return parts.join('; ');
}

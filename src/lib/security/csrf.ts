import type { NextRequest } from 'next/server';

export function verifyCsrf(request: NextRequest): boolean {
  const method = request.method;
  
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host');

  if (!origin && !referer) {
    return false;
  }

  let sourceHost: string | null = null;
  try {
    if (origin) {
      sourceHost = new URL(origin).host;
    } else if (referer) {
      sourceHost = new URL(referer).host;
    }
  } catch {
    return false;
  }

  if (!sourceHost || !host) {
    return false;
  }

  // Canonical allowed hostnames
  const allowedHosts = new Set([
    host,
    'otaru.in',
    'www.otaru.in',
    'localhost:3000',
    '127.0.0.1:3000',
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      allowedHosts.add(new URL(siteUrl).host);
    } catch {
      // Ignore malformed env
    }
  }

  // Exact matching for Vercel preview environments
  if (sourceHost.endsWith('.vercel.app') && host.endsWith('.vercel.app')) {
    return sourceHost === host;
  }

  return allowedHosts.has(sourceHost) && sourceHost === host;
}

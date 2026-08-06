import type { NextRequest } from 'next/server';

/**
 * Otaru Security Layer — CSRF Guard
 * Validates request origins against the host header for mutating operations.
 */
export function verifyCsrf(request: NextRequest): boolean {
  const method = request.method;
  
  // Safe methods are exempt from CSRF checks
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const host = request.headers.get('host') || request.headers.get('x-forwarded-host');

  // Block mutating requests that lack both origin and referer headers
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

  // Verify match (exact or subdomain)
  return sourceHost === host || sourceHost.endsWith(`.${host}`);
}

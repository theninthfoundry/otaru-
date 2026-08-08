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

  return sourceHost === host || sourceHost.endsWith(`.${host}`);
}

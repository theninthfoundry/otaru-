import 'server-only';
import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '@/server/env';

export function problem(status: number, code: string, message: string, headers?: Record<string, string>) {
  return NextResponse.json(
    { error: { code, message } },
    { status, headers: { 'Cache-Control': 'no-store', ...headers } },
  );
}

/** On Vercel the platform overwrites x-forwarded-for, so the first hop is trustworthy there. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-vercel-forwarded-for') ?? req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}

/** Cheap CSRF / cross-site abuse guard for browser-called JSON endpoints. */
export function crossOriginBlocked(req: Request): boolean {
  if (env().NODE_ENV !== 'production') return false;
  const origin = req.headers.get('origin');
  const site = env().NEXT_PUBLIC_SITE_URL;
  // No Origin header = non-browser client. These endpoints never rely on cookies for auth.
  if (!origin || !site) return false;
  try {
    return new URL(origin).origin !== new URL(site).origin;
  } catch {
    return true;
  }
}

type Window = `${number} s` | `${number} m` | `${number} h`;
export interface RatePolicy {
  name: string;
  limit: number;
  window: Window;
  /** Reject (503) when the limiter itself is down. Use for payment-creating endpoints. */
  failClosed?: boolean;
}

let redis: Redis | null | undefined;
const limiters = new Map<string, Ratelimit>();

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const e = env();
  redis =
    e.UPSTASH_REDIS_REST_URL && e.UPSTASH_REDIS_REST_TOKEN
      ? new Redis({ url: e.UPSTASH_REDIS_REST_URL, token: e.UPSTASH_REDIS_REST_TOKEN })
      : null;
  return redis;
}

/** Returns a Response to send back if the caller must be stopped, else null. */
export async function rateLimit(req: Request, policy: RatePolicy): Promise<NextResponse | null> {
  const e = env();
  const r = getRedis();
  if (!r) {
    if (e.NODE_ENV === 'production' && e.STRICT_PAYMENT_MODE === 'true') {
      return problem(503, 'rate_limiter_unavailable', 'Service temporarily unavailable');
    }
    return null;
  }
  let rl = limiters.get(policy.name);
  if (!rl) {
    rl = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(policy.limit, policy.window),
      prefix: `otaru:rl:${policy.name}`,
    });
    limiters.set(policy.name, rl);
  }
  try {
    const { success, reset } = await rl.limit(clientIp(req));
    if (success) return null;
    const retry = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    return problem(429, 'rate_limited', 'Too many requests. Please slow down.', { 'Retry-After': String(retry) });
  } catch {
    return policy.failClosed ? problem(503, 'rate_limiter_unavailable', 'Service temporarily unavailable') : null;
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { redis } from '@/lib/redis/client';
import { PRODUCT_CATALOG } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

/**
 * Readiness Probe (/api/ready)
 * Answers: Can this deployment actually serve production commerce traffic?
 * Checks: PostgreSQL, Redis coordination, Product Catalog, and Security Secrets.
 */
export async function GET(request: Request) {
  const isProduction = process.env.NODE_ENV === 'production';
  const authHeader = request.headers.get('authorization') || '';
  const adminSecret = process.env.ADMIN_API_SECRET;
  const isAuthorizedAdmin = Boolean(adminSecret && authHeader.replace(/^Bearer\s+/i, '') === adminSecret);

  const checks: {
    status: 'READY' | 'DEGRADED' | 'NOT_READY';
    database: string;
    redis: string;
    catalog: string;
    secrets: string;
    timestamp: string;
  } = {
    status: 'READY',
    database: 'healthy',
    redis: 'healthy',
    catalog: 'healthy',
    secrets: 'healthy',
    timestamp: new Date().toISOString(),
  };

  let canServeTraffic = true;

  // 1. Database Check
  if (process.env.DATABASE_URL) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = 'connected';
    } catch {
      checks.database = 'connection_failed';
      canServeTraffic = false;
    }
  } else {
    // In strict production mode, missing database is blocking
    if (isProduction) {
      checks.database = 'unconfigured';
      canServeTraffic = false;
    } else {
      checks.database = 'unconfigured_local_mode';
    }
  }

  // 2. Redis Check
  try {
    await redis.get('ready:probe');
    checks.redis = 'connected';
  } catch {
    if (isProduction) {
      checks.redis = 'redis_unreachable';
      canServeTraffic = false;
    } else {
      checks.redis = 'fallback_memory_mode';
    }
  }

  // 3. Catalog Integrity
  const catalogSize = Object.keys(PRODUCT_CATALOG).length;
  if (catalogSize === 0) {
    checks.catalog = 'empty_catalog';
    canServeTraffic = false;
  } else {
    checks.catalog = `ready (${catalogSize} products)`;
  }

  // 4. Critical Production Secrets
  if (isProduction) {
    const missing: string[] = [];
    if (!process.env.PAYMENT_CART_SECRET) missing.push('PAYMENT_CART_SECRET');
    if (!process.env.ADMIN_API_SECRET) missing.push('ADMIN_API_SECRET');
    if (!process.env.RAZORPAY_KEY_SECRET) missing.push('RAZORPAY_KEY_SECRET');

    if (missing.length > 0) {
      checks.secrets = isAuthorizedAdmin ? `missing: ${missing.join(', ')}` : 'incomplete_configuration';
      canServeTraffic = false;
    }
  }

  checks.status = canServeTraffic ? 'READY' : 'NOT_READY';

  // Public callers receive opaque status without sensitive environment details
  const responsePayload = isAuthorizedAdmin
    ? checks
    : { status: checks.status, timestamp: checks.timestamp };

  return NextResponse.json(responsePayload, {
    status: canServeTraffic ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

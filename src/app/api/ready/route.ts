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
export async function GET() {
  const isProduction = process.env.NODE_ENV === 'production';
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
    } catch (err) {
      checks.database = `error: ${err instanceof Error ? err.message : 'connection_failed'}`;
      canServeTraffic = false;
    }
  } else {
    // In strict production mode, missing database is blocking
    if (isProduction) {
      checks.database = 'missing_DATABASE_URL';
      canServeTraffic = false;
    } else {
      checks.database = 'unconfigured_local_mode';
    }
  }

  // 2. Redis Check
  try {
    await redis.get('ready:probe');
    checks.redis = 'connected';
  } catch (err) {
    if (isProduction) {
      checks.redis = `error: ${err instanceof Error ? err.message : 'redis_unreachable'}`;
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
      checks.secrets = `missing: ${missing.join(', ')}`;
      canServeTraffic = false;
    }
  }

  checks.status = canServeTraffic ? 'READY' : 'NOT_READY';

  return NextResponse.json(checks, {
    status: canServeTraffic ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

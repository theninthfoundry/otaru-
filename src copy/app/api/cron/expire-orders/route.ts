import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { env } from '@/server/env';
import { expireStale } from '@/server/commerce/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function authorised(req: Request): boolean {
  const secret = env().CRON_SECRET;
  if (!secret) return false; // fail closed: no secret configured => endpoint disabled
  const given = Buffer.from(req.headers.get('authorization') ?? '');
  const want = Buffer.from(`Bearer ${secret}`);
  return given.length === want.length && crypto.timingSafeEqual(given, want);
}

// Vercel Cron sends `Authorization: Bearer $CRON_SECRET` automatically when CRON_SECRET is set.
export async function GET(req: Request) {
  if (!authorised(req)) return new Response('unauthorized', { status: 401 });
  const expired = await expireStale(200);
  return NextResponse.json({ expired });
}

import { z } from 'zod';
import { NextResponse } from 'next/server';
import { env } from '@/server/env';
import { createOrder } from '@/server/commerce/orders';
import { CheckoutError } from '@/server/commerce/pricing';
import { crossOriginBlocked, problem, rateLimit } from '@/server/security/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024;

const Body = z.object({
  items: z
    .array(z.object({ variantId: z.string().min(1).max(40), qty: z.number().int().min(1).max(10) }))
    .min(1)
    .max(20),
  customer: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().toLowerCase().max(120).email(),
    phone: z.string().trim().regex(/^(?:\+91)?[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  }),
  shipping: z.object({
    line1: z.string().trim().min(3).max(120),
    line2: z.string().trim().max(120).optional(),
    city: z.string().trim().min(2).max(60),
    state: z.string().trim().min(2).max(60),
    pincode: z.string().trim().regex(/^[1-9]\d{5}$/, 'Enter a valid 6-digit PIN code'),
  }),
});

const KEY = /^[A-Za-z0-9_-]{16,64}$/;

export async function POST(req: Request) {
  if (crossOriginBlocked(req)) return problem(403, 'forbidden_origin', 'Request blocked.');

  const limited = await rateLimit(req, { name: 'checkout-create', limit: 8, window: '1 m', failClosed: true });
  if (limited) return limited;

  const idempotencyKey = req.headers.get('idempotency-key') ?? '';
  if (!KEY.test(idempotencyKey)) return problem(400, 'bad_idempotency_key', 'Missing or malformed Idempotency-Key header.');

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return problem(413, 'payload_too_large', 'Request too large.');

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return problem(400, 'bad_json', 'Body must be valid JSON.');
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    // Paths + messages only — never echo submitted values back.
    const fields = Object.fromEntries(parsed.error.issues.map((i) => [i.path.join('.'), i.message]));
    return NextResponse.json({ error: { code: 'invalid_input', message: 'Please check the highlighted fields.', fields } }, { status: 422 });
  }

  try {
    const session = await createOrder({ idempotencyKey, ...parsed.data });
    return NextResponse.json({ ...session, keyId: env().RAZORPAY_KEY_ID }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    if (err instanceof CheckoutError) return problem(err.status, err.code, err.message);
    console.error('[checkout] unexpected', err);
    return problem(500, 'internal_error', 'Something went wrong. Please try again.');
  }
}

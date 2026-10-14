import { z } from 'zod';
import { markPaid } from '@/server/commerce/orders';
import { fetchPayment, verifyCheckoutSignature } from '@/server/payments/razorpay';
import { crossOriginBlocked, problem, rateLimit } from '@/server/security/guard';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const Body = z.object({
  razorpay_order_id: z.string().min(8).max(64),
  razorpay_payment_id: z.string().min(8).max(64),
  razorpay_signature: z.string().min(32).max(128),
});

/**
 * Fast-path confirmation for the browser. The webhook is the source of truth:
 * if anything here is inconclusive we answer "processing" and let it finish.
 */
export async function POST(req: Request) {
  if (crossOriginBlocked(req)) return problem(403, 'forbidden_origin', 'Request blocked.');
  const limited = await rateLimit(req, { name: 'checkout-verify', limit: 20, window: '1 m' });
  if (limited) return limited;

  const raw = await req.text();
  if (raw.length > 2048) return problem(413, 'payload_too_large', 'Request too large.');
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return problem(400, 'bad_json', 'Body must be valid JSON.');
  }
  const parsed = Body.safeParse(json);
  if (!parsed.success) return problem(422, 'invalid_input', 'Malformed payment response.');
  const b = parsed.data;

  if (!verifyCheckoutSignature({ orderId: b.razorpay_order_id, paymentId: b.razorpay_payment_id, signature: b.razorpay_signature })) {
    return problem(400, 'bad_signature', 'Payment could not be verified.');
  }

  try {
    // Signature proves authenticity, not capture. Ask Razorpay for the actual state.
    const pay = await fetchPayment(b.razorpay_payment_id);
    if (pay.order_id !== b.razorpay_order_id) return problem(400, 'order_mismatch', 'Payment could not be verified.');
    if (pay.status !== 'captured') return NextResponse.json({ status: 'processing' });

    const r = await markPaid({
      razorpayOrderId: pay.order_id,
      razorpayPaymentId: pay.id,
      amountPaise: pay.amount,
      currency: pay.currency,
      method: pay.method,
    });
    if (r.kind === 'paid' || r.kind === 'duplicate') {
      return NextResponse.json({ status: 'paid', orderNumber: r.orderNumber, trackingToken: r.trackingToken });
    }
    // refund_pending / amount_mismatch / unknown_order: do not promise anything; ops + webhook take over.
    return NextResponse.json({ status: 'processing' });
  } catch (err) {
    console.error('[verify] failed', err);
    return NextResponse.json({ status: 'processing' }); // webhook will reconcile
  }
}

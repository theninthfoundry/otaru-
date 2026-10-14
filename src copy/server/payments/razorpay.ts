import 'server-only';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import { env } from '@/server/env';

let client: Razorpay | undefined;
export function razorpay(): Razorpay {
  if (!client) {
    client = new Razorpay({ key_id: env().RAZORPAY_KEY_ID, key_secret: env().RAZORPAY_KEY_SECRET });
  }
  return client;
}

export async function createRazorpayOrder(args: { amountPaise: number; receipt: string; orderId: string }) {
  return razorpay().orders.create({
    amount: args.amountPaise,
    currency: 'INR',
    receipt: args.receipt, // <= 40 chars
    notes: { orderId: args.orderId },
  });
}

export interface FetchedPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
}

export async function fetchPayment(paymentId: string): Promise<FetchedPayment> {
  const p = await razorpay().payments.fetch(paymentId);
  return p as unknown as FetchedPayment;
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

/** Checkout callback: HMAC_SHA256(order_id + "|" + payment_id, key_secret). */
export function verifyCheckoutSignature(a: { orderId: string; paymentId: string; signature: string }): boolean {
  const expected = crypto
    .createHmac('sha256', env().RAZORPAY_KEY_SECRET)
    .update(`${a.orderId}|${a.paymentId}`)
    .digest('hex');
  return safeEqual(expected, a.signature);
}

/** Webhook: HMAC_SHA256(raw request body, webhook secret). Must use the RAW body, not re-serialised JSON. */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac('sha256', env().RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');
  return safeEqual(expected, signature);
}

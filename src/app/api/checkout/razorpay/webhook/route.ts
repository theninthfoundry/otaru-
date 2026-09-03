/**
 * Legacy webhook endpoint alias
 * Forwards directly to the single source of truth: /api/webhooks/razorpay
 */
import { POST as canonicalRazorpayWebhook } from '@/app/api/webhooks/razorpay/route';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  return canonicalRazorpayWebhook(request);
}

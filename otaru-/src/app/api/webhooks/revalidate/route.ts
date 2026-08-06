import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import crypto from 'crypto';

/**
 * Shopify Webhook → ISR Revalidation
 *
 * Verifies HMAC signature, then revalidates relevant cache tags.
 * Triggered by Shopify product/inventory/collection updates.
 */
export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();

  // Verify HMAC signature
  const hmacHeader = headersList.get('x-shopify-hmac-sha256');
  const secret = process.env.SHOPIFY_REVALIDATION_SECRET;

  if (!secret || !hmacHeader) {
    return NextResponse.json(
      { error: 'Missing secret or HMAC header' },
      { status: 401 },
    );
  }

  const expectedHmac = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  if (hmacHeader !== expectedHmac) {
    return NextResponse.json(
      { error: 'Invalid HMAC signature' },
      { status: 401 },
    );
  }

  // Determine which tags to revalidate based on the webhook topic
  const topic = headersList.get('x-shopify-topic') ?? '';

  const tagsToRevalidate: string[] = [];

  if (topic.includes('products')) {
    tagsToRevalidate.push('products');
  }
  if (topic.includes('collections')) {
    tagsToRevalidate.push('collections');
  }
  if (topic.includes('inventory')) {
    tagsToRevalidate.push('products');
  }

  // Revalidate all matched tags
  for (const tag of tagsToRevalidate) {
    revalidateTag(tag);
  }

  return NextResponse.json({
    revalidated: true,
    tags: tagsToRevalidate,
    topic,
    timestamp: new Date().toISOString(),
  });
}

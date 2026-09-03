import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { sendOrderConfirmationWhatsApp, sendShippingUpdateWhatsApp } from '@/lib/interakt';
import { trackKlaviyoEvent } from '@/lib/klaviyo';

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();

  const hmacHeader = headersList.get('x-shopify-hmac-sha256');
  const secret = process.env.SHOPIFY_REVALIDATION_SECRET || process.env.SHOPIFY_WEBHOOK_SECRET;

  if (!secret || !hmacHeader) {
    return NextResponse.json(
      { error: 'Missing webhook secret or HMAC signature header.' },
      { status: 401 },
    );
  }

  const expectedHmac = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  const expectedBuf = Buffer.from(expectedHmac, 'utf8');
  const receivedBuf = Buffer.from(hmacHeader, 'utf8');

  if (expectedBuf.length !== receivedBuf.length || !crypto.timingSafeEqual(expectedBuf, receivedBuf)) {
    return NextResponse.json(
      { error: 'Invalid HMAC signature' },
      { status: 401 },
    );
  }

  const topic = headersList.get('x-shopify-topic') ?? 'orders/create';

  try {
    const orderData = JSON.parse(body);

    const orderNumber = String(orderData.order_number ?? orderData.id);
    const email = orderData.email ?? '';
    const phone = orderData.phone ?? orderData.shipping_address?.phone ?? '';
    const customerName = orderData.customer?.first_name ?? 'Customer';
    const totalPrice = orderData.total_price ?? '0';

    console.log(`[Order Webhook Received] Topic: ${topic}`, {
      orderNumber,
      email,
      totalPrice,
    });

    if (topic === 'orders/create') {
      if (phone) {
        await sendOrderConfirmationWhatsApp(phone, customerName, orderNumber, `₹${totalPrice}`);
      }

      if (email) {
        await trackKlaviyoEvent({
          eventName: 'Placed Order',
          email,
          properties: {
            orderNumber,
            totalPrice,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            lineItems: orderData.line_items?.map((item: any) => ({
              title: item.title,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        });
      }
    }

    if (topic === 'orders/fulfilled' || topic === 'fulfillments/create') {
      const trackingUrl = orderData.fulfillments?.[0]?.tracking_url ?? `https://otaru.in/track-order?order=${orderNumber}`;
      const courierName = orderData.fulfillments?.[0]?.tracking_company ?? 'Standard Shipping';

      if (phone) {
        await sendShippingUpdateWhatsApp(phone, customerName, orderNumber, trackingUrl, courierName);
      }
    }

    return NextResponse.json({
      received: true,
      topic,
      orderNumber,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Order Webhook Exception]:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook body' },
      { status: 400 },
    );
  }
}

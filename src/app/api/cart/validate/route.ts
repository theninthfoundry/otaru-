import { NextResponse } from 'next/server';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import { issueCartToken } from '@/lib/payments/cart-token';
import { checkPaymentRateLimit } from '@/lib/payments/payment-rate-limiter';
import { auditLog } from '@/lib/payments/audit-trail';
import { logger } from '@/lib/security/logger';

const FREE_SHIPPING_THRESHOLD_USD = 250;
const STANDARD_SHIPPING_USD = 15;
const APPAREL_GST_RATE = 0.12;

interface ClientCartLine {
  id: string;
  qty: number;
  size?: string;
  price?: number;
}

interface ServerCouponRule {
  code: string;
  type: 'percent' | 'flat' | 'shipping';
  value: number;
  name: string;
  description: string;
  minSubtotal?: number;
}

const SERVER_COUPON_LEDGER: Record<string, ServerCouponRule> = {
  ARCHIVE10: {
    code: 'ARCHIVE10',
    type: 'percent',
    value: 10,
    name: 'Archival Member Privilege',
    description: '10% deduction across all hand-loomed batch garments',
    minSubtotal: 100,
  },
  ATELIER15: {
    code: 'ATELIER15',
    type: 'percent',
    value: 15,
    name: 'Private Collector Concession',
    description: '15% allocation grant for registered atelier patrons',
    minSubtotal: 200,
  },
  HOKKAIDO20: {
    code: 'HOKKAIDO20',
    type: 'percent',
    value: 20,
    name: 'Hokkaido Warehouse Opening Token',
    description: '20% deduction celebrating the 1907 Otaru canal ledger',
    minSubtotal: 300,
  },
  FIRSTPATRON: {
    code: 'FIRSTPATRON',
    type: 'flat',
    value: 50,
    name: 'First Patron Archival Credit',
    description: '$50 (₹4,200) studio accession stipend applied at checkout',
    minSubtotal: 150,
  },
  FREESHIP: {
    code: 'FREESHIP',
    type: 'shipping',
    value: 100,
    name: 'Complimentary Global Freight Voucher',
    description: 'Zero-cost insured courier dispatch with wooden crate boxing',
    minSubtotal: 0,
  },
};

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  // 1. IP Rate Limiting (Prevents coupon brute forcing / DoS)
  const rateCheck = checkPaymentRateLimit('order', ip);
  if (!rateCheck.allowed) {
    auditLog({
      type: 'RATE_LIMIT_BLOCKED',
      details: `Cart validation rate limited for IP: ${ip}`,
      ip,
    });
    return NextResponse.json(
      { error: 'Too many ledger calculation requests. Please wait a moment.', code: 'RATE_LIMITED' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const items: ClientCartLine[] = Array.isArray(body.items) ? body.items : [];
    const rawCoupon = typeof body.couponCode === 'string' ? body.couponCode.trim().toUpperCase() : null;
    const stateMode: 'inter' | 'intra' = body.stateMode === 'intra' ? 'intra' : 'inter';

    // 2. Server Price Authority Verification
    let serverSubtotal = 0;
    let priceTampered = false;
    const validatedLines: Array<{
      id: string;
      name: string;
      unitPrice: number;
      qty: number;
      lineTotal: number;
      size: string;
    }> = [];

    for (const item of items) {
      if (!item || typeof item.id !== 'string') continue;

      const baseId = item.id.split('-')[0] || item.id;
      const catalogItem = PRODUCT_CATALOG[baseId];

      if (!catalogItem) {
        continue; // Skip unknown or obsolete items
      }

      const verifiedPrice = catalogItem.price;
      const verifiedQty = Math.max(1, Math.min(10, Math.floor(Number(item.qty) || 1)));

      if (typeof item.price === 'number' && Math.abs(item.price - verifiedPrice) > 0.01) {
        priceTampered = true;
      }

      const lineTotal = verifiedPrice * verifiedQty;
      serverSubtotal += lineTotal;

      validatedLines.push({
        id: item.id,
        name: catalogItem.name,
        unitPrice: verifiedPrice,
        qty: verifiedQty,
        lineTotal,
        size: item.size || 'M',
      });
    }

    if (priceTampered) {
      auditLog({
        type: 'CART_TAMPER_DETECTED',
        details: `Client submitted tampered price in cart validation. IP: ${ip}`,
        ip,
        meta: { submittedItems: items },
      });
      logger.warn('[CartSecurity] Client price discrepancy detected; overridden with catalog authority.', { clientIp: ip });
    }

    // 3. Server Coupon & Privilege Validation
    let discountAmount = 0;
    let isFreeShippingByCoupon = false;
    let verifiedCoupon: ServerCouponRule | null = null;
    let couponError: string | null = null;

    if (rawCoupon) {
      const rule = SERVER_COUPON_LEDGER[rawCoupon];
      if (!rule) {
        couponError = `Voucher code "${rawCoupon}" is invalid or expired.`;
      } else if (rule.minSubtotal && serverSubtotal < rule.minSubtotal) {
        couponError = `Code "${rule.code}" requires a minimum acquisition subtotal of $${rule.minSubtotal}.`;
      } else {
        verifiedCoupon = rule;
        if (rule.type === 'percent') {
          discountAmount = Math.round(serverSubtotal * (rule.value / 100));
        } else if (rule.type === 'flat') {
          discountAmount = Math.min(rule.value, serverSubtotal);
        } else if (rule.type === 'shipping') {
          isFreeShippingByCoupon = true;
        }
      }
    }

    // 4. Taxable Base & GST (12% Apparel Schedule)
    const taxableBase = Math.max(0, serverSubtotal - discountAmount);
    const gstAmount = Math.round(taxableBase * APPAREL_GST_RATE);
    const cgstAmount = Math.round(gstAmount / 2);
    const sgstAmount = gstAmount - cgstAmount;
    const igstAmount = gstAmount;

    // 5. Insured Shipping Calculation
    const isFreeShipping = isFreeShippingByCoupon || serverSubtotal >= FREE_SHIPPING_THRESHOLD_USD;
    const shippingFee = serverSubtotal === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_USD;

    // 6. Paulownia Gift Box Fee (Complimentary if subtotal >= $500)
    const isGiftWrapping = Boolean(body.giftWrapping);
    const giftFee = isGiftWrapping ? (serverSubtotal >= 500 ? 0 : 25) : 0;

    // 7. Grand Total
    const grandTotal = serverSubtotal === 0 ? 0 : taxableBase + gstAmount + shippingFee + giftFee;

    // 7. Cryptographic Cart Token Generation
    const tokenLines = validatedLines.map((l) => ({
      id: l.id,
      quantity: l.qty,
      amount: String(l.lineTotal),
    }));

    const cartOrderId = `cart-vld-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

    let cartToken = '';
    try {
      cartToken = issueCartToken({
        lines: tokenLines,
        amount: grandTotal,
        currency: 'USD',
        orderId: cartOrderId,
      });
    } catch (tokenErr) {
      logger.warn('[CartToken] Issue fallback in development mode', { error: tokenErr });
      cartToken = `mock-token-${cartOrderId}`;
    }

    return NextResponse.json({
      success: true,
      data: {
        serverSubtotal,
        discountAmount,
        taxableBase,
        gstRate: APPAREL_GST_RATE,
        gstAmount,
        cgstAmount,
        sgstAmount,
        igstAmount,
        stateMode,
        isFreeShipping,
        shippingFee,
        grandTotal,
        validatedLines,
        coupon: verifiedCoupon
          ? {
              code: verifiedCoupon.code,
              name: verifiedCoupon.name,
              description: verifiedCoupon.description,
              discountAmount,
            }
          : null,
        couponError,
        cartToken,
        verifiedAt: new Date().toISOString(),
        auditRef: cartOrderId,
      },
    });
  } catch (err) {
    logger.error('[CartValidate] Unexpected validation failure', err, { clientIp: ip });
    return NextResponse.json(
      { error: 'Internal archival validation error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}

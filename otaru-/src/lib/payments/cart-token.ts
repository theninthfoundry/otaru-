/**
 * OTARU — HMAC-Signed Cart Token
 *
 * Prevents price tampering between the order-creation and payment-verification steps.
 *
 * Flow:
 *  1. Server creates an order → computes canonical cart hash → signs it → returns cartToken
 *  2. Client stores the cartToken and sends it back with the verify request
 *  3. Server validates the token: checks signature + TTL + amount match
 *
 * If any cart field is tampered with, or the token has expired, the verify
 * endpoint rejects the request with TAMPERED_CART.
 *
 * Security properties:
 *  - HMAC-SHA256 with a server-only secret (PAYMENT_CART_SECRET)
 *  - 10-minute TTL — short enough to prevent old tokens being reused
 *  - Canonical sorting of cart lines to prevent reordering attacks
 *  - Amount is embedded in the signed payload — cannot be changed post-signing
 */

import crypto from 'crypto';

const TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes

interface CartTokenPayload {
  /** Server-computed total in major currency units */
  amount: number;
  currency: string;
  /** SHA-256 hash of sorted line item ids+quantities+prices */
  cartHash: string;
  /** Unix timestamp (ms) when token was issued */
  issuedAt: number;
  /** Internal Otaru order reference */
  orderId: string;
}

function getSecret(): Buffer {
  const secret = process.env.PAYMENT_CART_SECRET;
  if (!secret || secret.length < 32) {
    // In dev/sandbox, use a deterministic fallback (NOT secure for production)
    const fallback = 'otaru-dev-cart-secret-NOT-FOR-PRODUCTION-USE-0000';
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[CartToken] PAYMENT_CART_SECRET is not set or too short. Refusing to sign in production.');
    }
    return Buffer.from(fallback, 'utf8');
  }
  return Buffer.from(secret, 'hex');
}

/**
 * Compute a stable, canonical hash of the cart contents.
 * Sorting prevents reordering attacks (e.g. swapping line items).
 */
function computeCartHash(lines: Array<{ id?: string; quantity: number; amount: string }>): string {
  const canonical = lines
    .map(l => `${l.id ?? ''}:${l.quantity}:${parseFloat(l.amount).toFixed(2)}`)
    .sort()
    .join('|');
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

/**
 * Issue a signed cart token.
 * Call this inside the order-create route once the server has computed the total.
 */
export function issueCartToken(params: {
  lines: Array<{ id?: string; quantity: number; amount: string }>;
  amount: number;
  currency: string;
  orderId: string;
}): string {
  const payload: CartTokenPayload = {
    amount: params.amount,
    currency: params.currency,
    cartHash: computeCartHash(params.lines),
    issuedAt: Date.now(),
    orderId: params.orderId,
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getSecret())
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

export type CartTokenVerifyResult =
  | { valid: true; payload: CartTokenPayload }
  | { valid: false; reason: 'INVALID_FORMAT' | 'BAD_SIGNATURE' | 'EXPIRED' | 'AMOUNT_MISMATCH' | 'CART_TAMPERED' };

/**
 * Verify a cart token presented by the client during payment verification.
 * Uses constant-time comparison to prevent timing-oracle attacks.
 */
export function verifyCartToken(
  token: string,
  expectedAmount: number,
  lines: Array<{ id?: string; quantity: number; amount: string }>,
): CartTokenVerifyResult {
  // 1. Parse structure
  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'INVALID_FORMAT' };
  }
  const [payloadB64, receivedSig] = parts;

  // 2. Recompute signature with constant-time comparison
  const expectedSig = crypto
    .createHmac('sha256', getSecret())
    .update(payloadB64)
    .digest('base64url');

  const sigA = Buffer.from(expectedSig, 'base64url');
  const sigB = Buffer.from(receivedSig, 'base64url');

  if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
    return { valid: false, reason: 'BAD_SIGNATURE' };
  }

  // 3. Decode payload
  let payload: CartTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return { valid: false, reason: 'INVALID_FORMAT' };
  }

  // 4. Check TTL
  if (Date.now() - payload.issuedAt > TOKEN_TTL_MS) {
    return { valid: false, reason: 'EXPIRED' };
  }

  // 5. Check amount hasn't changed (within $0.01 tolerance for floating point)
  if (Math.abs(payload.amount - expectedAmount) > 0.01) {
    return { valid: false, reason: 'AMOUNT_MISMATCH' };
  }

  // 6. Check cart contents haven't been tampered with
  const currentCartHash = computeCartHash(lines);
  if (payload.cartHash !== currentCartHash) {
    return { valid: false, reason: 'CART_TAMPERED' };
  }

  return { valid: true, payload };
}

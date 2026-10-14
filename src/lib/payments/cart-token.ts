import crypto from 'crypto';

const TOKEN_TTL_MS = 10 * 60 * 1000;

interface CartTokenPayload {
  amount: number;
  currency: string;
  cartHash: string;
  issuedAt: number;
  orderId: string;
}

function getSecret(): Buffer {
  const secret = process.env.PAYMENT_CART_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production' || process.env.STRICT_PAYMENT_MODE === 'true') {
      throw new Error(
        '[FATAL SECURITY INVARIANT]: PAYMENT_CART_SECRET must be configured with a strong secret (at least 32 characters or 64-character hex string) in production.'
      );
    }
    const devFallback = 'otaru-dev-only-cart-secret-do-not-use-in-production-32b';
    return Buffer.from(devFallback, 'utf8');
  }

  if (/^[0-9a-fA-F]{64}$/.test(secret)) {
    return Buffer.from(secret, 'hex');
  }
  return Buffer.from(secret, 'utf8');
}

function computeCartHash(lines: Array<{ id?: string; quantity: number; amount: string }>): string {
  const canonical = lines
    .map(l => `${l.id ?? ''}:${l.quantity}:${parseFloat(l.amount).toFixed(2)}`)
    .sort()
    .join('|');
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

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

export function verifyCartToken(
  token: string,
  expectedAmount: number,
  lines: Array<{ id?: string; quantity: number; amount: string }>,
): CartTokenVerifyResult {
  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, reason: 'INVALID_FORMAT' };
  }
  const [payloadB64, receivedSig] = parts;
  if (!payloadB64 || !receivedSig) {
    return { valid: false, reason: 'INVALID_FORMAT' };
  }

  const expectedSig = crypto
    .createHmac('sha256', getSecret())
    .update(payloadB64)
    .digest('base64url');

  const sigA = Buffer.from(expectedSig, 'base64url');
  const sigB = Buffer.from(receivedSig, 'base64url');

  if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
    return { valid: false, reason: 'BAD_SIGNATURE' };
  }

  let payload: CartTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return { valid: false, reason: 'INVALID_FORMAT' };
  }

  if (Date.now() - payload.issuedAt > TOKEN_TTL_MS) {
    return { valid: false, reason: 'EXPIRED' };
  }

  if (Math.abs(payload.amount - expectedAmount) > 0.01) {
    return { valid: false, reason: 'AMOUNT_MISMATCH' };
  }

  const currentCartHash = computeCartHash(lines);
  if (payload.cartHash !== currentCartHash) {
    return { valid: false, reason: 'CART_TAMPERED' };
  }

  return { valid: true, payload };
}

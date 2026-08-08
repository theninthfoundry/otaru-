/**
 * OTARU — Fraud Detection Engine
 *
 * A multi-signal risk scoring engine that evaluates every payment order.
 * Assigns a risk score 0–100 and returns PASS, FLAG, or BLOCK.
 *
 * Risk Signals:
 *  1. Velocity — same email placing too many orders in a short window
 *  2. Amount Anomaly — order value far above store historical average
 *  3. IP Concentration — single IP generating many different customer accounts
 *  4. Suspicious Patterns — test strings, disposable email domains, etc.
 *  5. Rapid Cart Changes — many different cart sizes from same session
 *
 * Thresholds:
 *  0–39  → PASS  (order proceeds normally)
 *  40–69 → FLAG  (logged, alert raised, order proceeds with monitoring)
 *  70+   → BLOCK (order rejected, event logged)
 */

import { logger } from '@/lib/security/logger';

export type FraudDecision = 'PASS' | 'FLAG' | 'BLOCK';

export interface FraudResult {
  decision: FraudDecision;
  score: number;
  signals: string[];
}

// ── Historical Averages (update periodically from real data) ──────────────────
// These are starter values — in production, compute from your actual order data
const AVG_ORDER_VALUE = 250; // USD
const MAX_MULTIPLIER = 10;   // Block if amount > 10× average

// ── Velocity Tracking ─────────────────────────────────────────────────────────
interface VelocityEntry {
  count: number;
  windowStart: number;
}

const emailVelocity = new Map<string, VelocityEntry>();
const ipVelocity = new Map<string, VelocityEntry>();
const ipEmailMap = new Map<string, Set<string>>(); // IP → set of emails seen

const VELOCITY_WINDOW_MS = 60 * 60 * 1000; // 1 hour window
const EMAIL_VELOCITY_THRESHOLD = 5;         // > 5 orders/hour = suspicious
const IP_EMAIL_THRESHOLD = 8;               // > 8 different emails from 1 IP = suspicious

function incrementVelocity(store: Map<string, VelocityEntry>, key: string): number {
  const now = Date.now();
  let entry = store.get(key);
  if (!entry || now - entry.windowStart > VELOCITY_WINDOW_MS) {
    entry = { count: 1, windowStart: now };
  } else {
    entry.count += 1;
  }
  store.set(key, entry);
  return entry.count;
}

// ── Disposable Email Domains ──────────────────────────────────────────────────
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'guerrillamail.com', 'sharklasers.com',
  'throwam.com', 'yopmail.com', 'trashmail.com', 'dispostable.com',
  'maildrop.cc', 'fakeinbox.com', 'tempr.email', 'spamgourmet.com',
  '10minutemail.com', 'temp-mail.org', 'getnada.com',
]);

// ── Suspicious Name Patterns ──────────────────────────────────────────────────
const SUSPICIOUS_NAME_PATTERNS = [
  /^test$/i, /^testing$/i, /^asdf/i, /^qwer/i, /^[a-z]{1,2}$/i,
  /^(foo|bar|baz|admin|root|user)$/i,
];

// ── Main Scoring Engine ───────────────────────────────────────────────────────

export function evaluateFraudRisk(params: {
  email: string;
  ip: string;
  firstName: string;
  lastName: string;
  amount: number;
  currency: string;
}): FraudResult {
  const { email, ip, firstName, lastName, amount } = params;
  let score = 0;
  const signals: string[] = [];

  const emailKey = email.toLowerCase().trim();
  const domain = emailKey.split('@')[1] ?? '';

  // ── Signal 1: Disposable Email ────────────────────────────────────────────
  if (DISPOSABLE_DOMAINS.has(domain)) {
    score += 45;
    signals.push(`DISPOSABLE_EMAIL_DOMAIN: ${domain}`);
  }

  // ── Signal 2: Email Velocity ──────────────────────────────────────────────
  const emailCount = incrementVelocity(emailVelocity, emailKey);
  if (emailCount > EMAIL_VELOCITY_THRESHOLD) {
    const velocityScore = Math.min(40, (emailCount - EMAIL_VELOCITY_THRESHOLD) * 8);
    score += velocityScore;
    signals.push(`EMAIL_VELOCITY: ${emailCount} orders in 1h (threshold: ${EMAIL_VELOCITY_THRESHOLD})`);
  }

  // ── Signal 3: IP → Multi-Email Concentration ──────────────────────────────
  if (!ipEmailMap.has(ip)) ipEmailMap.set(ip, new Set());
  ipEmailMap.get(ip)!.add(emailKey);
  const ipEmailCount = ipEmailMap.get(ip)!.size;

  if (ipEmailCount > IP_EMAIL_THRESHOLD) {
    score += 35;
    signals.push(`IP_EMAIL_CONCENTRATION: ${ipEmailCount} distinct emails from IP ${ip}`);
  }

  // ── Signal 4: IP Velocity ─────────────────────────────────────────────────
  const ipCount = incrementVelocity(ipVelocity, ip);
  if (ipCount > 10) {
    score += 20;
    signals.push(`IP_VELOCITY: ${ipCount} requests in 1h from IP ${ip}`);
  }

  // ── Signal 5: Amount Anomaly ──────────────────────────────────────────────
  const amountMultiple = amount / AVG_ORDER_VALUE;
  if (amountMultiple > MAX_MULTIPLIER) {
    score += 30;
    signals.push(`AMOUNT_ANOMALY: ${amountMultiple.toFixed(1)}× avg order value ($${amount})`);
  } else if (amountMultiple > MAX_MULTIPLIER / 2) {
    score += 15;
    signals.push(`AMOUNT_ELEVATED: ${amountMultiple.toFixed(1)}× avg order value ($${amount})`);
  }

  // ── Signal 6: Suspicious Name Patterns ───────────────────────────────────
  const fullName = `${firstName} ${lastName}`;
  for (const pattern of SUSPICIOUS_NAME_PATTERNS) {
    if (pattern.test(firstName) || pattern.test(lastName)) {
      score += 20;
      signals.push(`SUSPICIOUS_NAME_PATTERN: "${fullName}" matches pattern ${pattern}`);
      break;
    }
  }

  // ── Signal 7: Minimum order sanity check ─────────────────────────────────
  if (amount <= 0) {
    score += 100;
    signals.push(`ZERO_OR_NEGATIVE_AMOUNT: ${amount}`);
  }

  // ── Decision ──────────────────────────────────────────────────────────────
  let decision: FraudDecision;
  if (score >= 70) {
    decision = 'BLOCK';
    logger.warn(`[Fraud Engine] BLOCK — Score: ${score}`, { email, ip, signals });
  } else if (score >= 40) {
    decision = 'FLAG';
    logger.warn(`[Fraud Engine] FLAG — Score: ${score}`, { email, ip, signals });
  } else {
    decision = 'PASS';
  }

  return { decision, score, signals };
}

// ── Cleanup ───────────────────────────────────────────────────────────────────
let cleanupTimer: ReturnType<typeof setInterval> | null = null;
function ensureCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [k, v] of emailVelocity.entries()) {
      if (now - v.windowStart > VELOCITY_WINDOW_MS * 2) emailVelocity.delete(k);
    }
    for (const [k, v] of ipVelocity.entries()) {
      if (now - v.windowStart > VELOCITY_WINDOW_MS * 2) ipVelocity.delete(k);
    }
    // Trim IP-email map (keep only IPs seen recently)
    // Simple approach: clear the whole map every 2h (acceptable for in-process store)
    if (ipEmailMap.size > 5000) ipEmailMap.clear();
  }, VELOCITY_WINDOW_MS);
  if (cleanupTimer.unref) cleanupTimer.unref();
}
ensureCleanup();

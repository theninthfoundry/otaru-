import { logger } from '@/lib/security/logger';

export type FraudDecision = 'PASS' | 'FLAG' | 'BLOCK';

export interface FraudResult {
  decision: FraudDecision;
  score: number;
  signals: string[];
}

const AVG_ORDER_VALUE = 250;
const MAX_MULTIPLIER = 10;

interface VelocityEntry {
  count: number;
  windowStart: number;
}

const emailVelocity = new Map<string, VelocityEntry>();
const ipVelocity = new Map<string, VelocityEntry>();
const ipEmailMap = new Map<string, Set<string>>();

const VELOCITY_WINDOW_MS = 60 * 60 * 1000;
const EMAIL_VELOCITY_THRESHOLD = 5;
const IP_EMAIL_THRESHOLD = 8;

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

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'guerrillamail.com', 'sharklasers.com',
  'throwam.com', 'yopmail.com', 'trashmail.com', 'dispostable.com',
  'maildrop.cc', 'fakeinbox.com', 'tempr.email', 'spamgourmet.com',
  '10minutemail.com', 'temp-mail.org', 'getnada.com',
]);

const SUSPICIOUS_NAME_PATTERNS = [
  /^test$/i, /^testing$/i, /^asdf/i, /^qwer/i, /^[a-z]{1,2}$/i,
  /^(foo|bar|baz|admin|root|user)$/i,
];

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

  if (DISPOSABLE_DOMAINS.has(domain)) {
    score += 45;
    signals.push(`DISPOSABLE_EMAIL_DOMAIN: ${domain}`);
  }

  const emailCount = incrementVelocity(emailVelocity, emailKey);
  if (emailCount > EMAIL_VELOCITY_THRESHOLD) {
    const velocityScore = Math.min(40, (emailCount - EMAIL_VELOCITY_THRESHOLD) * 8);
    score += velocityScore;
    signals.push(`EMAIL_VELOCITY: ${emailCount} orders in 1h`);
  }

  if (!ipEmailMap.has(ip)) ipEmailMap.set(ip, new Set());
  ipEmailMap.get(ip)!.add(emailKey);
  const ipEmailCount = ipEmailMap.get(ip)!.size;

  if (ipEmailCount > IP_EMAIL_THRESHOLD) {
    score += 35;
    signals.push(`IP_EMAIL_CONCENTRATION: ${ipEmailCount} distinct emails from IP ${ip}`);
  }

  const ipCount = incrementVelocity(ipVelocity, ip);
  if (ipCount > 10) {
    score += 20;
    signals.push(`IP_VELOCITY: ${ipCount} requests in 1h from IP ${ip}`);
  }

  const amountMultiple = amount / AVG_ORDER_VALUE;
  if (amountMultiple > MAX_MULTIPLIER) {
    score += 30;
    signals.push(`AMOUNT_ANOMALY: ${amountMultiple.toFixed(1)}× avg order value ($${amount})`);
  } else if (amountMultiple > MAX_MULTIPLIER / 2) {
    score += 15;
    signals.push(`AMOUNT_ELEVATED: ${amountMultiple.toFixed(1)}× avg order value ($${amount})`);
  }

  const fullName = `${firstName} ${lastName}`;
  for (const pattern of SUSPICIOUS_NAME_PATTERNS) {
    if (pattern.test(firstName) || pattern.test(lastName)) {
      score += 20;
      signals.push(`SUSPICIOUS_NAME_PATTERN: "${fullName}" matches pattern ${pattern}`);
      break;
    }
  }

  if (amount <= 0) {
    score += 100;
    signals.push(`ZERO_OR_NEGATIVE_AMOUNT: ${amount}`);
  }

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
    if (ipEmailMap.size > 5000) ipEmailMap.clear();
  }, VELOCITY_WINDOW_MS);
  if (cleanupTimer.unref) cleanupTimer.unref();
}
ensureCleanup();

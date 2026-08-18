/**
 * OTARU ARTIFACT OS — Multi-Signal Fraud & Bot Defense Engine
 * Computes deterministic 0–100 risk scores combining velocity, entropy, device, and timing telemetry.
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface RiskEvaluationRequest {
  ip: string;
  email: string;
  userAgent: string;
  checkoutDurationSeconds: number;
  isHeadlessBrowser?: boolean;
  shippingAddressLine1: string;
  orderAmountMinor: number;
}

export interface RiskEvaluationResult {
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  action: 'ALLOW' | 'STEP_UP_CHALLENGE' | 'MANUAL_REVIEW' | 'BLOCK';
  riskSignals: string[];
  evaluatedAt: string;
}

const DISPOSABLE_EMAIL_DOMAINS = ['tempmail.com', 'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'trashmail.com'];

export class RiskEngine {
  /**
   * Evaluates comprehensive fraud and bot signals for an incoming transaction.
   */
  public static evaluateRisk(req: RiskEvaluationRequest): RiskEvaluationResult {
    let score = 0;
    const signals: string[] = [];

    // 1. Bot Checkout Velocity (Humans take > 3 seconds to complete checkout)
    if (req.checkoutDurationSeconds < 2.0) {
      score += 35;
      signals.push('SUSPICIOUS_CHECKOUT_VELOCITY (< 2s)');
    } else if (req.checkoutDurationSeconds < 4.0) {
      score += 15;
      signals.push('RAPID_CHECKOUT_SPEED (< 4s)');
    }

    // 2. Headless Browser or Automation Signals
    if (req.isHeadlessBrowser || req.userAgent.includes('Headless') || req.userAgent.includes('Puppeteer') || req.userAgent.includes('Playwright')) {
      score += 45;
      signals.push('AUTOMATION_HEADLESS_BROWSER_DETECTED');
    }

    // 3. Disposable Email Domain
    const domain = req.email.split('@')[1]?.toLowerCase();
    if (domain && DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      score += 40;
      signals.push('DISPOSABLE_EMAIL_DOMAIN');
    }

    // 4. Missing / Default User Agent
    if (!req.userAgent || req.userAgent.length < 15) {
      score += 25;
      signals.push('ANOMALOUS_USER_AGENT');
    }

    // 5. Unusually High Order Value
    if (req.orderAmountMinor > 250000) {
      // > $2,500
      score += 15;
      signals.push('HIGH_VALUE_TRANSACTION');
    }

    const clampedScore = Math.min(100, Math.max(0, score));

    let riskLevel: RiskLevel = 'LOW';
    let action: RiskEvaluationResult['action'] = 'ALLOW';

    if (clampedScore >= 75) {
      riskLevel = 'CRITICAL';
      action = 'BLOCK';
    } else if (clampedScore >= 50) {
      riskLevel = 'HIGH';
      action = 'MANUAL_REVIEW';
    } else if (clampedScore >= 25) {
      riskLevel = 'MEDIUM';
      action = 'STEP_UP_CHALLENGE';
    }

    return {
      riskScore: clampedScore,
      riskLevel,
      action,
      riskSignals: signals,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

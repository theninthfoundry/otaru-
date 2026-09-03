/**
 * OTARU HARDENED OTP AUTHENTICATION SERVICE
 * Implements strict rate-limiting (5 requests / 15 min), 5-attempt brute-force lockout,
 * SHA-256 hashing at rest, and account enumeration defense.
 */

import crypto from 'crypto';

export interface OtpChallengeRecord {
  id: string;
  destination: string;
  codeHash: string;
  attempts: number;
  maxAttempts: number;
  isConsumed: boolean;
  expiresAt: number;
  createdAt: number;
}

export const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const OTP_MAX_REQUESTS_PER_WINDOW = 5;

export class OtpService {
  private challenges: Map<string, OtpChallengeRecord> = new Map();
  private requestHistory: Map<string, number[]> = new Map();

  /**
   * Generates a 6-digit numeric OTP code.
   */
  static generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Hashes the code with SHA-256 for secure storage.
   */
  static hashCode(code: string, salt: string = 'otaru_otp_salt'): string {
    return crypto.createHash('sha256').update(`${code}::${salt}`).digest('hex');
  }

  /**
   * Checks rate limiting for an identity / IP destination.
   */
  checkRateLimit(destination: string): boolean {
    const now = Date.now();
    const timestamps = (this.requestHistory.get(destination) || []).filter(
      (ts) => now - ts < OTP_RATE_LIMIT_WINDOW_MS
    );

    if (timestamps.length >= OTP_MAX_REQUESTS_PER_WINDOW) {
      return false; // Rate limit exceeded
    }

    timestamps.push(now);
    this.requestHistory.set(destination, timestamps);
    return true;
  }

  /**
   * Creates an OTP challenge.
   * Returns generic message to prevent account enumeration.
   */
  createChallenge(destination: string): {
    success: boolean;
    challengeId?: string;
    generatedCodeForDev?: string;
    message: string;
  } {
    const normalizedDest = destination.trim().toLowerCase();

    if (!this.checkRateLimit(normalizedDest)) {
      return {
        success: false,
        message: 'Too many requests. Please wait 15 minutes before requesting another code.',
      };
    }

    const code = OtpService.generateCode();
    const codeHash = OtpService.hashCode(code);
    const challengeId = `otp_${crypto.randomUUID()}`;
    const now = Date.now();

    this.challenges.set(normalizedDest, {
      id: challengeId,
      destination: normalizedDest,
      codeHash,
      attempts: 0,
      maxAttempts: OTP_MAX_ATTEMPTS,
      isConsumed: false,
      expiresAt: now + OTP_EXPIRY_MS,
      createdAt: now,
    });

    return {
      success: true,
      challengeId,
      generatedCodeForDev: code, // In production, dispatched via Email/SMS worker only
      message: 'If an account can receive a code, an archival verification cipher has been dispatched.',
    };
  }

  /**
   * Verifies an OTP code with brute-force lockout and timing-safe comparison.
   */
  verifyCode(destination: string, submittedCode: string): {
    success: boolean;
    reason?: 'EXPIRED' | 'MAX_ATTEMPTS_EXCEEDED' | 'INVALID_CODE' | 'NOT_FOUND';
  } {
    const normalizedDest = destination.trim().toLowerCase();
    const challenge = this.challenges.get(normalizedDest);

    if (!challenge || challenge.isConsumed) {
      return { success: false, reason: 'NOT_FOUND' };
    }

    if (Date.now() > challenge.expiresAt) {
      this.challenges.delete(normalizedDest);
      return { success: false, reason: 'EXPIRED' };
    }

    if (challenge.attempts >= challenge.maxAttempts) {
      this.challenges.delete(normalizedDest);
      return { success: false, reason: 'MAX_ATTEMPTS_EXCEEDED' };
    }

    challenge.attempts++;

    // Timing-safe comparison
    const expectedHash = challenge.codeHash;
    const submittedHash = OtpService.hashCode(submittedCode);

    const isMatch =
      expectedHash.length === submittedHash.length &&
      crypto.timingSafeEqual(Buffer.from(expectedHash), Buffer.from(submittedHash));

    if (!isMatch) {
      if (challenge.attempts >= challenge.maxAttempts) {
        // Immediate lockout on 5th attempt
        this.challenges.delete(normalizedDest);
        return { success: false, reason: 'MAX_ATTEMPTS_EXCEEDED' };
      }
      return { success: false, reason: 'INVALID_CODE' };
    }

    // Success: mark consumed immediately
    challenge.isConsumed = true;
    this.challenges.delete(normalizedDest);
    return { success: true };
  }
}

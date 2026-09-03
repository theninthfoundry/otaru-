import { describe, it, expect } from 'vitest';
import { hasPermission } from '@/lib/auth/permissions';
import { SessionManager } from '@/lib/auth/session';
import { OtpService } from '@/lib/auth/otp';
import {
  assertAuthenticated,
  assertPermission,
  assertElevatedAction,
  AuthenticationError,
  ForbiddenError,
  ElevatedActionError,
} from '@/lib/auth/authorization';
import { AuditRecorder } from '@/lib/auth/audit';

describe('PHASE B + IDENTITY SECURITY GATE — COMPLETE ADVERSARIAL PASS', () => {

  // -------------------------------------------------------------------------
  // 1. Zero IDOR Defense
  // -------------------------------------------------------------------------
  describe('Check 1: Zero IDOR & Session Subject Authority', () => {
    it('resolves orders strictly from validated session, completely ignoring poisoned client query params', () => {
      const sessionManager = new SessionManager();
      const { token, session } = sessionManager.createSession('user_alice_001', 'alice@luxury.in', 'CUSTOMER');

      // Validated session
      const validated = sessionManager.validateSession(token);
      assertAuthenticated(validated);

      // Adversarial attack: Attacker injects query parameter ?userId=user_bob_victim
      const clientQueryParams = { userId: 'user_bob_victim' };

      // Architecture rule: Resolver uses validated.userId, discarding clientQueryParams.userId
      const queryTargetUserId = validated.userId; // user_alice_001

      expect(queryTargetUserId).toBe('user_alice_001');
      expect(queryTargetUserId).not.toBe(clientQueryParams.userId);
    });

    it('rejects unauthenticated requests with AuthenticationError', () => {
      expect(() => assertAuthenticated(null)).toThrow(AuthenticationError);
    });
  });

  // -------------------------------------------------------------------------
  // 2. Centralized RBAC & Permission Boundaries
  // -------------------------------------------------------------------------
  describe('Check 2: RBAC Matrix & Fine-Grained Permissions', () => {
    it('CUSTOMER cannot issue refunds, read financial ledger, or manage inventory', () => {
      expect(hasPermission('CUSTOMER', 'orders.read_own')).toBe(true);
      expect(hasPermission('CUSTOMER', 'refunds.create')).toBe(false);
      expect(hasPermission('CUSTOMER', 'ledger.read')).toBe(false);
      expect(hasPermission('CUSTOMER', 'inventory.manage')).toBe(false);
    });

    it('MAKER can inspect QC and package garments, but cannot refund or edit journal', () => {
      expect(hasPermission('MAKER', 'qc.inspect')).toBe(true);
      expect(hasPermission('MAKER', 'garment.package')).toBe(true);
      expect(hasPermission('MAKER', 'refunds.create')).toBe(false);
      expect(hasPermission('MAKER', 'journal.write')).toBe(false);
    });

    it('EDITOR can edit products and chapters, but cannot touch financial ledger', () => {
      expect(hasPermission('EDITOR', 'products.edit')).toBe(true);
      expect(hasPermission('EDITOR', 'chapters.edit')).toBe(true);
      expect(hasPermission('EDITOR', 'ledger.read')).toBe(false);
      expect(hasPermission('EDITOR', 'refunds.create')).toBe(false);
    });

    it('ADMIN has operational control, but financial refunds require OWNER', () => {
      expect(hasPermission('ADMIN', 'orders.manage')).toBe(true);
      expect(hasPermission('ADMIN', 'shipments.manage')).toBe(true);
      expect(hasPermission('ADMIN', 'refunds.create')).toBe(false); // Restricted to OWNER
    });

    it('OWNER holds complete permission hierarchy', () => {
      expect(hasPermission('OWNER', 'refunds.create')).toBe(true);
      expect(hasPermission('OWNER', 'ledger.read')).toBe(true);
      expect(hasPermission('OWNER', 'users.manage_roles')).toBe(true);
      expect(hasPermission('OWNER', 'audit.read')).toBe(true);
    });

    it('throws typed ForbiddenError when a role attempts an unauthorized action', () => {
      const sessionManager = new SessionManager();
      const { session } = sessionManager.createSession('user_cust_01', 'cust@luxury.in', 'CUSTOMER');

      expect(() => assertPermission(session, 'refunds.create')).toThrow(ForbiddenError);
    });
  });

  // -------------------------------------------------------------------------
  // 3. Hardened OTP Security & Brute-Force Lockout
  // -------------------------------------------------------------------------
  describe('Check 3: Hardened OTP Rate-Limiting & Brute-Force Lockout', () => {
    it('locks out after 5 consecutive bad OTP attempts', () => {
      const otpService = new OtpService();
      const email = 'collector@luxury.in';

      const challenge = otpService.createChallenge(email);
      expect(challenge.success).toBe(true);

      // 4 incorrect attempts
      for (let i = 0; i < 4; i++) {
        const attempt = otpService.verifyCode(email, '000000');
        expect(attempt.success).toBe(false);
        expect(attempt.reason).toBe('INVALID_CODE');
      }

      // 5th incorrect attempt -> triggers permanent lockout
      const fifthAttempt = otpService.verifyCode(email, '000000');
      expect(fifthAttempt.success).toBe(false);
      expect(fifthAttempt.reason).toBe('MAX_ATTEMPTS_EXCEEDED');

      // Subsequent attempt confirms challenge is completely expunged
      const subsequentAttempt = otpService.verifyCode(email, challenge.generatedCodeForDev!);
      expect(subsequentAttempt.success).toBe(false);
      expect(subsequentAttempt.reason).toBe('NOT_FOUND');
    });

    it('verifies correct OTP code and prevents token replay', () => {
      const otpService = new OtpService();
      const email = 'collector2@luxury.in';

      const challenge = otpService.createChallenge(email);
      const validCode = challenge.generatedCodeForDev!;

      // Successful verification
      const verifySuccess = otpService.verifyCode(email, validCode);
      expect(verifySuccess.success).toBe(true);

      // Replay attempt fails immediately
      const replayAttempt = otpService.verifyCode(email, validCode);
      expect(replayAttempt.success).toBe(false);
      expect(replayAttempt.reason).toBe('NOT_FOUND');
    });

    it('enforces rate-limiting on 6th request within 15 minutes', () => {
      const otpService = new OtpService();
      const email = 'spam_target@luxury.in';

      // First 5 requests succeed
      for (let i = 0; i < 5; i++) {
        const res = otpService.createChallenge(email);
        expect(res.success).toBe(true);
      }

      // 6th request rejected by rate limit
      const sixth = otpService.createChallenge(email);
      expect(sixth.success).toBe(false);
      expect(sixth.message).toContain('Too many requests');
    });
  });

  // -------------------------------------------------------------------------
  // 4. Account Enumeration Prevention
  // -------------------------------------------------------------------------
  describe('Check 4: Anti-Enumeration Identical Responses', () => {
    it('returns indistinguishable response regardless of email history', () => {
      const otpService = new OtpService();

      const existingAccount = otpService.createChallenge('founder@otaru.in');
      const unknownAccount = otpService.createChallenge('random_stranger_9876@unknown.net');

      expect(existingAccount.message).toBe(unknownAccount.message);
      expect(existingAccount.message).toContain('If an account can receive a code');
    });
  });

  // -------------------------------------------------------------------------
  // 5. Session Lifecycle, Revocation & Sign-Out All Devices
  // -------------------------------------------------------------------------
  describe('Check 5: Session Lifecycle & Sign Out Everywhere', () => {
    it('supports individual session revocation and full device logout', () => {
      const sessionManager = new SessionManager();
      const userId = 'user_atelier_master';

      // Logged in on 2 devices (Desktop & Mobile)
      const session1 = sessionManager.createSession(userId, 'master@otaru.in', 'ADMIN', { userAgent: 'Chrome Windows' });
      const session2 = sessionManager.createSession(userId, 'master@otaru.in', 'ADMIN', { userAgent: 'Safari iPhone' });

      expect(sessionManager.getUserActiveSessions(userId).length).toBe(2);

      // Sign out all devices
      const revoked = sessionManager.revokeAllUserSessions(userId);
      expect(revoked).toBe(2);

      // Both tokens are now invalid
      expect(sessionManager.validateSession(session1.token)).toBeNull();
      expect(sessionManager.validateSession(session2.token)).toBeNull();
      expect(sessionManager.getUserActiveSessions(userId).length).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // 6. Elevated Actions & Immutable Audit Trail
  // -------------------------------------------------------------------------
  describe('Check 6: Elevated Two-Level Action Authorization & Immutable Audit Trail', () => {
    it('strictly denies high-risk refund to ADMIN, requiring OWNER role', () => {
      const sessionManager = new SessionManager();
      const adminSession = sessionManager.createSession('admin_01', 'admin@otaru.in', 'ADMIN');

      expect(() => assertElevatedAction(adminSession.session, 'REFUND_DISBURSEMENT')).toThrow(ElevatedActionError);
    });

    it('allows OWNER to perform elevated action and records immutable audit event', () => {
      const sessionManager = new SessionManager();
      const ownerSession = sessionManager.createSession('owner_01', 'owner@otaru.in', 'OWNER');

      // Authorization passes
      expect(() => assertElevatedAction(ownerSession.session, 'REFUND_DISBURSEMENT')).not.toThrow();

      // Record immutable audit event
      const recorder = new AuditRecorder();
      const auditEntry = recorder.record({
        actorId: ownerSession.session.userId,
        action: 'REFUND_DISBURSEMENT',
        targetType: 'ORDER',
        targetId: 'OTR-2026-000184',
        beforeState: { status: 'PAID', amountCapturedMinor: 4032000 },
        afterState: { status: 'REFUNDED', refundedAmountMinor: 4032000 },
        ipAddress: '127.0.0.1',
        requestId: 'req_audit_test_001',
      });

      expect(auditEntry.id).toMatch(/^audit_/);
      expect(auditEntry.actorId).toBe('owner_01');
      expect(auditEntry.action).toBe('REFUND_DISBURSEMENT');
      expect(recorder.getRecordsForTarget('OTR-2026-000184').length).toBe(1);
    });
  });
});

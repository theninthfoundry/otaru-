import { describe, it, expect } from 'vitest';
import { runPaymentReconciliation } from '@/lib/payments/reconciliation';
import { validateEnvMatrix } from '@/lib/testing/env-matrix-checker';
import { POST as reconcileHandler } from '@/app/api/admin/reconcile/route';

describe('Phase 7 — Release Candidate & Reconciliation Test Suite', () => {
  describe('1. Safety-Net Reconciliation Engine', () => {
    it('executes state cross-audit and returns a healthy status for consistent data', async () => {
      const report = await runPaymentReconciliation();
      expect(report.status).toBe('HEALTHY');
      expect(report.mismatchesFound).toBe(0);
    });
  });

  describe('2. Protected Admin Reconcile Endpoint', () => {
    it('rejects unauthenticated POST requests in production mode with 401 Unauthorized', async () => {
      const originalEnv = process.env.NODE_ENV;
      try {
        (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
        process.env.ADMIN_API_SECRET = 'super_secret_admin_key_123';

        const mockReq = new Request('http://localhost/api/admin/reconcile', {
          method: 'POST',
        });

        const res = await reconcileHandler(mockReq);
        expect(res.status).toBe(401);
      } finally {
        (process.env as Record<string, string | undefined>).NODE_ENV = originalEnv;
      }
    });
  });

  describe('3. Environment Matrix & Secret Boundaries', () => {
    it('confirms no server secrets are prefixed with NEXT_PUBLIC_', () => {
      const violations = validateEnvMatrix();
      const criticalLeaks = violations.filter((v) => v.severity === 'CRITICAL' && v.issue.includes('NEXT_PUBLIC_'));
      expect(criticalLeaks.length).toBe(0);
    });
  });
});

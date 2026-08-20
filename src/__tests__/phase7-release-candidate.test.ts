import { describe, it, expect, vi } from 'vitest';
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
      vi.stubEnv('NODE_ENV', 'production');
      vi.stubEnv('ADMIN_API_SECRET', 'super_secret_admin_key_123');

      const mockReq = new Request('http://localhost/api/admin/reconcile', {
        method: 'POST',
      });

      const res = await reconcileHandler(mockReq);
      expect(res.status).toBe(401);

      vi.unstubAllEnvs();
    });
  });

  describe('3. Environment Matrix & Secret Boundaries', () => {
    it('confirms no server secrets are prefixed with NEXT_PUBLIC_', () => {
      const violations = validateEnvMatrix();
      const criticalLeaks = violations.filter((v) => v.severity === 'CRITICAL');
      expect(criticalLeaks.length).toBe(0);
    });
  });
});

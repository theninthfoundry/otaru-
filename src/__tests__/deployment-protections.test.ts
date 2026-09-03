import { describe, it, expect } from 'vitest';
import { VersionSyncManager } from '@/lib/domain/system/version-sync';

describe('DEPLOYMENT ARCHITECTURE & PRODUCTION CONTROLS', () => {

  // -------------------------------------------------------------------------
  // 1. Canonical Domain & Host Enforcement
  // -------------------------------------------------------------------------
  describe('Control 1: Canonical Domain Redirection', () => {
    it('redirects www.otaru.in to canonical https://otaru.in with path preservation', () => {
      const redirect1 = VersionSyncManager.evaluateCanonicalRedirect('www.otaru.in', '/archive');
      expect(redirect1).toBe('https://otaru.in/archive');

      const redirectRoot = VersionSyncManager.evaluateCanonicalRedirect('www.otaru.in:443', '/');
      expect(redirectRoot).toBe('https://otaru.in/');
    });

    it('does not redirect canonical apex domain otaru.in', () => {
      const noRedirect = VersionSyncManager.evaluateCanonicalRedirect('otaru.in', '/journal');
      expect(noRedirect).toBeNull();
    });
  });

  // -------------------------------------------------------------------------
  // 2. Frontend-Backend Skew Protection
  // -------------------------------------------------------------------------
  describe('Control 2: Frontend-Backend Skew Protection', () => {
    it('detects version skew when client build ID does not match active deployment', () => {
      const currentBuild = VersionSyncManager.getDeploymentMetadata().buildId;

      // Matching build -> no skew
      const inSync = VersionSyncManager.checkSkew(currentBuild);
      expect(inSync.isSkewed).toBe(false);

      // Stale client build -> skew flagged
      const skewed = VersionSyncManager.checkSkew('stale_older_commit_sha');
      expect(skewed.isSkewed).toBe(true);
      expect(skewed.currentBuildId).toBe(currentBuild);
    });
  });

  // -------------------------------------------------------------------------
  // 3. Secure Preview Deployments
  // -------------------------------------------------------------------------
  describe('Control 3: Preview Deployment Security Guard', () => {
    it('enforces authentication on preview environments when access key is active', () => {
      const secret = 'otaru_atelier_preview_pass_2026';

      // Unauthorized request missing key
      expect(VersionSyncManager.verifyPreviewAccess(null, secret)).toBe(false);
      expect(VersionSyncManager.verifyPreviewAccess('wrong_key', secret)).toBe(false);

      // Authorized request with matching key
      expect(VersionSyncManager.verifyPreviewAccess(secret, secret)).toBe(true);
    });

    it('permits open access if no preview secret is configured', () => {
      expect(VersionSyncManager.verifyPreviewAccess(null, null)).toBe(true);
    });
  });
});

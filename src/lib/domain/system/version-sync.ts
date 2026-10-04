/**
 * OTARU VERSION SYNC & SKEW PROTECTION ENGINE
 * Prevents frontend-backend version mismatches across rolling deployments.
 * Detects stale client builds and coordinates transparent chunk reloading.
 */

export interface DeploymentMetadata {
  buildId: string;
  deploymentId: string;
  environment: 'production' | 'preview' | 'development';
  timestamp: string;
}

export const CURRENT_RELEASE_TAG = 'v1.0-architecture';

export class VersionSyncManager {
  /**
   * Generates or extracts active deployment identifiers.
   */
  static getDeploymentMetadata(): DeploymentMetadata {
    return {
      buildId: process.env.VERCEL_GIT_COMMIT_SHA || process.env.BUILD_ID || CURRENT_RELEASE_TAG,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || `dpl_${CURRENT_RELEASE_TAG}`,
      environment: (process.env.VERCEL_ENV as DeploymentMetadata['environment']) || 'development',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Compares client build ID with active server build ID.
   */
  static checkSkew(clientBuildId?: string | null): { isSkewed: boolean; currentBuildId: string } {
    const current = this.getDeploymentMetadata().buildId;
    if (!clientBuildId) {
      return { isSkewed: false, currentBuildId: current };
    }
    return {
      isSkewed: clientBuildId !== current,
      currentBuildId: current,
    };
  }

  /**
   * Computes canonical domain redirect if hostname contains www or secondary alias.
   */
  static evaluateCanonicalRedirect(host: string, pathname: string = '/'): string | null {
    const cleanHost = host.toLowerCase().split(':')[0]!;
    if (cleanHost === 'www.otaru.in') {
      return `https://otaru.in${pathname}`;
    }
    return null;
  }

  /**
   * Checks if preview deployment protection is satisfied.
   */
  static verifyPreviewAccess(previewToken?: string | null, requiredSecret?: string | null): boolean {
    if (!requiredSecret) return true; // No preview password set
    if (!previewToken) return false;
    return previewToken === requiredSecret;
  }
}

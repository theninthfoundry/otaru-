export interface EnvCheckViolation {
  variable: string;
  issue: string;
  severity: 'CRITICAL' | 'WARNING';
}

export function validateEnvMatrix(): EnvCheckViolation[] {
  const violations: EnvCheckViolation[] = [];

  // Check 1: Ensure server-only secrets do NOT leak into NEXT_PUBLIC_*
  const publicKeys = Object.keys(process.env).filter((k) => k.startsWith('NEXT_PUBLIC_'));
  for (const key of publicKeys) {
    if (key.includes('SECRET') || key.includes('ADMIN') || key.includes('PASSWORD') || key.includes('PRIVATE')) {
      violations.push({
        variable: key,
        issue: `Secret variable ${key} is exposed with NEXT_PUBLIC_ prefix!`,
        severity: 'CRITICAL',
      });
    }
  }

  // Check 2: Production mandatory secrets presence check
  if (process.env.NODE_ENV === 'production' || process.env.STRICT_ENV_CHECK === 'true') {
    const requiredServerSecrets = ['DATABASE_URL', 'REDIS_URL', 'RAZORPAY_KEY_SECRET', 'ADMIN_API_SECRET'];
    for (const secret of requiredServerSecrets) {
      if (!process.env[secret]) {
        violations.push({
          variable: secret,
          issue: `Mandatory production secret ${secret} is missing from environment!`,
          severity: 'CRITICAL',
        });
      }
    }
  }

  return violations;
}

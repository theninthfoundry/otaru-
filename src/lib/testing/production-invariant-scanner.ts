import fs from 'fs';
import path from 'path';

export interface InvariantViolation {
  rule: string;
  file: string;
  line?: number;
  snippet: string;
  severity: 'CRITICAL' | 'WARNING';
}

export function scanProductionInvariants(srcPath: string): InvariantViolation[] {
  const violations: InvariantViolation[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!['node_modules', '.next', '.git'].includes(entry.name)) {
          walk(fullPath);
        }
      } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          // Rule 1: No mock payment signatures in verify route
          if (fullPath.includes('verify') && line.includes('mock_signature_approved') && !content.includes('isProduction')) {
            violations.push({
              rule: 'MOCK_PAYMENT_BYPASS',
              file: fullPath,
              line: index + 1,
              snippet: line.trim(),
              severity: 'CRITICAL',
            });
          }

          // Rule 2: No simulated NFC tag redirects
          if (fullPath.includes('nfc') && line.includes('OTARU-001-042')) {
            violations.push({
              rule: 'FAKE_NFC_SIMULATION',
              file: fullPath,
              line: index + 1,
              snippet: line.trim(),
              severity: 'CRITICAL',
            });
          }
        });
      }
    }
  }

  walk(srcPath);
  return violations;
}

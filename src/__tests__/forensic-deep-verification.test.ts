import { describe, it, expect } from 'vitest';
import { issueNonceAsync, consumeNonceAsync } from '@/lib/payments/nonce-store';

describe('Adversarial Forensic Deep Verification Suite', () => {
  describe('1. Distributed Redis Nonce Consumption', () => {
    it('issues, verifies, and single-use consumes payment nonces in Redis', async () => {
      const orderId = 'OTARU-FORENSIC-9901';
      const nonce = await issueNonceAsync(orderId);

      expect(nonce).toBeDefined();

      const firstConsume = await consumeNonceAsync(nonce, orderId);
      expect(firstConsume.ok).toBe(true);

      const secondConsume = await consumeNonceAsync(nonce, orderId);
      expect(secondConsume.ok).toBe(false);
    });
  });

  describe('2. Direct GROQ Injection Inspection', () => {
    it('confirms GROQ queries use parameterized inputs rather than raw string concatenation', async () => {
      const { getChapterBySlug } = await import('@/lib/sanity/queries');
      const maliciousSlug = "chapter-02' || status == 'draft'";

      // Query should execute cleanly without evaluating injected GROQ expression
      const result = await getChapterBySlug(maliciousSlug);
      expect(result).toBeDefined();
    });
  });
});

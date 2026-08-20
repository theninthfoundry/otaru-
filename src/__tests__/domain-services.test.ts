import { describe, it, expect } from 'vitest';
import { getProducts, getProductByHandle } from '@/lib/commerce/products';
import { getAllChapters } from '@/lib/cms/sanity';
import { VERIFICATION_REGISTRY } from '@/lib/provenance/verification';
import { MEMBERSHIP_TIERS } from '@/lib/membership/membership';

describe('Otaru Domain Services Architectural Tests', () => {
  it('Commerce Domain: returns mock artifacts list fallback', async () => {
    const { artifacts } = await getProducts({ first: 2 });
    expect(artifacts.length).toBeGreaterThan(0);
    expect(artifacts[0]).toHaveProperty('handle');
    expect(artifacts[0]).toHaveProperty('title');
  });

  it('Commerce Domain: resolves artifact by handle', async () => {
    const artifact = await getProductByHandle('artifact-001-denim-jacket');
    expect(artifact).not.toBeNull();
    expect(artifact?.handle).toBe('artifact-001-denim-jacket');
  });

  it('CMS Domain: returns chapters from Sanity query or mock fallback', async () => {
    const chapters = await getAllChapters();
    expect(chapters.length).toBeGreaterThan(0);
    expect(chapters[0]).toHaveProperty('slug');
  });

  it('Provenance Domain: verifies valid serial format', () => {
    expect(VERIFICATION_REGISTRY.isValidSerial('OTARU-007-104')).toBe(true);
    expect(VERIFICATION_REGISTRY.isValidSerial('INVALID-SERIAL')).toBe(false);
  });

  it('Membership Domain: exports patron and collector tiers', () => {
    expect(MEMBERSHIP_TIERS).toHaveProperty('patron');
    expect(MEMBERSHIP_TIERS).toHaveProperty('collector');
    expect(MEMBERSHIP_TIERS.patron?.benefits).toContain('Early access');
  });
});

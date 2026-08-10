/**
 * OTARU — Membership Domain Service
 */
export interface PatronTier {
  name: string;
  benefits: string[];
}

export const MEMBERSHIP_TIERS: Record<string, PatronTier> = {
  patron: { name: 'Patron', benefits: ['Early access', 'Chapter priority'] },
  collector: { name: 'Collector', benefits: ['Private releases', 'Custom tailoring details'] },
};

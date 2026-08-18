/**
 * OTARU — Archival Guild Membership Privileges & Drop Gatekeeper
 * Enforces tier-based drop access schedules, allocation caps, and VIP privileges.
 */

export type MembershipTier = 'INITIATE' | 'PATRON' | 'VANGUARD';

export interface TierPrivilegeConfig {
  tier: MembershipTier;
  displayName: string;
  earlyAccessHours: number; // Hours before general public release
  maxCartAllocation: number; // Max units of a single drop SKU
  conciergeAccess: boolean;
  freeExpressLogistics: boolean;
  perks: string[];
}

export const TIER_PRIVILEGES: Record<MembershipTier, TierPrivilegeConfig> = {
  INITIATE: {
    tier: 'INITIATE',
    displayName: 'Initiate Guild',
    earlyAccessHours: 0, // Public release time
    maxCartAllocation: 1,
    conciergeAccess: false,
    freeExpressLogistics: false,
    perks: ['Standard Drop Allocation', 'Digital Certificate Verification', 'Archival Journal Access'],
  },
  PATRON: {
    tier: 'PATRON',
    displayName: 'Patron Circle',
    earlyAccessHours: 12, // 12 hours early access
    maxCartAllocation: 2,
    conciergeAccess: true,
    freeExpressLogistics: true,
    perks: ['12h Drop Priority Access', 'Complimentary Insured Shipping', 'Bespoke Atelier Inquiries'],
  },
  VANGUARD: {
    tier: 'VANGUARD',
    displayName: 'Vanguard Archive',
    earlyAccessHours: 24, // 24 hours early access
    maxCartAllocation: 3,
    conciergeAccess: true,
    freeExpressLogistics: true,
    perks: [
      '24h Absolute First Allocation Access',
      'Private 1-on-1 Sizing Concierge',
      'Exclusive Serialized HW Hardware NFC Access',
      'Global White-Glove Courier',
    ],
  },
};

/**
 * Computes when a specific tier gets access to a scheduled drop.
 */
export function getTierAccessTime(publicReleaseDate: Date | string, tier: MembershipTier): Date {
  const publicTime = new Date(publicReleaseDate).getTime();
  const earlyMs = TIER_PRIVILEGES[tier].earlyAccessHours * 60 * 60 * 1000;
  return new Date(publicTime - earlyMs);
}

/**
 * Checks if a member of a given tier is currently eligible to purchase from a drop.
 */
export function isTierEligibleForDrop(
  publicReleaseDate: Date | string,
  userTier: MembershipTier = 'INITIATE',
  currentTime: Date = new Date()
): {
  isEligible: boolean;
  unlockTime: Date;
  timeRemainingMs: number;
  tier: MembershipTier;
} {
  const unlockTime = getTierAccessTime(publicReleaseDate, userTier);
  const now = currentTime.getTime();
  const unlockMs = unlockTime.getTime();
  const timeRemainingMs = Math.max(0, unlockMs - now);

  return {
    isEligible: now >= unlockMs,
    unlockTime,
    timeRemainingMs,
    tier: userTier,
  };
}

/**
 * Validates requested quantity against the member's tier allocation cap.
 */
export function validateTierAllocation(
  requestedQuantity: number,
  tier: MembershipTier = 'INITIATE'
): { allowed: boolean; maxAllowed: number; reason?: string } {
  const maxAllowed = TIER_PRIVILEGES[tier].maxCartAllocation;
  if (requestedQuantity > maxAllowed) {
    return {
      allowed: false,
      maxAllowed,
      reason: `Maximum allocation for ${TIER_PRIVILEGES[tier].displayName} is ${maxAllowed} unit(s) per artifact.`,
    };
  }
  return { allowed: true, maxAllowed };
}

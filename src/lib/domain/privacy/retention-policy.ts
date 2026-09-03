/**
 * OTARU PRIVACY & LEGAL RETENTION POLICY
 * Implements GDPR / DPDP right-to-be-forgotten while preserving mandatory
 * statutory tax and financial ledger records.
 */

export interface CollectorProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  shippingAddress?: string;
  orders: {
    orderId: string;
    amountPaise: number;
    gstPaise: number;
    timestamp: string;
  }[];
}

export interface AnonymizedCollectorRecord {
  id: string;
  name: '[ANONYMIZED_COLLECTOR]';
  email: string; // "redacted-user-xxxx@otaru.internal"
  phoneNumber: null;
  shippingAddress: null;
  anonymizedAt: string;
  orders: CollectorProfile['orders']; // Financial ledger remains intact!
}

export class PrivacyRetentionEngine {
  /**
   * Anonymizes customer PII upon account deletion request while strictly preserving
   * financial audit trails for tax compliance.
   */
  static anonymizeCustomerData(profile: CollectorProfile): AnonymizedCollectorRecord {
    const anonymizedEmail = `redacted_${profile.id.slice(0, 8)}@archive.internal`;

    return {
      id: profile.id,
      name: '[ANONYMIZED_COLLECTOR]',
      email: anonymizedEmail,
      phoneNumber: null,
      shippingAddress: null,
      anonymizedAt: new Date().toISOString(),
      // Preserved statutory tax & order history
      orders: profile.orders.map((o) => ({ ...o })),
    };
  }
}

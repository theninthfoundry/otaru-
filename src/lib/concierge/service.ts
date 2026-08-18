/**
 * OTARU — Archival Atelier Concierge Service
 * Manages private client bespoke inquiries, sizing consultations, and appointment requests.
 */

import { appendAuditEvent } from '@/lib/payments/audit-trail';
import { randomUUID } from 'crypto';

export type InquiryType = 'BESPOKE_SIZING' | 'PRIVATE_ARCHIVE_VIEWING' | 'REPAIR_RESTORATION' | 'CUSTOM_ORDER';

export interface ConciergeInquiry {
  id: string;
  inquiryType: InquiryType;
  patronName: string;
  patronEmail: string;
  patronTier?: string;
  artifactHandle?: string;
  message: string;
  preferredContact: 'EMAIL' | 'WHATSAPP' | 'PHONE';
  contactValue: string;
  status: 'RECEIVED' | 'IN_REVIEW' | 'SCHEDULED' | 'RESOLVED';
  createdAt: string;
}

const conciergeRequests: ConciergeInquiry[] = [];

/**
 * Submits a new concierge inquiry into the archival client service queue.
 */
export async function submitConciergeInquiry(
  data: Omit<ConciergeInquiry, 'id' | 'status' | 'createdAt'>
): Promise<ConciergeInquiry> {
  const inquiry: ConciergeInquiry = {
    ...data,
    id: `OTARU-CNC-${randomUUID().substring(0, 8).toUpperCase()}`,
    status: 'RECEIVED',
    createdAt: new Date().toISOString(),
  };

  conciergeRequests.push(inquiry);

  // Record tamper-evident audit trail log
  await appendAuditEvent({
    type: 'CONCIERGE_INQUIRY_SUBMITTED',
    ref: inquiry.id,
    email: inquiry.patronEmail,
    details: `Concierge request ${inquiry.id} of type ${inquiry.inquiryType} submitted by ${inquiry.patronName}`,
    meta: {
      inquiryType: inquiry.inquiryType,
      artifactHandle: inquiry.artifactHandle,
      preferredContact: inquiry.preferredContact,
    },
  });

  return inquiry;
}

/**
 * Lists all active concierge inquiries.
 */
export function listConciergeInquiries(): ConciergeInquiry[] {
  return [...conciergeRequests];
}

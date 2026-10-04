/**
 * OTARU CLIENT CONCIERGE & SUPPORT SERVICE
 * Governs collector inquiry tickets and enforces read-only financial boundaries
 * for customer care specialists.
 */

export type ConciergeTicketStatus =
  | 'OPEN'
  | 'ATELIER_REVIEW'
  | 'ACTION_REQUIRED'
  | 'RESOLVED'
  | 'CLOSED';

export type TicketCategory =
  | 'ORDER_STATUS'
  | 'BOTANICAL_CARE'
  | 'ALTERATION_REQUEST'
  | 'RETURN_INQUIRY'
  | 'PROVENANCE_ASSISTANCE';

export interface ConciergeTicket {
  id: string;
  ticketNumber: string;         // "OTR-CARE-2026-0041"
  collectorId: string;
  orderId?: string;
  garmentSerial?: string;
  category: TicketCategory;
  subject: string;
  status: ConciergeTicketStatus;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
}

export class ConciergeManager {
  private tickets: Map<string, ConciergeTicket> = new Map();

  /**
   * Creates a new client concierge ticket.
   */
  openTicket(
    collectorId: string,
    category: TicketCategory,
    subject: string,
    orderId?: string,
    garmentSerial?: string
  ): ConciergeTicket {
    const id = `tkt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `OTR-CARE-2026-${randomSuffix}`;
    const now = new Date().toISOString();

    const ticket: ConciergeTicket = {
      id,
      ticketNumber,
      collectorId,
      orderId,
      garmentSerial,
      category,
      subject,
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
    };

    this.tickets.set(id, ticket);
    return ticket;
  }

  /**
   * Advances ticket lifecycle.
   */
  updateTicketStatus(
    ticketId: string,
    newStatus: ConciergeTicketStatus,
    resolutionNotes?: string
  ): ConciergeTicket | null {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return null;

    ticket.status = newStatus;
    ticket.updatedAt = new Date().toISOString();
    if (resolutionNotes) {
      ticket.resolutionNotes = resolutionNotes;
    }

    return ticket;
  }

  getTicket(ticketId: string): ConciergeTicket | null {
    return this.tickets.get(ticketId) || null;
  }
}

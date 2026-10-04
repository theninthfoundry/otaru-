/**
 * OTARU UNIFIED NOTIFICATION ENGINE
 * Channels: EMAIL, SMS, WHATSAPP
 * Uses respectful, calm editorial language representing the living archive.
 */

export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP';

export type NotificationEventType =
  | 'ORDER_CONFIRMED'
  | 'PAYMENT_CONFIRMED'
  | 'PAYMENT_FAILED'
  | 'INSPECTION_COMPLETE'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURN_APPROVED'
  | 'REFUND_ISSUED'
  | 'PROVENANCE_ISSUED';

export interface NotificationPayload {
  orderNumber: string;
  garmentSerial?: string;
  garmentTitle: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone?: string;
  trackingNumber?: string;
  deedUrl?: string;
}

export interface PreparedMessage {
  channel: NotificationChannel;
  destination: string;
  subject?: string;
  body: string;
}

export class NotificationTemplateEngine {
  static render(eventType: NotificationEventType, payload: NotificationPayload): PreparedMessage[] {
    const messages: PreparedMessage[] = [];

    switch (eventType) {
      case 'ORDER_CONFIRMED':
        messages.push({
          channel: 'EMAIL',
          destination: payload.recipientEmail,
          subject: `OTARU — The Archive Has Accepted Your Order (${payload.orderNumber})`,
          body: `
OTARU (小樽)
GARMENTS WORTH KEEPING

Dear ${payload.recipientName},

Your order for ${payload.garmentTitle} has been recorded into the atelier registry under ${payload.orderNumber}.
Our craftspeople have begun preparing the textiles. You may observe its progression at any time:

https://otaru.in/account/orders/${payload.orderNumber}
          `.trim(),
        });
        break;

      case 'INSPECTION_COMPLETE':
        messages.push({
          channel: 'EMAIL',
          destination: payload.recipientEmail,
          subject: `OTARU — Inspection Approved: ${payload.garmentSerial || payload.garmentTitle}`,
          body: `
OTARU (小樽)
QUALITY INSPECTION COMPLETE

Your physical garment (${payload.garmentSerial}) has passed tactile inspection at our Hokkaido atelier:
- Seam tension verified
- Botanical dye evenness certified
- Woven seal attached

The garment is now being boxed in cedar tissue for dispatch.
          `.trim(),
        });
        break;

      case 'SHIPPED':
        messages.push({
          channel: 'EMAIL',
          destination: payload.recipientEmail,
          subject: `OTARU — Your Garment Has Left the Atelier (${payload.trackingNumber})`,
          body: `
OTARU (小樽)
DISPATCH NOTICE

${payload.garmentTitle} has departed our stone warehouse in Otaru.
Carrier Tracking Reference: ${payload.trackingNumber}

Track transit: https://otaru.in/tracking?awb=${payload.trackingNumber}
          `.trim(),
        });
        break;

      case 'PROVENANCE_ISSUED':
        messages.push({
          channel: 'EMAIL',
          destination: payload.recipientEmail,
          subject: `OTARU — Digital Provenance Deed Issued (${payload.garmentSerial})`,
          body: `
OTARU (小樽)
DEED OF AUTHENTICITY

The digital provenance record for ${payload.garmentSerial} has been cryptographically signed and permanently sealed into the ledger.
View your physical-digital deed:

${payload.deedUrl || `https://otaru.in/verify/${payload.garmentSerial}`}
          `.trim(),
        });
        break;
    }

    return messages;
  }
}

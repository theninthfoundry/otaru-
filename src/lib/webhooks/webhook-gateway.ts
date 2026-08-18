/**
 * OTARU ARTIFACT OS — Webhook Ingestion Gateway
 * Coordinates signature validation, deduplication, forensic storage, and domain event dispatch.
 */

import { WebhookEventStore, ExternalWebhookEvent } from './event-store';
import { outboxPublisher } from '@/lib/queue/outbox-publisher';

export class WebhookGateway {
  /**
   * Processes an incoming webhook request with zero data loss guarantee.
   */
  public static async processInboundWebhook(params: {
    provider: ExternalWebhookEvent['provider'];
    providerEventId: string;
    eventType: string;
    signatureValid: boolean;
    payload: Record<string, unknown>;
  }): Promise<{ accepted: boolean; duplicate: boolean; eventId?: string; error?: string }> {
    if (!params.signatureValid && process.env.NODE_ENV === 'production') {
      return { accepted: false, duplicate: false, error: 'Cryptographic signature verification failed' };
    }

    const { isDuplicate, event } = await WebhookEventStore.recordWebhookEvent({
      provider: params.provider,
      providerEventId: params.providerEventId,
      eventType: params.eventType,
      signatureValid: params.signatureValid,
      rawPayload: params.payload,
    });

    if (isDuplicate) {
      return { accepted: true, duplicate: true, eventId: event.id };
    }

    try {
      // Dispatch domain event representation to transactional outbox
      if (params.provider === 'RAZORPAY' && params.eventType === 'payment.captured') {
        const paymentEntity = params.payload.payment as Record<string, unknown> | undefined;
        const notes = paymentEntity?.notes as Record<string, string> | undefined;

        await outboxPublisher.publish({
          eventId: event.id,
          eventType: 'PaymentCaptured',
          version: 1,
          occurredAt: event.receivedAt,
          aggregateType: 'Payment',
          aggregateId: (paymentEntity?.id as string) || params.providerEventId,
          payload: {
            orderId: notes?.orderId || 'UNKNOWN',
            amountMinor: Number(paymentEntity?.amount || 0),
            currency: String(paymentEntity?.currency || 'USD'),
            gatewayPaymentId: String(paymentEntity?.id || params.providerEventId),
          },
          metadata: { provider: params.provider },
        });
      }

      await WebhookEventStore.markProcessed(params.provider, params.providerEventId);
      return { accepted: true, duplicate: false, eventId: event.id };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      await WebhookEventStore.markFailed(params.provider, params.providerEventId, errorMsg);
      return { accepted: true, duplicate: false, eventId: event.id, error: errorMsg };
    }
  }
}

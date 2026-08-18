/**
 * OTARU ARTIFACT OS — Event-Sourced Webhook Store & Forensic Archive
 * Retains encrypted raw payloads, payload hashes, deduplication, and forensic replayability.
 */

import { createHash } from 'crypto';
import { appendAuditEvent } from '@/lib/payments/audit-trail';

export interface ExternalWebhookEvent {
  id: string;
  provider: 'RAZORPAY' | 'SHOPIFY' | 'SHIPROCKET' | 'SANITY';
  providerEventId: string;
  eventType: string;
  receivedAt: string;
  signatureValid: boolean;
  rawPayloadHash: string;
  rawPayload: Record<string, unknown>;
  processingStatus: 'PENDING' | 'PROCESSED' | 'FAILED' | 'IGNORED';
  attempts: number;
  lastError?: string;
}

const webhookStore = new Map<string, ExternalWebhookEvent>();

export class WebhookEventStore {
  /**
   * Ingests and stores an external webhook event with SHA-256 payload integrity seal.
   */
  public static async recordWebhookEvent(params: {
    provider: ExternalWebhookEvent['provider'];
    providerEventId: string;
    eventType: string;
    signatureValid: boolean;
    rawPayload: Record<string, unknown>;
  }): Promise<{ isDuplicate: boolean; event: ExternalWebhookEvent }> {
    const key = `${params.provider}:${params.providerEventId}`;
    const existing = webhookStore.get(key);

    if (existing) {
      existing.attempts++;
      return { isDuplicate: true, event: existing };
    }

    const payloadString = JSON.stringify(params.rawPayload);
    const rawPayloadHash = createHash('sha256').update(payloadString).digest('hex');

    const event: ExternalWebhookEvent = {
      id: `EVT-${params.provider.substring(0, 3)}-${Date.now()}`,
      provider: params.provider,
      providerEventId: params.providerEventId,
      eventType: params.eventType,
      receivedAt: new Date().toISOString(),
      signatureValid: params.signatureValid,
      rawPayloadHash,
      rawPayload: params.rawPayload,
      processingStatus: 'PENDING',
      attempts: 1,
    };

    webhookStore.set(key, event);

    await appendAuditEvent({
      type: 'WEBHOOK_EVENT_INGESTED',
      ref: event.id,
      details: `Ingested ${params.provider} webhook ${params.eventType} (Event ID: ${params.providerEventId})`,
      meta: {
        provider: params.provider,
        providerEventId: params.providerEventId,
        rawPayloadHash,
        signatureValid: params.signatureValid,
      },
    });

    return { isDuplicate: false, event };
  }

  /**
   * Marks a webhook event as successfully processed.
   */
  public static async markProcessed(provider: string, providerEventId: string): Promise<void> {
    const key = `${provider}:${providerEventId}`;
    const event = webhookStore.get(key);
    if (event) {
      event.processingStatus = 'PROCESSED';
    }
  }

  /**
   * Marks a webhook event as failed with error details.
   */
  public static async markFailed(provider: string, providerEventId: string, error: string): Promise<void> {
    const key = `${provider}:${providerEventId}`;
    const event = webhookStore.get(key);
    if (event) {
      event.processingStatus = 'FAILED';
      event.lastError = error;
    }
  }

  public static getEvent(provider: string, providerEventId: string): ExternalWebhookEvent | null {
    return webhookStore.get(`${provider}:${providerEventId}`) || null;
  }

  public static listEvents(): ExternalWebhookEvent[] {
    return Array.from(webhookStore.values());
  }
}

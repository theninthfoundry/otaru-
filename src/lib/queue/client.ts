import { DomainEvent } from './domain-events';

export interface QueueMessage {
  id: string;
  event: DomainEvent;
  attempts: number;
}

export type JobHandler = (event: DomainEvent) => Promise<void>;

class QueueClient {
  private handlers = new Map<string, JobHandler[]>();

  subscribe(eventType: string, handler: JobHandler) {
    const list = this.handlers.get(eventType) || [];
    list.push(handler);
    this.handlers.set(eventType, list);
  }

  async enqueue(event: DomainEvent): Promise<boolean> {
    const eventHandlers = this.handlers.get(event.eventType) || [];
    
    // Asynchronous dispatch off main HTTP thread
    setTimeout(async () => {
      for (const handler of eventHandlers) {
        try {
          await handler(event);
        } catch (err) {
          console.error(`[Queue Client] Error executing handler for ${event.eventType}:`, err);
        }
      }
    }, 0);

    return true;
  }
}

export const queueClient = new QueueClient();

/**
 * OTARU PROGRESSIVE VELOCITY SHIELD & ANTI-BOT GUARD
 * Throttles automated scalping scripts and checkout bots during limited drops
 * without imposing abrasive CAPTCHAs on human collectors.
 */

export interface ClientInteraction {
  clientId: string;           // IP or fingerprint
  timestamp: number;
  action: 'CART_ADD' | 'CHECKOUT_START' | 'PAYMENT_SUBMIT';
}

export interface VelocityAnalysis {
  isBotSuspected: boolean;
  reason?: 'INHUMAN_SPEED' | 'BURST_EXCEEDED' | 'REPETITIVE_ACTIONS';
  riskScore: number;          // 0 (Safe human) to 100 (Blatant bot script)
}

export const MIN_HUMAN_INTERACTION_MS = 300; // Interactions faster than 300ms are automated scripts
export const MAX_BURST_ACTIONS_PER_WINDOW = 5;
export const BURST_WINDOW_MS = 2000; // 2 seconds

export class AntiBotGuard {
  private history: Map<string, ClientInteraction[]> = new Map();

  /**
   * Analyzes an interaction in real-time and evaluates risk.
   */
  evaluateInteraction(
    clientId: string,
    action: ClientInteraction['action'],
    timestamp: number = Date.now()
  ): VelocityAnalysis {
    const records = this.history.get(clientId) || [];

    if (records.length > 0) {
      const last = records[records.length - 1]!;
      const timeDelta = timestamp - last.timestamp;

      // Check 1: Inhuman execution speed
      if (timeDelta < MIN_HUMAN_INTERACTION_MS) {
        return {
          isBotSuspected: true,
          reason: 'INHUMAN_SPEED',
          riskScore: 95,
        };
      }
    }

    // Check 2: Burst window frequency
    const recent = records.filter((r) => timestamp - r.timestamp < BURST_WINDOW_MS);
    if (recent.length >= MAX_BURST_ACTIONS_PER_WINDOW) {
      return {
        isBotSuspected: true,
        reason: 'BURST_EXCEEDED',
        riskScore: 85,
      };
    }

    // Log valid interaction
    records.push({ clientId, timestamp, action });
    this.history.set(clientId, records);

    return {
      isBotSuspected: false,
      riskScore: 5,
    };
  }
}

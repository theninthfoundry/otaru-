import { describe, it, expect } from 'vitest';
import {
  transitionDropState,
  isDropPurchasable,
  IllegalDropStateTransitionError,
  DropState,
} from '@/lib/domain/drops/drop-state-machine';
import { WaitingRoomManager, SignedAdmissionToken } from '@/lib/domain/drops/waiting-room';
import { AntiBotGuard } from '@/lib/domain/drops/anti-bot-guard';

describe('GATE F — DROP ENGINE, WAITING ROOM & BOT VELOCITY SHIELD', () => {

  // -------------------------------------------------------------------------
  // 1. Drop State Machine Transitions
  // -------------------------------------------------------------------------
  describe('F1: Drop Lifecycle State Machine', () => {
    it('progresses through canonical capsule lifecycle cleanly', () => {
      let state: DropState = 'DRAFT';

      state = transitionDropState(state, 'SCHEDULED');
      expect(state).toBe('SCHEDULED');

      state = transitionDropState(state, 'WAITING_ROOM');
      expect(state).toBe('WAITING_ROOM');

      state = transitionDropState(state, 'LIVE');
      expect(state).toBe('LIVE');
      expect(isDropPurchasable(state)).toBe(true);

      state = transitionDropState(state, 'SOLD_OUT');
      expect(state).toBe('SOLD_OUT');
      expect(isDropPurchasable(state)).toBe(false);

      state = transitionDropState(state, 'CLOSED');
      expect(state).toBe('CLOSED');

      state = transitionDropState(state, 'ARCHIVED');
      expect(state).toBe('ARCHIVED');
    });

    it('rejects illegal jumps in drop state', () => {
      // Cannot jump straight from DRAFT to LIVE or SOLD_OUT
      expect(() => transitionDropState('DRAFT', 'LIVE')).toThrow(IllegalDropStateTransitionError);
      expect(() => transitionDropState('DRAFT', 'SOLD_OUT')).toThrow(IllegalDropStateTransitionError);
    });

    it('only permits purchasing when drop is strictly LIVE', () => {
      const nonPurchasableStates: DropState[] = [
        'DRAFT',
        'PREVIEW',
        'SCHEDULED',
        'WAITING_ROOM',
        'SOLD_OUT',
        'CLOSED',
        'ARCHIVED',
      ];

      for (const s of nonPurchasableStates) {
        expect(isDropPurchasable(s)).toBe(false);
      }

      expect(isDropPurchasable('LIVE')).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // 2. Waiting Room & Token-Bucket Admission
  // -------------------------------------------------------------------------
  describe('F2: Edge Admission Waiting Room', () => {
    it('enqueues collectors and issues cryptographically signed admission tokens', () => {
      const manager = new WaitingRoomManager('test_secret_key');
      const dropId = 'drop_chapter_vii_rain_study';

      const user1 = manager.joinQueue('user_collector_1');
      const user2 = manager.joinQueue('user_collector_2');

      expect(user1.position).toBe(1);
      expect(user2.position).toBe(2);
      expect(manager.getQueueLength()).toBe(2);

      // Admit batch of 2
      const tokens = manager.admitBatch(dropId, 2);
      expect(tokens.length).toBe(2);
      expect(manager.getQueueLength()).toBe(0);

      const token1 = tokens[0]!;
      expect(token1.userId).toBe('user_collector_1');
      expect(manager.verifyToken(token1)).toBe(true);
    });

    it('rejects forged or tampered admission tokens', () => {
      const manager = new WaitingRoomManager('test_secret_key');
      const tokens = manager.admitBatch('drop_01', 1);

      // Fabricated token with altered userId
      const forgedToken: SignedAdmissionToken = {
        ...tokens[0]!,
        userId: 'user_attacker_impersonator',
      };

      expect(manager.verifyToken(forgedToken)).toBe(false);
    });

    it('rejects expired admission tokens', () => {
      const manager = new WaitingRoomManager('test_secret_key');
      const tokens = manager.admitBatch('drop_01', 1);

      const expiredToken: SignedAdmissionToken = {
        ...tokens[0]!,
        expiresAt: Date.now() - 1000, // Expired 1 second ago
      };

      expect(manager.verifyToken(expiredToken)).toBe(false);
    });
  });

  // -------------------------------------------------------------------------
  // 3. Progressive Velocity Shield & Anti-Bot Protection
  // -------------------------------------------------------------------------
  describe('F3: Anti-Bot Progressive Velocity Shield', () => {
    it('allows genuine human pacing and low risk scores', () => {
      const guard = new AntiBotGuard();
      const ip = '192.168.1.50';

      const t1 = 10000;
      const t2 = 12500; // 2.5 seconds later (human click)

      const first = guard.evaluateInteraction(ip, 'CART_ADD', t1);
      expect(first.isBotSuspected).toBe(false);

      const second = guard.evaluateInteraction(ip, 'CHECKOUT_START', t2);
      expect(second.isBotSuspected).toBe(false);
      expect(second.riskScore).toBeLessThan(20);
    });

    it('flags automated scripts executing at inhuman speed (<300ms)', () => {
      const guard = new AntiBotGuard();
      const ip = '10.0.0.99';

      const t1 = 10000;
      const t2 = 10050; // 50ms later (bot script)

      guard.evaluateInteraction(ip, 'CART_ADD', t1);
      const second = guard.evaluateInteraction(ip, 'CHECKOUT_START', t2);

      expect(second.isBotSuspected).toBe(true);
      expect(second.reason).toBe('INHUMAN_SPEED');
      expect(second.riskScore).toBe(95);
    });

    it('flags burst spamming exceeding window threshold', () => {
      const guard = new AntiBotGuard();
      const ip = '172.16.0.4';
      let time = 10000;

      // 5 fast interactions spaced at 350ms (technically >300ms each, but bursts within 2s)
      for (let i = 0; i < 5; i++) {
        time += 350;
        guard.evaluateInteraction(ip, 'CART_ADD', time);
      }

      // 6th interaction in the same 2-second burst window
      time += 350;
      const burstAnalysis = guard.evaluateInteraction(ip, 'CHECKOUT_START', time);

      expect(burstAnalysis.isBotSuspected).toBe(true);
      expect(burstAnalysis.reason).toBe('BURST_EXCEEDED');
      expect(burstAnalysis.riskScore).toBe(85);
    });
  });
});

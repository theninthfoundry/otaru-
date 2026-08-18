/**
 * OTARU ARTIFACT OS — Drop Lifecycle Orchestrator
 * Controls the formal lifecycle transitions, kill-switches, and sellout conditions for artifact drops.
 */

import { appendAuditEvent } from '@/lib/payments/audit-trail';

export type DropOrchestratorState =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'PREVIEW'
  | 'LIVE'
  | 'PAUSED'
  | 'SOLD_OUT'
  | 'CLOSING'
  | 'ARCHIVED';

export interface DropCampaign {
  dropId: string;
  title: string;
  skuHandles: string[];
  totalUnits: number;
  remainingUnits: number;
  state: DropOrchestratorState;
  publicReleaseDate: string;
  vanguardEarlyHours: number;
  patronEarlyHours: number;
  waitingRoomEnabled: boolean;
  killSwitchActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const dropsCampaignStore = new Map<string, DropCampaign>();

export class DropOrchestrator {
  /**
   * Initializes or creates a new drop campaign.
   */
  public static createCampaign(params: {
    dropId: string;
    title: string;
    skuHandles: string[];
    totalUnits: number;
    publicReleaseDate: string;
    vanguardEarlyHours?: number;
    patronEarlyHours?: number;
    waitingRoomEnabled?: boolean;
  }): DropCampaign {
    const campaign: DropCampaign = {
      dropId: params.dropId,
      title: params.title,
      skuHandles: params.skuHandles,
      totalUnits: params.totalUnits,
      remainingUnits: params.totalUnits,
      state: 'DRAFT',
      publicReleaseDate: params.publicReleaseDate,
      vanguardEarlyHours: params.vanguardEarlyHours ?? 24,
      patronEarlyHours: params.patronEarlyHours ?? 12,
      waitingRoomEnabled: params.waitingRoomEnabled ?? true,
      killSwitchActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dropsCampaignStore.set(params.dropId, campaign);
    return campaign;
  }

  /**
   * Transitions a drop campaign to a new lifecycle state.
   */
  public static async transitionState(
    dropId: string,
    targetState: DropOrchestratorState,
    adminActor: string,
    reason: string
  ): Promise<{ success: boolean; campaign?: DropCampaign; error?: string }> {
    const campaign = dropsCampaignStore.get(dropId);
    if (!campaign) return { success: false, error: `Drop campaign ${dropId} not found` };

    const fromState = campaign.state;
    campaign.state = targetState;
    campaign.updatedAt = new Date().toISOString();

    if (targetState === 'SOLD_OUT') {
      campaign.remainingUnits = 0;
    }

    await appendAuditEvent({
      type: 'DROP_ORCHESTRATOR_TRANSITION',
      ref: dropId,
      details: `Drop ${dropId} transitioned from ${fromState} to ${targetState}. Reason: ${reason} (By: ${adminActor})`,
      meta: { dropId, fromState, targetState, adminActor, reason },
    });

    return { success: true, campaign };
  }

  /**
   * Emergency Kill-Switch to instantly halt all sales and checkout for a drop.
   */
  public static async triggerEmergencyKillSwitch(
    dropId: string,
    adminActor: string,
    reason: string
  ): Promise<{ success: boolean; campaign?: DropCampaign }> {
    const campaign = dropsCampaignStore.get(dropId);
    if (!campaign) return { success: false };

    campaign.killSwitchActive = true;
    campaign.state = 'PAUSED';
    campaign.updatedAt = new Date().toISOString();

    await appendAuditEvent({
      type: 'EMERGENCY_KILL_SWITCH_ENGAGED',
      ref: dropId,
      details: `EMERGENCY KILL SWITCH ACTIVATED for drop ${dropId} by ${adminActor}. Reason: ${reason}`,
      meta: { dropId, adminActor, reason },
    });

    return { success: true, campaign };
  }

  public static getCampaign(dropId: string): DropCampaign | null {
    return dropsCampaignStore.get(dropId) || null;
  }
}

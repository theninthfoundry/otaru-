/**
 * OTARU ARTIFACT OS — Dual-Control (Four-Eyes Principle) Approval Workflow
 * Requires 2 distinct authorized administrators to request and approve high-impact destructive actions.
 */

import { appendAuditEvent } from '@/lib/payments/audit-trail';
import { randomUUID } from 'crypto';

export type HighImpactOperationType =
  | 'LARGE_REFUND'
  | 'INVENTORY_OVERRIDE'
  | 'DROP_KILL_SWITCH'
  | 'CERTIFICATE_REVOCATION'
  | 'LEDGER_CORRECTION';

export interface ApprovalRequest {
  requestId: string;
  operationType: HighImpactOperationType;
  requestedByAdmin: string;
  approvedByAdmin?: string;
  reason: string;
  payload: Record<string, unknown>;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  requestedAt: string;
  approvedAt?: string;
}

const approvalRequests = new Map<string, ApprovalRequest>();

export class DualControlWorkflow {
  /**
   * Submits a high-impact operation request requiring a second admin's sign-off.
   */
  public static async requestApproval(params: {
    operationType: HighImpactOperationType;
    requestedByAdmin: string;
    reason: string;
    payload: Record<string, unknown>;
  }): Promise<ApprovalRequest> {
    const requestId = `REQ-${params.operationType.substring(0, 4)}-${randomUUID().substring(0, 8).toUpperCase()}`;

    const request: ApprovalRequest = {
      requestId,
      operationType: params.operationType,
      requestedByAdmin: params.requestedByAdmin,
      reason: params.reason,
      payload: params.payload,
      status: 'PENDING_APPROVAL',
      requestedAt: new Date().toISOString(),
    };

    approvalRequests.set(requestId, request);

    await appendAuditEvent({
      type: 'DUAL_CONTROL_REQUESTED',
      ref: requestId,
      details: `Admin ${params.requestedByAdmin} initiated four-eyes request ${requestId} for ${params.operationType}`,
      meta: { ...params, requestId },
    });

    return request;
  }

  /**
   * Approves a dual-control request. The approving admin MUST be distinct from the requesting admin.
   */
  public static async approveRequest(
    requestId: string,
    approvingAdmin: string
  ): Promise<{ success: boolean; request?: ApprovalRequest; error?: string }> {
    const request = approvalRequests.get(requestId);
    if (!request) {
      return { success: false, error: 'Approval request not found.' };
    }

    if (request.status !== 'PENDING_APPROVAL') {
      return { success: false, error: `Request is already ${request.status}.` };
    }

    // Invariant: Four-Eyes Principle (Requestor cannot approve their own high-impact request)
    if (request.requestedByAdmin.toLowerCase() === approvingAdmin.toLowerCase()) {
      const errorMsg = `Four-Eyes Invariant Violation: Admin ${approvingAdmin} cannot approve their own high-impact request.`;

      await appendAuditEvent({
        type: 'DUAL_CONTROL_SELF_APPROVAL_BLOCKED',
        ref: requestId,
        details: errorMsg,
        meta: { requestId, admin: approvingAdmin },
      });

      return { success: false, error: errorMsg };
    }

    request.status = 'APPROVED';
    request.approvedByAdmin = approvingAdmin;
    request.approvedAt = new Date().toISOString();

    await appendAuditEvent({
      type: 'DUAL_CONTROL_APPROVED',
      ref: requestId,
      details: `Request ${requestId} (${request.operationType}) approved by ${approvingAdmin} (Requested by: ${request.requestedByAdmin})`,
      meta: { requestId, approvingAdmin, requestedBy: request.requestedByAdmin },
    });

    return { success: true, request };
  }

  public static getRequest(requestId: string): ApprovalRequest | null {
    return approvalRequests.get(requestId) || null;
  }
}

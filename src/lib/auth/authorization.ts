/**
 * OTARU AUTHORIZATION GUARDS
 * Enforces declarative permission checks and elevated action verifications.
 */

import { UserRole, Permission, hasPermission } from './permissions';
import { UserSessionData } from './session';

export class AuthenticationError extends Error {
  constructor(message = 'Authentication required. Please present an active session.') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ForbiddenError extends Error {
  constructor(public requiredPermission: Permission, public userRole: UserRole) {
    super(`Access denied. Role '${userRole}' lacks permission '${requiredPermission}'.`);
    this.name = 'ForbiddenError';
  }
}

export class ElevatedActionError extends Error {
  constructor(public actionName: string, message = 'Elevated owner authorization required.') {
    super(`Elevated Action Denied [${actionName}]: ${message}`);
    this.name = 'ElevatedActionError';
  }
}

/**
 * Asserts that a session exists and is valid.
 */
export function assertAuthenticated(session: UserSessionData | null): asserts session is UserSessionData {
  if (!session) {
    throw new AuthenticationError();
  }
}

/**
 * Asserts that the authenticated user possesses the required permission.
 */
export function assertPermission(session: UserSessionData, permission: Permission): void {
  if (!hasPermission(session.role, permission)) {
    throw new ForbiddenError(permission, session.role);
  }
}

/**
 * Asserts elevated privileges for high-risk financial or destructive actions.
 * High-risk actions (Refunds, Role modifications, Ledger access) strictly require OWNER role.
 */
export function assertElevatedAction(session: UserSessionData, actionName: string): void {
  if (session.role !== 'OWNER') {
    throw new ElevatedActionError(
      actionName,
      `Action '${actionName}' requires dual-control or OWNER authorization. Current role: ${session.role}`
    );
  }
}

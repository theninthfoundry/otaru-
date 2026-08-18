/**
 * OTARU ARTIFACT OS — Role-Based Access Control (RBAC)
 * Defines granular role hierarchies and permission matrices across administrative domains.
 */

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'FINANCE'
  | 'FULFILLMENT'
  | 'EDITOR'
  | 'SUPPORT'
  | 'SECURITY'
  | 'READ_ONLY';

export type Permission =
  | 'orders:read'
  | 'orders:write'
  | 'payments:read'
  | 'payments:refund'
  | 'inventory:read'
  | 'inventory:write'
  | 'drops:manage'
  | 'drops:kill_switch'
  | 'provenance:certify'
  | 'provenance:revoke'
  | 'security:audit'
  | 'security:admin_manage';

export const ROLE_PERMISSIONS: Record<AdminRole, readonly Permission[]> = {
  SUPER_ADMIN: [
    'orders:read',
    'orders:write',
    'payments:read',
    'payments:refund',
    'inventory:read',
    'inventory:write',
    'drops:manage',
    'drops:kill_switch',
    'provenance:certify',
    'provenance:revoke',
    'security:audit',
    'security:admin_manage',
  ],
  FINANCE: ['orders:read', 'payments:read', 'payments:refund', 'security:audit'],
  FULFILLMENT: ['orders:read', 'orders:write', 'inventory:read', 'inventory:write'],
  EDITOR: ['inventory:read', 'drops:manage'],
  SUPPORT: ['orders:read', 'inventory:read', 'payments:read'],
  SECURITY: ['security:audit', 'security:admin_manage', 'drops:kill_switch', 'provenance:revoke'],
  READ_ONLY: ['orders:read', 'inventory:read', 'payments:read', 'security:audit'],
};

export class RBACEngine {
  /**
   * Evaluates if a given role has the required permission.
   */
  public static hasPermission(role: AdminRole, permission: Permission): boolean {
    const perms = ROLE_PERMISSIONS[role];
    return perms ? perms.includes(permission) : false;
  }

  /**
   * Enforces that an actor has the required permission or throws an authorization error.
   */
  public static assertPermission(role: AdminRole, permission: Permission, actorId: string): void {
    if (!this.hasPermission(role, permission)) {
      throw new Error(`Access Denied: Actor ${actorId} with role ${role} lacks permission '${permission}'`);
    }
  }
}

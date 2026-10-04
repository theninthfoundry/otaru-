/**
 * OTARU CENTRALIZED AUTHORIZATION & PERMISSIONS MATRIX
 * Replaces ad-hoc role checks with fine-grained, declarative permissions.
 */

export type UserRole = 'CUSTOMER' | 'MAKER' | 'EDITOR' | 'ADMIN' | 'OWNER';

export type Permission =
  // Customer permissions
  | 'account.read'
  | 'account.update'
  | 'orders.read_own'
  | 'cart.manage'
  | 'returns.request'
  | 'provenance.read'

  // Maker (Atelier craftsperson) permissions
  | 'workqueue.read'
  | 'qc.inspect'
  | 'garment.package'
  | 'production.update'

  // Editor permissions
  | 'products.create'
  | 'products.edit'
  | 'collections.publish'
  | 'journal.write'
  | 'chapters.edit'

  // Admin permissions
  | 'orders.read_all'
  | 'orders.manage'
  | 'inventory.read'
  | 'inventory.manage'
  | 'shipments.read'
  | 'shipments.manage'
  | 'returns.approve'
  | 'provenance.issue'
  | 'drops.manage'
  | 'users.read'

  // Owner (High-privilege financial & security) permissions
  | 'refunds.create'
  | 'ledger.read'
  | 'users.manage_roles'
  | 'audit.read'
  | 'settings.manage';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: [
    'account.read',
    'account.update',
    'orders.read_own',
    'cart.manage',
    'returns.request',
    'provenance.read',
  ],
  MAKER: [
    'account.read',
    'workqueue.read',
    'qc.inspect',
    'garment.package',
    'production.update',
    'provenance.read',
  ],
  EDITOR: [
    'account.read',
    'products.create',
    'products.edit',
    'collections.publish',
    'journal.write',
    'chapters.edit',
    'provenance.read',
  ],
  ADMIN: [
    'account.read',
    'orders.read_all',
    'orders.manage',
    'inventory.read',
    'inventory.manage',
    'shipments.read',
    'shipments.manage',
    'returns.approve',
    'provenance.issue',
    'drops.manage',
    'users.read',
    'workqueue.read',
    'qc.inspect',
  ],
  OWNER: [
    // Owner inherits all permissions
    'account.read',
    'account.update',
    'orders.read_own',
    'cart.manage',
    'returns.request',
    'provenance.read',
    'workqueue.read',
    'qc.inspect',
    'garment.package',
    'production.update',
    'products.create',
    'products.edit',
    'collections.publish',
    'journal.write',
    'chapters.edit',
    'orders.read_all',
    'orders.manage',
    'inventory.read',
    'inventory.manage',
    'shipments.read',
    'shipments.manage',
    'returns.approve',
    'provenance.issue',
    'drops.manage',
    'users.read',
    'refunds.create',
    'ledger.read',
    'users.manage_roles',
    'audit.read',
    'settings.manage',
  ],
};

/**
 * Checks if a user role holds a specific permission.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS[role] || [];
  return allowed.includes(permission);
}

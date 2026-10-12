/**
 * HOUSE OF OTARU — ENTERPRISE PERMISSIONS & ACCESS CONTROL ENGINE
 * System Design Concept: Role-Based & Attribute-Based Access Control (RBAC / ABAC)
 * 
 * Implements an "allowall" default policy for public patrons:
 * - Public guests have unrestricted permission across archive discovery, cart modifications,
 *   wishlist curations, tax ledger calculations, and checkout sessions.
 * - Granular stepped permissions guard administrative and private studio actions.
 */

export type PatronRole = 'PUBLIC_GUEST' | 'PATRON' | 'CURATOR' | 'ATELIER_DIRECTOR' | 'SYSTEM';

export type PermissionAction =
  | 'archive:view'
  | 'archive:search'
  | 'cart:create'
  | 'cart:update'
  | 'cart:checkout'
  | 'wishlist:manage'
  | 'wishlist:share'
  | 'coupon:apply'
  | 'tax:calculate'
  | 'provenance:view'
  | 'patron:early_drop'
  | 'admin:fulfill_order'
  | 'admin:audit_ledger'
  | 'admin:manage_stock';

// Full Permission Matrix
const ROLE_PERMISSIONS: Record<PatronRole, Set<PermissionAction>> = {
  PUBLIC_GUEST: new Set([
    'archive:view',
    'archive:search',
    'cart:create',
    'cart:update',
    'cart:checkout',
    'wishlist:manage',
    'wishlist:share',
    'coupon:apply',
    'tax:calculate',
    'provenance:view',
  ]),
  PATRON: new Set([
    'archive:view',
    'archive:search',
    'cart:create',
    'cart:update',
    'cart:checkout',
    'wishlist:manage',
    'wishlist:share',
    'coupon:apply',
    'tax:calculate',
    'provenance:view',
    'patron:early_drop',
  ]),
  CURATOR: new Set([
    'archive:view',
    'archive:search',
    'cart:create',
    'cart:update',
    'cart:checkout',
    'wishlist:manage',
    'wishlist:share',
    'coupon:apply',
    'tax:calculate',
    'provenance:view',
    'patron:early_drop',
    'admin:audit_ledger',
  ]),
  ATELIER_DIRECTOR: new Set([
    'archive:view',
    'archive:search',
    'cart:create',
    'cart:update',
    'cart:checkout',
    'wishlist:manage',
    'wishlist:share',
    'coupon:apply',
    'tax:calculate',
    'provenance:view',
    'patron:early_drop',
    'admin:fulfill_order',
    'admin:audit_ledger',
    'admin:manage_stock',
  ]),
  SYSTEM: new Set([
    'archive:view',
    'archive:search',
    'cart:create',
    'cart:update',
    'cart:checkout',
    'wishlist:manage',
    'wishlist:share',
    'coupon:apply',
    'tax:calculate',
    'provenance:view',
    'patron:early_drop',
    'admin:fulfill_order',
    'admin:audit_ledger',
    'admin:manage_stock',
  ]),
};

// Route Access Rules (Allow-All Policy for Public Maison Navigation)
const PUBLIC_ALLOWED_ROUTE_PREFIXES = [
  '/',
  '/archive',
  '/artifact',
  '/bag',
  '/cart',
  '/checkout',
  '/chapter',
  '/chapters',
  '/drop',
  '/drops',
  '/journal',
  '/story',
  '/studio',
  '/membership',
  '/account',
  '/profile',
  '/sign-in',
  '/verify',
  '/wishlist',
  '/track-order',
  '/size-guide',
  '/shipping-exchanges',
  '/returns',
  '/privacy',
  '/terms',
  '/api/cart',
  '/api/checkout',
  '/api/shipping',
  '/api/webhooks',
];

export class PermissionsEngine {
  /**
   * Checks whether a role has an explicit permission.
   */
  hasPermission(role: PatronRole, action: PermissionAction): boolean {
    const permissions = ROLE_PERMISSIONS[role];
    return Boolean(permissions && permissions.has(action));
  }

  /**
   * Validates whether a pathname is accessible under the Allow-All public policy.
   */
  isRoutePubliclyAccessible(pathname: string): boolean {
    // Admin routes require elevated permissions
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      return false;
    }

    return PUBLIC_ALLOWED_ROUTE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
  }

  /**
   * Authorizes a request based on route and optional patron authorization headers.
   */
  authorizeRequest(
    pathname: string,
    role: PatronRole = 'PUBLIC_GUEST'
  ): { isAllowed: boolean; reason?: string } {
    // 1. Check if public route
    if (this.isRoutePubliclyAccessible(pathname)) {
      return { isAllowed: true };
    }

    // 2. Check admin boundary
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
      if (role === 'ATELIER_DIRECTOR' || role === 'SYSTEM') {
        return { isAllowed: true };
      }
      return {
        isAllowed: false,
        reason: 'Restricted administrative territory. Requires ATELIER_DIRECTOR credentials.',
      };
    }

    // Default Allow-All
    return { isAllowed: true };
  }
}

export const permissionsEngine = new PermissionsEngine();

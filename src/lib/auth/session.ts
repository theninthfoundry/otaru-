/**
 * OTARU SERVER-CONTROLLED SESSION ENGINE
 * Issues cryptographically random opaque tokens.
 * Only SHA-256 hashes are persisted at rest.
 * Cookie attributes: HttpOnly, Secure, SameSite=Lax, Path=/
 */

import crypto from 'crypto';

export interface UserSessionData {
  id: string;
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'MAKER' | 'EDITOR' | 'ADMIN' | 'OWNER';
  tokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: number;
  expiresAt: number;
  lastActiveAt: number;
  isRevoked: boolean;
}

export const SESSION_COOKIE_NAME = 'otaru_session';
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export class SessionManager {
  private sessions: Map<string, UserSessionData> = new Map();

  /**
   * Generates a 32-byte cryptographically secure random session token.
   */
  static generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hashes the session token for storage.
   */
  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Creates a new user session.
   */
  createSession(
    userId: string,
    email: string,
    role: UserSessionData['role'],
    metadata?: { ipAddress?: string; userAgent?: string }
  ): { token: string; session: UserSessionData } {
    const token = SessionManager.generateToken();
    const tokenHash = SessionManager.hashToken(token);
    const now = Date.now();

    const session: UserSessionData = {
      id: `sess_${crypto.randomUUID()}`,
      userId,
      email,
      role,
      tokenHash,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      createdAt: now,
      expiresAt: now + SESSION_DURATION_MS,
      lastActiveAt: now,
      isRevoked: false,
    };

    this.sessions.set(tokenHash, session);
    return { token, session };
  }

  /**
   * Validates a session token. Returns null if expired or revoked.
   */
  validateSession(token: string): UserSessionData | null {
    if (!token || typeof token !== 'string') return null;

    const tokenHash = SessionManager.hashToken(token);
    const session = this.sessions.get(tokenHash);

    if (!session) return null;
    if (session.isRevoked) return null;
    if (Date.now() > session.expiresAt) return null;

    // Slide activity window
    session.lastActiveAt = Date.now();
    return session;
  }

  /**
   * Revokes a specific session.
   */
  revokeSession(token: string): boolean {
    const tokenHash = SessionManager.hashToken(token);
    const session = this.sessions.get(tokenHash);
    if (!session) return false;

    session.isRevoked = true;
    return true;
  }

  /**
   * Revokes all active sessions for a user (Sign out all devices).
   */
  revokeAllUserSessions(userId: string): number {
    let revokedCount = 0;
    for (const session of this.sessions.values()) {
      if (session.userId === userId && !session.isRevoked) {
        session.isRevoked = true;
        revokedCount++;
      }
    }
    return revokedCount;
  }

  /**
   * Returns list of active sessions for security center view.
   */
  getUserActiveSessions(userId: string): UserSessionData[] {
    const now = Date.now();
    return Array.from(this.sessions.values()).filter(
      (s) => s.userId === userId && !s.isRevoked && s.expiresAt > now
    );
  }
}

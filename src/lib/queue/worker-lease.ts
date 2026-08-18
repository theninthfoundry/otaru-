/**
 * OTARU ARTIFACT OS — Distributed Worker Leasing & Concurrency Manager
 * Manages atomic worker task claims, TTL heartbeat renewal, and automatic lease recovery on worker failure.
 */

export interface WorkerLease {
  taskId: string;
  workerId: string;
  acquiredAt: string;
  leaseExpiresAt: string;
  heartbeatCount: number;
}

const activeLeases = new Map<string, WorkerLease>();

export class WorkerLeaseManager {
  /**
   * Attempts to acquire an exclusive processing lease on a task for a given worker.
   */
  public static acquireLease(
    taskId: string,
    workerId: string,
    ttlSeconds = 30
  ): { acquired: boolean; lease?: WorkerLease; error?: string } {
    const now = new Date();
    const existing = activeLeases.get(taskId);

    // If an active unexpired lease exists on this task by another worker, reject
    if (existing && new Date(existing.leaseExpiresAt) > now) {
      if (existing.workerId !== workerId) {
        return {
          acquired: false,
          error: `Task ${taskId} is currently leased by worker ${existing.workerId} until ${existing.leaseExpiresAt}`,
        };
      }
    }

    const leaseExpiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();
    const lease: WorkerLease = {
      taskId,
      workerId,
      acquiredAt: now.toISOString(),
      leaseExpiresAt,
      heartbeatCount: 0,
    };

    activeLeases.set(taskId, lease);
    return { acquired: true, lease };
  }

  /**
   * Renews a worker's lease heartbeat to prevent lock expiration during long operations.
   */
  public static heartbeat(taskId: string, workerId: string, extensionSeconds = 30): boolean {
    const lease = activeLeases.get(taskId);
    if (!lease || lease.workerId !== workerId) return false;

    lease.heartbeatCount++;
    lease.leaseExpiresAt = new Date(Date.now() + extensionSeconds * 1000).toISOString();
    return true;
  }

  /**
   * Releases a task lease upon completion.
   */
  public static releaseLease(taskId: string, workerId: string): boolean {
    const lease = activeLeases.get(taskId);
    if (!lease || lease.workerId !== workerId) return false;

    activeLeases.delete(taskId);
    return true;
  }

  /**
   * Scans and reclaims abandoned/expired leases.
   */
  public static reclaimExpiredLeases(): number {
    const now = new Date();
    let reclaimed = 0;

    for (const [taskId, lease] of activeLeases.entries()) {
      if (new Date(lease.leaseExpiresAt) <= now) {
        activeLeases.delete(taskId);
        reclaimed++;
      }
    }

    return reclaimed;
  }

  public static getActiveLease(taskId: string): WorkerLease | null {
    return activeLeases.get(taskId) || null;
  }
}

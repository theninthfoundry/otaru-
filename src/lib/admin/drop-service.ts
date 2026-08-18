/**
 * OTARU — Admin Domain: Drop Release Scheduling & Stock Allocation Service
 */

import { appendAuditEvent } from '@/lib/payments/audit-trail';

export interface ScheduledDrop {
  id: string;
  title: string;
  slug: string;
  chapterSlug: string;
  publicReleaseDate: string;
  vanguardEarlyHours: number;
  patronEarlyHours: number;
  totalAllocationUnits: number;
  remainingUnits: number;
  status: 'SCHEDULED' | 'LIVE' | 'PAUSED' | 'CONCLUDED';
  skuHandles: string[];
}

const scheduledDrops: ScheduledDrop[] = [
  {
    id: 'DROP-001',
    title: 'Chapter 01 Genesis: 14.5oz Heavy Twill',
    slug: 'chapter-01-heavy-twill',
    chapterSlug: 'chapter-01',
    publicReleaseDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    vanguardEarlyHours: 24,
    patronEarlyHours: 12,
    totalAllocationUnits: 150,
    remainingUnits: 150,
    status: 'SCHEDULED',
    skuHandles: ['raw-selvage-jacket', 'heavy-gauge-pant', 'box-tee-chalk'],
  },
];

/**
 * Lists all scheduled drop campaigns.
 */
export function listScheduledDrops(): ScheduledDrop[] {
  return [...scheduledDrops];
}

/**
 * Creates or schedules a new drop campaign.
 */
export async function scheduleNewDrop(
  data: Omit<ScheduledDrop, 'id' | 'remainingUnits' | 'status'>
): Promise<ScheduledDrop> {
  const newDrop: ScheduledDrop = {
    ...data,
    id: `DROP-${String(scheduledDrops.length + 1).padStart(3, '0')}`,
    remainingUnits: data.totalAllocationUnits,
    status: 'SCHEDULED',
  };

  scheduledDrops.push(newDrop);

  await appendAuditEvent({
    type: 'ADMIN_DROP_SCHEDULED',
    ref: newDrop.id,
    details: `Drop ${newDrop.title} scheduled for ${newDrop.publicReleaseDate} with ${newDrop.totalAllocationUnits} units.`,
    meta: { dropId: newDrop.id, releaseDate: newDrop.publicReleaseDate },
  });

  return newDrop;
}

/**
 * Updates the live status of a drop (e.g. Pause, Conclude, Trigger Live).
 */
export async function updateDropStatus(
  dropId: string,
  newStatus: ScheduledDrop['status']
): Promise<ScheduledDrop | null> {
  const drop = scheduledDrops.find((d) => d.id === dropId);
  if (!drop) return null;

  drop.status = newStatus;

  await appendAuditEvent({
    type: 'ADMIN_DROP_STATUS_UPDATED',
    ref: dropId,
    details: `Drop ${dropId} status transitioned to ${newStatus}`,
    meta: { dropId, newStatus },
  });

  return drop;
}

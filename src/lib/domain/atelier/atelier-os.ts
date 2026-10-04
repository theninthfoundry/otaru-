/**
 * OTARU ATELIER OS (ATELIER OPERATING SYSTEM)
 * The quiet internal command center for the Otaru craftspeople and fulfillment team.
 * Manages physical preparation, tactile inspection, deed generation, and carrier dispatch.
 */

export interface AtelierDropStatus {
  chapterTitle: string; // "Chapter VII — Rain Study"
  acquiredCount: number;
  remainingCount: number;
  totalAllocation: number;
  percentAllocated: number;
}

export interface AtelierDailyQueue {
  date: string;
  totalOrders: number;
  toPrepareCount: number;
  awaitingInspectionCount: number;
  readyToShipCount: number;
  activeReturnsCount: number;
}

export interface AtelierWorkQueueItem {
  orderNumber: string;        // "OTR-2026-000184"
  garmentSerial: string;      // "OTR-2026-000184"
  productName: string;        // "Rain Study"
  size: string;               // "IV"
  currentStage: 'PREPARATION' | 'INSPECTION' | 'PACKAGING' | 'DISPATCH_READY';
  createdAt: string;
}

export interface AtelierDashboardOverview {
  dailyQueue: AtelierDailyQueue;
  currentDrop: AtelierDropStatus;
  workQueue: AtelierWorkQueueItem[];
}

/**
 * Computes live Atelier OS metrics.
 */
export function generateAtelierOverview(
  dailyOrders: Array<{ status: string; orderNumber: string; garmentSerial: string; productName: string; size: string; createdAt: string }>,
  dropAllocation: { total: number; acquired: number; title: string }
): AtelierDashboardOverview {
  const toPrepare = dailyOrders.filter((o) => o.status === 'CONFIRMED' || o.status === 'IN_PREPARATION');
  const awaitingInspection = dailyOrders.filter((o) => o.status === 'IN_PREPARATION');
  const readyToShip = dailyOrders.filter((o) => o.status === 'PACKED');
  const activeReturns = dailyOrders.filter((o) => o.status === 'REFUND_PENDING');

  const workQueue: AtelierWorkQueueItem[] = dailyOrders.slice(0, 10).map((o) => {
    let stage: AtelierWorkQueueItem['currentStage'] = 'PREPARATION';
    if (o.status === 'QUALITY_INSPECTED') stage = 'PACKAGING';
    else if (o.status === 'PACKED') stage = 'DISPATCH_READY';
    else if (o.status === 'IN_PREPARATION') stage = 'INSPECTION';

    return {
      orderNumber: o.orderNumber,
      garmentSerial: o.garmentSerial,
      productName: o.productName,
      size: o.size,
      currentStage: stage,
      createdAt: o.createdAt,
    };
  });

  return {
    dailyQueue: {
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }),
      totalOrders: dailyOrders.length,
      toPrepareCount: toPrepare.length,
      awaitingInspectionCount: awaitingInspection.length,
      readyToShipCount: readyToShip.length,
      activeReturnsCount: activeReturns.length,
    },
    currentDrop: {
      chapterTitle: dropAllocation.title,
      acquiredCount: dropAllocation.acquired,
      remainingCount: Math.max(0, dropAllocation.total - dropAllocation.acquired),
      totalAllocation: dropAllocation.total,
      percentAllocated: Math.round((dropAllocation.acquired / (dropAllocation.total || 1)) * 100),
    },
    workQueue,
  };
}

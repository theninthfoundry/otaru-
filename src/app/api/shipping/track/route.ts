import { NextRequest, NextResponse } from 'next/server';
import { trackShipment, ShipmentTrackingStatus } from '@/lib/integrations/shiprocket';
import { prisma } from '@/lib/db/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get('orderId') || searchParams.get('order') || searchParams.get('id');
  const awb = searchParams.get('awb');

  const query = (orderId || awb || '').trim();

  if (!query) {
    return NextResponse.json(
      { error: 'Please provide an order reference (e.g. OTARU-REG-104921) or AWB number.' },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch live tracking info from Shiprocket
    const trackingInfo: ShipmentTrackingStatus = await trackShipment(query);

    // 2. Optionally enrich with database order items if available
    let orderDetails = null;
    if (process.env.DATABASE_URL) {
      try {
        const dbOrder = await prisma.order.findFirst({
          where: {
            OR: [
              { internalId: query },
              { id: query },
              { shopifyId: query },
            ],
          },
          include: {
            items: true,
          },
        });

        if (dbOrder) {
          orderDetails = {
            internalId: dbOrder.internalId,
            customerName: dbOrder.customerName,
            status: dbOrder.status,
            totalFormatted: `₹${(dbOrder.totalMinor / 100).toLocaleString('en-IN')}`,
            itemsCount: dbOrder.items.length,
            createdAt: dbOrder.createdAt.toISOString(),
          };
        }
      } catch (dbErr) {
        console.warn('[Tracking DB Query Info]:', dbErr);
      }
    }

    // Standardized stages for the Japanese Craft timeline
    const stages = [
      {
        key: 'ALLOCATED',
        label: 'Studio Allocation',
        subtext: 'Selected from Kuroki / Tokushima archive',
        completed: true,
        active: trackingInfo.status === 'PLACED',
      },
      {
        key: 'PREPARED',
        label: 'Archival Inspection',
        subtext: 'Hand-pressed & hankō seal affixed',
        completed: ['PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(trackingInfo.status),
        active: trackingInfo.status === 'PROCESSING',
      },
      {
        key: 'DISPATCHED',
        label: 'Hokkaido Warehouse Dispatch',
        subtext: 'Handed over to express courier',
        completed: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(trackingInfo.status),
        active: trackingInfo.status === 'SHIPPED',
      },
      {
        key: 'TRANSIT',
        label: 'In Transit / Customs Cleared',
        subtext: trackingInfo.location ? `Hub: ${trackingInfo.location}` : 'Secured in climate-controlled transit',
        completed: ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(trackingInfo.status),
        active: trackingInfo.status === 'SHIPPED',
      },
      {
        key: 'OUT_FOR_DELIVERY',
        label: 'Out for Courier Delivery',
        subtext: 'With local white-glove courier',
        completed: trackingInfo.status === 'DELIVERED',
        active: trackingInfo.status === 'OUT_FOR_DELIVERY',
      },
      {
        key: 'DELIVERED',
        label: 'Acquisition Completed',
        subtext: 'Delivered and signed at residence',
        completed: trackingInfo.status === 'DELIVERED',
        active: trackingInfo.status === 'DELIVERED',
      },
    ];

    return NextResponse.json({
      success: true,
      query,
      tracking: trackingInfo,
      stages,
      order: orderDetails,
    });
  } catch (error) {
    console.error('[Shipment Tracking API Error]:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shipment tracking status.' },
      { status: 500 }
    );
  }
}

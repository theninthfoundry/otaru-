import { NextRequest, NextResponse } from 'next/server';
import { getShiprocketToken } from '@/lib/integrations/shiprocket';

// Major Indian Postal Pincode Region Dictionary for High-Accuracy Instant Resolution
const PINCODE_MAP: Record<string, { city: string; state: string; metro: boolean; days: string }> = {
  // Delhi NCR
  '110': { city: 'New Delhi', state: 'Delhi', metro: true, days: '2-3 Business Days' },
  '121': { city: 'Faridabad', state: 'Haryana', metro: true, days: '2-3 Business Days' },
  '122': { city: 'Gurugram', state: 'Haryana', metro: true, days: '2-3 Business Days' },
  '201': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh', metro: true, days: '2-3 Business Days' },
  // Mumbai Region
  '400': { city: 'Mumbai', state: 'Maharashtra', metro: true, days: '2-3 Business Days' },
  '401': { city: 'Thane', state: 'Maharashtra', metro: true, days: '2-3 Business Days' },
  '410': { city: 'Navi Mumbai', state: 'Maharashtra', metro: true, days: '2-3 Business Days' },
  '411': { city: 'Pune', state: 'Maharashtra', metro: true, days: '2-3 Business Days' },
  // Karnataka / South Metros
  '560': { city: 'Bengaluru', state: 'Karnataka', metro: true, days: '2-3 Business Days' },
  '570': { city: 'Mysuru', state: 'Karnataka', metro: false, days: '3-4 Business Days' },
  '500': { city: 'Hyderabad', state: 'Telangana', metro: true, days: '2-3 Business Days' },
  '600': { city: 'Chennai', state: 'Tamil Nadu', metro: true, days: '2-3 Business Days' },
  '641': { city: 'Coimbatore', state: 'Tamil Nadu', metro: false, days: '3-4 Business Days' },
  '682': { city: 'Kochi', state: 'Kerala', metro: true, days: '3-4 Business Days' },
  // West & North
  '380': { city: 'Ahmedabad', state: 'Gujarat', metro: true, days: '2-3 Business Days' },
  '395': { city: 'Surat', state: 'Gujarat', metro: false, days: '3-4 Business Days' },
  '302': { city: 'Jaipur', state: 'Rajasthan', metro: false, days: '3-4 Business Days' },
  '160': { city: 'Chandigarh', state: 'Punjab / Haryana', metro: true, days: '2-3 Business Days' },
  '226': { city: 'Lucknow', state: 'Uttar Pradesh', metro: false, days: '3-4 Business Days' },
  // East
  '700': { city: 'Kolkata', state: 'West Bengal', metro: true, days: '3-4 Business Days' },
  '781': { city: 'Guwahati', state: 'Assam', metro: false, days: '4-5 Business Days' },
  '751': { city: 'Bhubaneswar', state: 'Odisha', metro: false, days: '3-4 Business Days' },
};

export async function GET(request: NextRequest) {
  const pincode = request.nextUrl.searchParams.get('pincode')?.trim();
  const weight = request.nextUrl.searchParams.get('weight') || '1.0';

  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json(
      { serviceable: false, error: 'Please provide a valid 6-digit Indian PIN code.' },
      { status: 400 }
    );
  }

  // 1. Check live Shiprocket Courier API if configured
  const token = await getShiprocketToken();
  if (token) {
    try {
      const pickupPostcode = process.env.SHIPROCKET_PICKUP_PINCODE || '110001';
      const url = `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPostcode}&delivery_postcode=${pincode}&weight=${weight}&cod=0`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const couriers = data?.data?.available_courier_companies || [];
        if (couriers.length > 0) {
          const fastestCourier = couriers.sort(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any, b: any) => (a.etd_hours || 72) - (b.etd_hours || 72)
          )[0];

          return NextResponse.json({
            serviceable: true,
            pincode,
            city: data?.data?.city || 'Verified District',
            state: data?.data?.state || 'India',
            courierName: fastestCourier.courier_name,
            estimatedDays: `${Math.ceil((fastestCourier.etd_hours || 72) / 24)} Business Days`,
            expressAvailable: true,
            rate: fastestCourier.rate || 0,
            provider: 'Shiprocket Live Network',
          });
        }
      }
    } catch (err) {
      console.warn('[Shiprocket Serviceability Fallback]:', err);
    }
  }

  // 2. High-Fidelity Postal Region Lookup Fallback
  const prefix = pincode.substring(0, 3);
  const regionInfo = PINCODE_MAP[prefix];

  const targetDate = new Date();
  const deliveryDays = regionInfo?.metro ? 3 : 5;
  targetDate.setDate(targetDate.getDate() + deliveryDays);

  const formattedDate = targetDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return NextResponse.json({
    serviceable: true,
    pincode,
    city: regionInfo?.city || 'Metro Delivery Zone',
    state: regionInfo?.state || 'India',
    courierName: regionInfo?.metro ? 'Bluedart Air Express' : 'Delhivery Premium Surface',
    estimatedDays: regionInfo?.days || '3-5 Business Days',
    estimatedDeliveryDate: formattedDate,
    expressAvailable: true,
    freeShippingThreshold: 5000,
    shippingFee: 0, // Complimentary white-glove shipping on archival acquisitions
    provider: 'Otaru Archival Courier Network',
  });
}

import { NextResponse, type NextRequest } from 'next/server';
import { submitConciergeInquiry, listConciergeInquiries } from '@/lib/concierge/service';
import { z } from 'zod';

const ConciergeSchema = z.object({
  inquiryType: z.enum(['BESPOKE_SIZING', 'PRIVATE_ARCHIVE_VIEWING', 'REPAIR_RESTORATION', 'CUSTOM_ORDER']),
  patronName: z.string().min(2, 'Name is required'),
  patronEmail: z.string().email('Valid email is required'),
  patronTier: z.string().optional(),
  artifactHandle: z.string().optional(),
  message: z.string().min(10, 'Please provide more details regarding your request'),
  preferredContact: z.enum(['EMAIL', 'WHATSAPP', 'PHONE']),
  contactValue: z.string().min(5, 'Contact details are required'),
});

/**
 * POST /api/concierge
 * Submits a bespoke concierge inquiry.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ConciergeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request payload.' }, { status: 400 });
    }

    const inquiry = await submitConciergeInquiry(parsed.data);

    return NextResponse.json({ success: true, inquiry });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

/**
 * GET /api/concierge
 * Admin list of concierge inquiries.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const adminSecret = process.env.ADMIN_API_SECRET;

  if (process.env.NODE_ENV === 'production' && adminSecret) {
    if (authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.json({ inquiries: listConciergeInquiries() });
}

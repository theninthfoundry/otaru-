import { NextResponse, type NextRequest } from 'next/server';
import { createOwnershipTransfer, claimOwnershipTransfer, getTransferDetails } from '@/lib/provenance/transfer';
import { z } from 'zod';

const InitiateSchema = z.object({
  serialNumber: z.string().regex(/^OTARU-\d{3}-\d{3}$/, 'Invalid serial number format'),
  ownerEmail: z.string().email('Invalid email address'),
  validHours: z.number().min(1).max(168).optional(),
});

const ClaimSchema = z.object({
  transferToken: z.string().min(10, 'Invalid transfer token'),
  newOwnerEmail: z.string().email('Invalid recipient email address'),
});

/**
 * POST /api/verify/transfer
 * Initiates or claims a physical-digital garment certificate ownership transfer.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = request.nextUrl.searchParams.get('action') || 'initiate';

    if (action === 'claim') {
      const parsed = ClaimSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid claim payload' }, { status: 400 });
      }

      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        '127.0.0.1';

      const result = await claimOwnershipTransfer(
        parsed.data.transferToken,
        parsed.data.newOwnerEmail,
        ip
      );

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }

      return NextResponse.json({ success: true, transfer: result.record });
    }

    // Default: Initiate transfer
    const parsed = InitiateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid initiate payload' }, { status: 400 });
    }

    const transfer = await createOwnershipTransfer(
      parsed.data.serialNumber,
      parsed.data.ownerEmail,
      parsed.data.validHours || 48
    );

    return NextResponse.json({ success: true, transfer });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

/**
 * GET /api/verify/transfer?token=...
 * Inspects a transfer invitation token.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ error: 'Token parameter is required.' }, { status: 400 });
  }

  const details = getTransferDetails(token);
  if (!details) {
    return NextResponse.json({ error: 'Transfer token not found.' }, { status: 404 });
  }

  return NextResponse.json({ transfer: details });
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyGarmentProvenance } from '@/lib/provenance/verification';
import { prisma } from '@/lib/db/prisma';
import { auditLog } from '@/lib/payments/audit-trail';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const serial = searchParams.get('serial') || searchParams.get('tag') || searchParams.get('code');
  const nfcUid = searchParams.get('nfcUid') || undefined;

  if (!serial || !serial.trim()) {
    return NextResponse.json(
      { error: 'Please provide a garment serial number or tag code (e.g. OTARU-041-014).' },
      { status: 400 }
    );
  }

  const certificate = verifyGarmentProvenance(serial, nfcUid);

  if (!certificate) {
    return NextResponse.json(
      { error: 'Invalid or counterfeit serial code. Verification failed.' },
      { status: 404 }
    );
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

  // Record NFC/Serial scan event in database if available
  if (process.env.DATABASE_URL) {
    try {
      await prisma.nfcScan.create({
        data: {
          serialNumber: certificate.serialNumber,
          ip,
        },
      });
    } catch (dbErr) {
      console.warn('[NFC Scan DB Log Warning]:', dbErr);
    }
  }

  // Dual audit log
  auditLog({
    type: 'NONCE_CONSUMED',
    ref: certificate.serialNumber,
    ip,
    details: `Garment provenance verified for serial ${certificate.serialNumber} (${certificate.title}). Cert: ${certificate.authenticityHash}`,
    meta: {
      serial: certificate.serialNumber,
      objectNumber: certificate.objectNumber,
      edition: certificate.editionPiece,
      nfcUid,
    },
  });

  return NextResponse.json({
    success: true,
    certificate,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serialNumber, nfcTagUid } = body;

    if (!serialNumber || !serialNumber.trim()) {
      return NextResponse.json(
        { error: 'Serial number is required.' },
        { status: 400 }
      );
    }

    const certificate = verifyGarmentProvenance(serialNumber, nfcTagUid);

    if (!certificate) {
      return NextResponse.json(
        { error: 'Serial verification failed.' },
        { status: 404 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    if (process.env.DATABASE_URL) {
      try {
        await prisma.nfcScan.create({
          data: {
            serialNumber: certificate.serialNumber,
            ip,
          },
        });
      } catch (dbErr) {
        console.warn('[NFC Scan DB Log Warning]:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      certificate,
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }
}

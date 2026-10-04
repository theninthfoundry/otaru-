import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, igHandle, city, interests, referredBy, honeypot } = body;

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Received' });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Rate limiting could be done here (omitted for brevity, assume middleware handles IP level, but we could do email level)
    
    // Check if email already exists
    let resident = await prisma.resident.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (resident) {
      // Idempotent success if already registered
      return NextResponse.json({ 
        success: true, 
        isDuplicate: true,
        resident: { number: resident.number, referralCode: resident.referralCode } 
      });
    }

    // Generate unique referral code
    const referralCode = crypto.randomBytes(4).toString('hex');

    // Create new resident
    resident = await prisma.resident.create({
      data: {
        email: email.toLowerCase().trim(),
        igHandle: igHandle?.trim() || null,
        city: city?.trim() || null,
        interest: interests ? interests.join(',') : null,
        referralCode,
        referredBy: referredBy?.trim() || null
      }
    });

    // TODO: Send confirmation email via Resend if configured
    
    return NextResponse.json({ 
      success: true,
      isDuplicate: false,
      resident: { number: resident.number, referralCode: resident.referralCode }
    });

  } catch (error) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}

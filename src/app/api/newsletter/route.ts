import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/actions/newsletter';

export async function POST(request: Request) {
  try {
    const { email, consent } = (await request.json()) as { email?: string; consent?: boolean };

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 },
      );
    }

    const result = await subscribeToNewsletter(email, consent === true);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

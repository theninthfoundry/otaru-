import { NextResponse } from 'next/server';
import { joinWaitlist } from '@/actions/waitlist';

export async function POST(request: Request) {
  try {
    const { email, chapterSlug } = await request.json();

    if (!email || !chapterSlug) {
      return NextResponse.json(
        { error: 'Email and chapter slug are required' },
        { status: 400 },
      );
    }

    const result = await joinWaitlist(email, chapterSlug);

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

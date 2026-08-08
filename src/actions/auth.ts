'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE = 'otaru-patron-session';

export interface PatronSession {
  email: string;
  memberId: string;
}

export async function loginPatron(prevState: { error?: string } | null, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }

  if (!password || password.length < 6) {
    return { error: 'Patron security codes must be at least 6 characters.' };
  }

  const cleanEmail = email.toLowerCase().trim();
  const randomIdNum = Math.floor(Math.random() * 90000) + 10000;
  const memberId = `OTR-MEM-${randomIdNum}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, JSON.stringify({ email: cleanEmail, memberId }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect('/account');
}

export async function logoutPatron() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect('/account/login');
}

export async function getPatronSession(): Promise<PatronSession | null> {
  const cookieStore = await cookies();
  const sessionVal = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (!sessionVal) return null;

  try {
    return JSON.parse(sessionVal) as PatronSession;
  } catch {
    return null;
  }
}

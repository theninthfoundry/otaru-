'use client';

import React, { useState } from 'react';
import { isValidEmail } from '@/lib/utils';

interface WaitlistFormProps {
  chapterSlug: string;
  chapterTitle: string;
}

export function WaitlistForm({ chapterSlug, chapterTitle }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isValidEmail(email)) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, chapterSlug }),
      });

      if (!response.ok) throw new Error('Failed');

      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-body-sm text-otaru-success" role="status">
        You are on the list for {chapterTitle}.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} id="waitlist-form">
      <label htmlFor="waitlist-email" className="visually-hidden">
        Email for {chapterTitle} waitlist
      </label>
      <div className="flex gap-2">
        <input
          id="waitlist-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="text-body-sm flex-1 border-b border-otaru-border bg-transparent py-2 outline-none focus:border-otaru-ink"
          required
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          className="text-body-sm font-medium py-2"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? '...' : 'Join Waitlist'}
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-1 text-caption text-otaru-error" role="alert">
          Something went wrong.
        </p>
      )}
    </form>
  );
}

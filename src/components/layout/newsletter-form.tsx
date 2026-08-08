'use client';

import React, { useState } from 'react';
import { isValidEmail } from '@/lib/utils';
import { subscribeToNewsletter } from '@/actions/newsletter';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email.');
      return;
    }

    setStatus('loading');

    try {
      const result = await subscribeToNewsletter(email);

      if (!result.success) {
        throw new Error(result.error || 'Subscription failed');
      }

      setStatus('success');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setErrorMessage((error as Error).message || 'Something went wrong. Try again.');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-body-sm text-otaru-success" role="status">
        Subscribed. You will hear from us soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} id="newsletter-form" className="mt-3">
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="visually-hidden">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
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
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </div>
      {status === 'error' && (
        <p className="mt-1 text-caption text-otaru-error" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}

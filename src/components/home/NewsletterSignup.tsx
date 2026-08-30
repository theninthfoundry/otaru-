'use client';

import React, { useState } from 'react';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
    }
  };

  return (
    <section className="block on-ink newsletter" id="newsletter" aria-labelledby="newsletter-heading">
      <div className="wrap">
        <RevealOnScroll className="text-center" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ justifyContent: 'center' }}>
            Stay near the archive
          </span>
          <h2
            className="section-title"
            id="newsletter-heading"
            style={{ margin: '0.6em auto 0', textAlign: 'center' }}
          >
            One email, before each chapter opens.
          </h2>

          {!isSubmitted ? (
            <form
              className="newsletter-form"
              onSubmit={handleSubmit}
              style={{
                margin: '2.2rem auto 0',
                display: 'flex',
                maxWidth: '420px',
                borderBottom: '1px solid var(--otaru-line-strong)',
              }}
            >
              <label htmlFor="nl-email" style={{ position: 'absolute', left: '-9999px' }}>
                Email address
              </label>
              <input
                id="nl-email"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  padding: '0.8rem 0.2rem',
                  color: 'var(--otaru-parchment)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--otaru-gold)',
                  padding: '0.8rem 0.3rem',
                }}
              >
                Notify me
              </button>
            </form>
          ) : (
            <p style={{ marginTop: '2.2rem', color: 'var(--otaru-gold)', fontSize: '0.9rem' }}>
              Thank you. You will be notified before the next chapter opens.
            </p>
          )}

          <p style={{ marginTop: '1rem', fontSize: '0.72rem', color: 'var(--otaru-horizon)' }}>
            No noise. Four emails a year, at most.
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}

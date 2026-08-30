'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password.length >= 8;

    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);

    if (isEmailValid && isPasswordValid) {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 1200);
    }
  };

  return (
    <div
      className="auth-view"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem 1.5rem 4rem',
        background: 'radial-gradient(circle at 50% 0%, #172b40, var(--otaru-ink) 60%)',
      }}
    >
      <div className="auth-card" style={{ width: '100%', maxWidth: '400px' }}>
        {!isSuccess ? (
          <form onSubmit={handleSubmit} noValidate>
            <span className="eyebrow">Archive access</span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', marginTop: '0.6em', color: 'var(--otaru-parchment)' }}>
              Welcome back.
            </h1>
            <p style={{ marginTop: '0.6rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.92rem' }}>
              Sign in to see saved artifacts, past acquisitions, and your membership tier.
            </p>

            <div className={clsx('field', emailError && 'has-error')} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="si-email" style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                Email
              </label>
              <input
                id="si-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(false);
                }}
                required
                style={{
                  background: 'transparent',
                  border: emailError ? '1px solid var(--otaru-torii)' : '1px solid var(--otaru-line-strong)',
                  padding: '0.75rem 0.85rem',
                  color: 'var(--otaru-parchment)',
                  outline: 'none',
                }}
              />
              {emailError && (
                <span style={{ fontSize: '0.74rem', color: '#e0a08a' }}>
                  Enter a valid email address.
                </span>
              )}
            </div>

            <div className={clsx('field', passwordError && 'has-error')} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="si-pass" style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)' }}>
                Password
              </label>
              <input
                id="si-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(false);
                }}
                required
                style={{
                  background: 'transparent',
                  border: passwordError ? '1px solid var(--otaru-torii)' : '1px solid var(--otaru-line-strong)',
                  padding: '0.75rem 0.85rem',
                  color: 'var(--otaru-parchment)',
                  outline: 'none',
                }}
              />
              {passwordError && (
                <span style={{ fontSize: '0.74rem', color: '#e0a08a' }}>
                  Password must be at least 8 characters.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                marginTop: '1.7rem',
                width: '100%',
                backgroundColor: 'var(--otaru-parchment)',
                color: 'var(--otaru-ink)',
                padding: '0.9rem',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Continue
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                margin: '1.6rem 0',
                color: 'var(--otaru-horizon)',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--otaru-line)' }} />
              <span>or</span>
              <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--otaru-line)' }} />
            </div>

            <Link
              href="/"
              style={{
                display: 'block',
                width: '100%',
                border: '1px solid var(--otaru-line-strong)',
                padding: '0.85rem',
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--otaru-parchment)',
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Continue as guest
            </Link>

            <p style={{ marginTop: '1.6rem', textAlign: 'center', fontSize: '0.86rem', color: 'var(--otaru-parchment-dim)' }}>
              <a href="#" style={{ color: 'var(--otaru-gold-dim)' }}>Forgot your password?</a>
            </p>
            <p style={{ marginTop: '0.6rem', textAlign: 'center', fontSize: '0.86rem', color: 'var(--otaru-parchment-dim)' }}>
              New to the archive? <a href="#" style={{ color: 'var(--otaru-gold-dim)' }}>Create an account</a>
            </p>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              Signed in
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--otaru-parchment)', marginTop: '0.6em' }}>
              Good to see you again.
            </h1>
            <p style={{ marginTop: '0.6rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.92rem' }}>
              Taking you to your profile…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

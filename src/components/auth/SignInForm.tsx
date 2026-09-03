'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type AuthMode = 'otp' | 'password';

export function SignInForm() {
  const [authMode, setAuthMode] = useState<AuthMode>('otp');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [maskedDestination, setMaskedDestination] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: emailOrPhone.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to dispatch verification code.');
      } else {
        setOtpSent(true);
        setMaskedDestination(data.destination || emailOrPhone);
        if (data.devOtp) setDevOtpHint(data.devOtp);
      }
    } catch {
      setError('Network communication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: emailOrPhone.trim(),
          otp: otp.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid verification code.');
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/profile');
        }, 1000);
      }
    } catch {
      setError('Verification service unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = /\S+@\S+\.\S+/.test(emailOrPhone);
    const isPasswordValid = password.length >= 8;

    if (!isEmailValid || !isPasswordValid) {
      setError('Please provide a valid email and 8+ character password.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/profile');
    }, 1000);
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
      <div className="auth-card" style={{ width: '100%', maxWidth: '420px', padding: '2.4rem', border: '1px solid var(--otaru-line)', backgroundColor: 'var(--otaru-dusk)' }}>
        {!isSuccess ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="eyebrow" style={{ margin: 0 }}>Archive Access</span>
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                [ SECURE SESSION ]
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginTop: '0.6em', color: 'var(--otaru-parchment)' }}>
              Welcome back.
            </h1>
            <p style={{ marginTop: '0.4rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.88rem' }}>
              Access your garment portfolio, provenance certificates, and dispatch tracking.
            </p>

            {/* Mode Toggle */}
            <div style={{ marginTop: '1.4rem', display: 'flex', gap: '0.5rem', background: 'var(--otaru-black)', padding: '0.3rem', border: '1px solid var(--otaru-line)' }}>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('otp');
                  setError(null);
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: 'none',
                  backgroundColor: authMode === 'otp' ? 'var(--otaru-gold)' : 'transparent',
                  color: authMode === 'otp' ? 'var(--otaru-black)' : 'var(--otaru-parchment-dim)',
                  fontWeight: authMode === 'otp' ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                }}
              >
                ✦ One-Time Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('password');
                  setError(null);
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: 'none',
                  backgroundColor: authMode === 'password' ? 'var(--otaru-gold)' : 'transparent',
                  color: authMode === 'password' ? 'var(--otaru-black)' : 'var(--otaru-parchment-dim)',
                  fontWeight: authMode === 'password' ? 600 : 400,
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                }}
              >
                Password
              </button>
            </div>

            {/* OTP Flow */}
            {authMode === 'otp' ? (
              !otpSent ? (
                <form onSubmit={handleSendOtp} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label htmlFor="auth-identifier" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-gold)', display: 'block', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
                      Email or Mobile Number
                    </label>
                    <input
                      id="auth-identifier"
                      type="text"
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      placeholder="e.g. collector@otaru.in or +919876543210"
                      style={{
                        width: '100%',
                        background: 'var(--otaru-black)',
                        border: '1px solid var(--otaru-line-strong)',
                        padding: '0.8rem',
                        color: 'var(--otaru-parchment)',
                        outline: 'none',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{ padding: '0.6rem 0.8rem', backgroundColor: 'rgba(181, 73, 50, 0.12)', border: '1px solid #b54932', color: '#f4efe2', fontSize: '0.78rem' }}>
                      ⚠ {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                    style={{
                      padding: '0.85rem',
                      opacity: isLoading ? 0.7 : 1,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isLoading ? 'Dispatching Code...' : 'Send Verification Code →'}
                  </button>
                </form>
              ) : (
                /* Enter OTP */
                <form onSubmit={handleVerifyOtp} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ padding: '0.8rem', backgroundColor: 'rgba(217, 189, 131, 0.08)', border: '1px solid var(--otaru-gold-dim)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--otaru-gold)', display: 'block', fontFamily: 'monospace' }}>
                      Code sent to {maskedDestination}
                    </span>
                    {devOtpHint && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--otaru-parchment-dim)', display: 'block', marginTop: '0.2rem', fontFamily: 'monospace' }}>
                        Test Code: <strong style={{ color: 'var(--otaru-gold)' }}>{devOtpHint}</strong>
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="auth-otp-input" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-gold)', display: 'block', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
                      6-Digit Security Code
                    </label>
                    <input
                      id="auth-otp-input"
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="• • • • • •"
                      style={{
                        width: '100%',
                        background: 'var(--otaru-black)',
                        border: '1px solid var(--otaru-gold)',
                        padding: '0.85rem',
                        color: 'var(--otaru-gold)',
                        fontSize: '1.3rem',
                        textAlign: 'center',
                        letterSpacing: '0.4em',
                        fontFamily: 'monospace',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{ padding: '0.6rem 0.8rem', backgroundColor: 'rgba(181, 73, 50, 0.12)', border: '1px solid #b54932', color: '#f4efe2', fontSize: '0.78rem' }}>
                      ⚠ {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                    style={{
                      padding: '0.85rem',
                      opacity: isLoading ? 0.7 : 1,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isLoading ? 'Verifying...' : 'Access Archive Vault →'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--otaru-parchment-dim)', fontSize: '0.76rem', cursor: 'pointer' }}
                  >
                    ← Use a different email/number
                  </button>
                </form>
              )
            ) : (
              /* Password Flow */
              <form onSubmit={handlePasswordSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label htmlFor="pwd-email" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-gold)', display: 'block', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
                    Email
                  </label>
                  <input
                    id="pwd-email"
                    type="email"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="name@domain.com"
                    style={{
                      width: '100%',
                      background: 'var(--otaru-black)',
                      border: '1px solid var(--otaru-line-strong)',
                      padding: '0.8rem',
                      color: 'var(--otaru-parchment)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="pwd-pass" style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-gold)', display: 'block', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
                    Password
                  </label>
                  <input
                    id="pwd-pass"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--otaru-black)',
                      border: '1px solid var(--otaru-line-strong)',
                      padding: '0.8rem',
                      color: 'var(--otaru-parchment)',
                      outline: 'none',
                    }}
                  />
                </div>

                {error && (
                  <div style={{ padding: '0.6rem 0.8rem', backgroundColor: 'rgba(181, 73, 50, 0.12)', border: '1px solid #b54932', color: '#f4efe2', fontSize: '0.78rem' }}>
                    ⚠ {error}
                  </div>
                )}

                <button type="submit" className="btn-primary" style={{ padding: '0.85rem' }}>
                  Sign In →
                </button>
              </form>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link href="/" className="cta-link" style={{ fontSize: '0.78rem' }}>
                Continue exploring without signing in →
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>
              ✓ Authenticated
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--otaru-parchment)', marginTop: '0.6em' }}>
              Welcome back to Otaru.
            </h2>
            <p style={{ marginTop: '0.6rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.88rem' }}>
              Opening your private collector portfolio…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

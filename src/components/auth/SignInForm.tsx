'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, AuthChannel } from '@/context/auth-context';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', label: 'India (+91)' },
  { code: '+1', country: 'US', label: 'US/CA (+1)' },
  { code: '+44', country: 'GB', label: 'UK (+44)' },
  { code: '+81', country: 'JP', label: 'Japan (+81)' },
  { code: '+61', country: 'AU', label: 'Australia (+61)' },
  { code: '+971', country: 'AE', label: 'UAE (+971)' },
  { code: '+65', country: 'SG', label: 'Singapore (+65)' },
  { code: '+49', country: 'DE', label: 'Germany (+49)' },
  { code: '+33', country: 'FR', label: 'France (+33)' },
];

export function SignInForm() {
  const router = useRouter();
  const { sendOtp, verifyOtp, loginWithPassword } = useAuth();

  const [activeTab, setActiveTab] = useState<'sms' | 'whatsapp' | 'email' | 'password'>('sms');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP Stage
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [maskedDestination, setMaskedDestination] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    const isMobile = activeTab === 'sms' || activeTab === 'whatsapp';
    const destination = isMobile ? phoneNumber.trim() : email.trim();

    if (!destination) {
      setError(isMobile ? 'Please enter your mobile phone number.' : 'Please enter your email address.');
      setIsLoading(false);
      return;
    }

    const channel: AuthChannel = activeTab === 'whatsapp' ? 'whatsapp' : activeTab === 'sms' ? 'sms' : 'email';

    const result = await sendOtp(destination, channel, countryCode);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to dispatch verification code.');
    } else {
      setIsOtpSent(true);
      setMaskedDestination(result.destination || destination);
      if (result.devOtp) setDevOtp(result.devOtp);
      setResendCooldown(60);
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  };

  const handleVerifySubmission = async (otpCode: string) => {
    setError(null);
    setIsLoading(true);

    const isMobile = activeTab === 'sms' || activeTab === 'whatsapp';
    const destination = isMobile ? phoneNumber.trim() : email.trim();

    const result = await verifyOtp(destination, otpCode, countryCode);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Invalid verification code. Please check and try again.');
      setOtpDigits(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 900);
    }
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const filledCode = newDigits.join('');
      if (filledCode.length === 6) {
        handleVerifySubmission(filledCode);
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    if (index < 5 && cleaned) {
      otpInputsRef.current[index + 1]?.focus();
    }

    const completeCode = newDigits.join('');
    if (completeCode.length === 6) {
      handleVerifySubmission(completeCode);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleAutoFillDevOtp = () => {
    if (!devOtp) return;
    const digits = devOtp.slice(0, 6).split('');
    setOtpDigits(digits);
    handleVerifySubmission(devOtp);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const res = await loginWithPassword(email, password);
    setIsLoading(false);
    if (!res.success) {
      setError(res.error || 'Invalid email or password credentials.');
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 900);
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
      <div
        className="auth-card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.8rem 2.4rem',
          border: '1px solid var(--otaru-line)',
          backgroundColor: 'var(--otaru-dusk)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.65), 0 0 40px rgba(226, 194, 133, 0.06)',
          borderRadius: '2px',
        }}
      >
        {!isSuccess ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--otaru-gold)',
                  fontSize: '0.74rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                Archive Access
              </span>
              <span style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--otaru-gold-dim)', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                [ SECURE SESSION ]
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', marginTop: '0.4em', color: 'var(--otaru-parchment)', lineHeight: 1.15 }}>
              {isOtpSent ? 'Verify Access Code' : 'Welcome back.'}
            </h1>
            <p style={{ marginTop: '0.5rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              {isOtpSent
                ? `Enter the 6-digit verification code sent to ${maskedDestination}.`
                : 'Access your garment portfolio, provenance certificates, and live allocations.'}
            </p>

            {/* Mode Switcher */}
            {!isOtpSent && (
              <div
                style={{
                  marginTop: '1.6rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.35rem',
                  background: 'var(--otaru-ink)',
                  padding: '0.3rem',
                  border: '1px solid var(--otaru-line)',
                }}
              >
                {[
                  { id: 'sms', label: 'SMS OTP' },
                  { id: 'whatsapp', label: 'WhatsApp' },
                  { id: 'email', label: 'Email Code' },
                  { id: 'password', label: 'Password' },
                ].map((tab) => {
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setError(null);
                      }}
                      style={{
                        padding: '0.55rem 0.2rem',
                        fontSize: '0.68rem',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        textAlign: 'center',
                        border: 'none',
                        borderRadius: '2px',
                        backgroundColor: isSelected ? 'var(--otaru-gold)' : 'transparent',
                        color: isSelected ? 'var(--otaru-ink)' : 'var(--otaru-parchment-dim)',
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div
                style={{
                  marginTop: '1.2rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(181, 73, 50, 0.15)',
                  border: '1px solid rgba(181, 73, 50, 0.4)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  borderRadius: '2px',
                }}
              >
                ⚠ {error}
              </div>
            )}

            {/* Dev Mode OTP Banner */}
            {devOtp && isOtpSent && (
              <div
                onClick={handleAutoFillDevOtp}
                style={{
                  marginTop: '1.2rem',
                  padding: '0.65rem 0.9rem',
                  backgroundColor: 'rgba(226, 194, 133, 0.12)',
                  border: '1px dashed var(--otaru-gold-dim)',
                  color: 'var(--otaru-gold)',
                  fontSize: '0.74rem',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                title="Click to automatically fill & verify"
              >
                <span>
                  <strong>[Dev Mode]</strong> Code: <code>{devOtp}</code>
                </span>
                <span style={{ textDecoration: 'underline', fontSize: '0.68rem' }}>Auto-Fill →</span>
              </div>
            )}

            {/* STAGE 1: REQUEST CODE */}
            {!isOtpSent && activeTab !== 'password' && (
              <form onSubmit={handleSendCode} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {activeTab === 'sms' || activeTab === 'whatsapp' ? (
                  <div>
                    <label
                      style={{
                        fontSize: '0.7rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--otaru-gold)',
                        display: 'block',
                        marginBottom: '0.4rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      {activeTab === 'whatsapp' ? 'WhatsApp Mobile Number' : 'Mobile Phone Number'}
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        style={{
                          width: '95px',
                          padding: '0.8rem 0.5rem',
                          backgroundColor: 'var(--otaru-ink)',
                          border: '1px solid var(--otaru-line-strong)',
                          color: 'var(--otaru-parchment)',
                          borderRadius: '2px',
                          fontSize: '0.86rem',
                          outline: 'none',
                        }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code} style={{ backgroundColor: '#0e1724' }}>
                            {c.code} ({c.country})
                          </option>
                        ))}
                      </select>

                      <input
                        type="tel"
                        required
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        autoFocus
                        style={{
                          flex: 1,
                          padding: '0.8rem 1rem',
                          backgroundColor: 'var(--otaru-ink)',
                          border: '1px solid var(--otaru-line-strong)',
                          color: 'var(--otaru-parchment)',
                          borderRadius: '2px',
                          fontSize: '0.94rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      style={{
                        fontSize: '0.7rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--otaru-gold)',
                        display: 'block',
                        marginBottom: '0.4rem',
                        fontFamily: 'monospace',
                      }}
                    >
                      Member Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="collector@archive.otaru.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        backgroundColor: 'var(--otaru-ink)',
                        border: '1px solid var(--otaru-line-strong)',
                        color: 'var(--otaru-parchment)',
                        borderRadius: '2px',
                        fontSize: '0.94rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0.95rem',
                    backgroundColor: 'var(--otaru-gold)',
                    color: 'var(--otaru-ink)',
                    border: 'none',
                    borderRadius: '2px',
                    fontSize: '0.78rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: isLoading ? 'wait' : 'pointer',
                  }}
                >
                  {isLoading
                    ? 'Dispatching Code...'
                    : activeTab === 'whatsapp'
                    ? 'Send WhatsApp Code →'
                    : activeTab === 'sms'
                    ? 'Send SMS Code →'
                    : 'Send Verification Code →'}
                </button>
              </form>
            )}

            {/* STAGE 2: PASSWORD LOGIN */}
            {!isOtpSent && activeTab === 'password' && (
              <form onSubmit={handlePasswordLogin} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-gold)', display: 'block', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="collector@archive.otaru.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    style={{
                      width: '100%',
                      background: 'var(--otaru-ink)',
                      border: '1px solid var(--otaru-line-strong)',
                      padding: '0.8rem',
                      color: 'var(--otaru-parchment)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--otaru-gold)', display: 'block', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'var(--otaru-ink)',
                      border: '1px solid var(--otaru-line-strong)',
                      padding: '0.8rem',
                      color: 'var(--otaru-parchment)',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    padding: '0.95rem',
                    backgroundColor: 'var(--otaru-gold)',
                    color: 'var(--otaru-ink)',
                    border: 'none',
                    borderRadius: '2px',
                    fontSize: '0.78rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: isLoading ? 'wait' : 'pointer',
                  }}
                >
                  {isLoading ? 'Verifying Credentials...' : 'Sign In With Password →'}
                </button>
              </form>
            )}

            {/* STAGE 3: 6-DIGIT OTP ENTRY */}
            {isOtpSent && (
              <div style={{ marginTop: '1.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '1.8rem' }}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      style={{
                        width: '52px',
                        height: '56px',
                        fontSize: '1.5rem',
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        textAlign: 'center',
                        backgroundColor: 'var(--otaru-ink)',
                        border: digit ? '1px solid var(--otaru-gold)' : '1px solid var(--otaru-line-strong)',
                        color: 'var(--otaru-parchment)',
                        borderRadius: '2px',
                        outline: 'none',
                      }}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  disabled={isLoading || otpDigits.join('').length < 6}
                  onClick={() => handleVerifySubmission(otpDigits.join(''))}
                  style={{
                    width: '100%',
                    padding: '0.95rem',
                    backgroundColor: otpDigits.join('').length === 6 ? 'var(--otaru-gold)' : 'rgba(226, 194, 133, 0.3)',
                    color: 'var(--otaru-ink)',
                    border: 'none',
                    borderRadius: '2px',
                    fontSize: '0.78rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    cursor: otpDigits.join('').length === 6 && !isLoading ? 'pointer' : 'not-allowed',
                  }}
                >
                  {isLoading ? 'Verifying Cipher...' : 'Verify Code & Enter Archive →'}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', fontSize: '0.76rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false);
                      setError(null);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--otaru-parchment-dim)',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    ← Change Number/Email
                  </button>

                  {resendCooldown > 0 ? (
                    <span style={{ color: 'var(--otaru-gold-dim)', fontFamily: 'monospace' }}>
                      Resend in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSendCode()}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--otaru-gold)',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Resend Code ↻
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* SUCCESS STATE */
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem', color: 'var(--otaru-gold)' }}>
              ✦
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--otaru-parchment)', margin: 0 }}>
              Session Verified.
            </h2>
            <p style={{ marginTop: '0.6rem', color: 'var(--otaru-parchment-dim)', fontSize: '0.88rem' }}>
              Welcome back to the living image archive. Entering atelier...
            </p>
          </div>
        )}

        {/* Footer Navigation */}
        <div style={{ marginTop: '2.4rem', paddingTop: '1.5rem', borderTop: '1px solid var(--otaru-line)', textAlign: 'center' }}>
          <Link href="/" style={{ color: 'var(--otaru-parchment-dim)', fontSize: '0.76rem', textDecoration: 'none' }}>
            Continue exploring without signing in →
          </Link>
        </div>
      </div>
    </div>
  );
}

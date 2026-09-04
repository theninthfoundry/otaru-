'use client';

import React, { useState, useEffect, useRef } from 'react';
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

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    defaultChannel,
    sendOtp,
    verifyOtp,
    loginWithPassword,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'sms' | 'whatsapp' | 'email' | 'password'>('sms');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // OTP Verification Stage
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [maskedDestination, setMaskedDestination] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Sync default tab when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(defaultChannel);
      setError(null);
      setIsOtpSent(false);
      setOtpDigits(['', '', '', '', '', '']);
      setDevOtp(null);
      setResendCooldown(0);
    }
  }, [isAuthModalOpen, defaultChannel]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setIsLoading(true);

    const isMobile = activeTab === 'sms' || activeTab === 'whatsapp';
    const destination = isMobile ? phoneNumber.trim() : email.trim();

    if (!destination) {
      setError(isMobile ? 'Please enter a mobile phone number.' : 'Please enter an email address.');
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
      // Auto-focus first pin box
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

    // Handle full paste
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

    // Single digit entry
    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    // Auto-advance
    if (index < 5 && cleaned) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits are entered
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
    }
  };

  return (
    <div
      className="auth-modal-backdrop"
      onClick={closeAuthModal}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(7, 13, 20, 0.88)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div
        className="auth-modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#0e1724',
          border: '1px solid rgba(248, 245, 238, 0.16)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.75), 0 0 40px rgba(226, 194, 133, 0.08)',
          position: 'relative',
          padding: '2.5rem 2.2rem',
          borderRadius: '2px',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          aria-label="Close Authentication Modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--otaru-parchment-dim)',
            fontSize: '1.25rem',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '0.4rem',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--otaru-parchment-dim)')}
        >
          ✕
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--otaru-gold)',
                fontSize: '0.74rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              Archival Identity
            </span>
            <span style={{ color: 'var(--otaru-line-strong)' }}>·</span>
            <span
              style={{
                fontSize: '0.66rem',
                letterSpacing: '0.12em',
                color: 'var(--otaru-parchment-dim)',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
              }}
            >
              [ SECURE KEY ]
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: '1.8rem',
              color: 'var(--otaru-parchment)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {isOtpSent ? 'Enter Verification Code' : 'Access the Living Archive'}
          </h2>
          <p
            style={{
              marginTop: '0.45rem',
              fontSize: '0.84rem',
              color: 'var(--otaru-parchment-dim)',
              lineHeight: 1.5,
            }}
          >
            {isOtpSent
              ? `A 6-digit code has been dispatched to ${maskedDestination}.`
              : 'Sign in with SMS, WhatsApp, or Email to view your garment allocations & provenance.'}
          </p>
        </div>

        {/* Channel Switcher Tabs (when not on OTP verification step) */}
        {!isOtpSent && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.35rem',
              backgroundColor: '#070d14',
              padding: '0.3rem',
              borderRadius: '2px',
              border: '1px solid rgba(248, 245, 238, 0.08)',
              marginBottom: '1.8rem',
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
                    color: isSelected ? '#070d14' : 'var(--otaru-parchment-dim)',
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

        {/* Error Alert Box */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(181, 73, 50, 0.15)',
              border: '1px solid rgba(181, 73, 50, 0.4)',
              color: '#fca5a5',
              fontSize: '0.8rem',
              borderRadius: '2px',
              marginBottom: '1.25rem',
              lineHeight: 1.4,
            }}
          >
            {error}
          </div>
        )}

        {/* Dev OTP Helper Banner */}
        {devOtp && isOtpSent && (
          <div
            onClick={handleAutoFillDevOtp}
            style={{
              padding: '0.65rem 0.9rem',
              backgroundColor: 'rgba(226, 194, 133, 0.12)',
              border: '1px dashed var(--otaru-gold-dim)',
              color: 'var(--otaru-gold)',
              fontSize: '0.74rem',
              borderRadius: '2px',
              marginBottom: '1.25rem',
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

        {/* STAGE A: REQUEST CODE / CREDENTIALS FORM */}
        {!isOtpSent && activeTab !== 'password' && (
          <form onSubmit={handleSendCode}>
            {activeTab === 'sms' || activeTab === 'whatsapp' ? (
              <div style={{ marginBottom: '1.4rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--otaru-parchment-dim)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {activeTab === 'whatsapp' ? 'WhatsApp Phone Number' : 'Mobile Phone Number'}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {/* Country Code Picker */}
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    style={{
                      width: '95px',
                      padding: '0.8rem 0.5rem',
                      backgroundColor: '#070d14',
                      border: '1px solid rgba(248, 245, 238, 0.18)',
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
                      backgroundColor: '#070d14',
                      border: '1px solid rgba(248, 245, 238, 0.18)',
                      color: 'var(--otaru-parchment)',
                      borderRadius: '2px',
                      fontSize: '0.94rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--otaru-gold)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(248, 245, 238, 0.18)')}
                  />
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '1.4rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--otaru-parchment-dim)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Email Address
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
                    backgroundColor: '#070d14',
                    border: '1px solid rgba(248, 245, 238, 0.18)',
                    color: 'var(--otaru-parchment)',
                    borderRadius: '2px',
                    fontSize: '0.94rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--otaru-gold)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(248, 245, 238, 0.18)')}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.95rem',
                backgroundColor: 'var(--otaru-gold)',
                color: '#070d14',
                border: 'none',
                borderRadius: '2px',
                fontSize: '0.78rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: isLoading ? 'wait' : 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = '#fae7b9';
              }}
              onMouseLeave={(e) => {
                if (!isLoading) e.currentTarget.style.backgroundColor = 'var(--otaru-gold)';
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

        {/* STAGE B: PASSWORD AUTHENTICATION */}
        {!isOtpSent && activeTab === 'password' && (
          <form onSubmit={handlePasswordLogin}>
            <div style={{ marginBottom: '1.2rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--otaru-parchment-dim)',
                  marginBottom: '0.5rem',
                }}
              >
                Member Email
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
                  backgroundColor: '#070d14',
                  border: '1px solid rgba(248, 245, 238, 0.18)',
                  color: 'var(--otaru-parchment)',
                  borderRadius: '2px',
                  fontSize: '0.94rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.6rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--otaru-parchment-dim)',
                  marginBottom: '0.5rem',
                }}
              >
                Password Key
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  backgroundColor: '#070d14',
                  border: '1px solid rgba(248, 245, 238, 0.18)',
                  color: 'var(--otaru-parchment)',
                  borderRadius: '2px',
                  fontSize: '0.94rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.95rem',
                backgroundColor: 'var(--otaru-gold)',
                color: '#070d14',
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

        {/* STAGE C: 6-DIGIT OTP VERIFICATION BOXES */}
        {isOtpSent && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '0.5rem',
                marginBottom: '1.8rem',
              }}
            >
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
                    backgroundColor: '#070d14',
                    border: digit
                      ? '1px solid var(--otaru-gold)'
                      : '1px solid rgba(248, 245, 238, 0.2)',
                    color: 'var(--otaru-parchment)',
                    borderRadius: '2px',
                    outline: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--otaru-gold)')}
                  onBlur={(e) => {
                    if (!digit) e.target.style.borderColor = 'rgba(248, 245, 238, 0.2)';
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
                backgroundColor:
                  otpDigits.join('').length === 6 ? 'var(--otaru-gold)' : 'rgba(226, 194, 133, 0.3)',
                color: '#070d14',
                border: 'none',
                borderRadius: '2px',
                fontSize: '0.78rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: otpDigits.join('').length === 6 && !isLoading ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s ease',
              }}
            >
              {isLoading ? 'Verifying Cipher...' : 'Verify Code & Enter Archive →'}
            </button>

            {/* Back & Resend Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '1.25rem',
                fontSize: '0.76rem',
                color: 'var(--otaru-parchment-dim)',
              }}
            >
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
                  padding: 0,
                  textDecoration: 'underline',
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
                    fontWeight: 500,
                  }}
                >
                  Resend Code ↻
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

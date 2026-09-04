'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth, AuthChannel } from '@/context/auth-context';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';
import { SashikoGrid, VerticalKanjiStamp } from '@/components/ui/ArchivalBackgroundArt';

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

export function CollectorPassportSection() {
  const { user, isAuthenticated, sendOtp, verifyOtp, loginWithPassword, logout, openAuthModal } =
    useAuth();

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

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

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

    const channel: AuthChannel =
      activeTab === 'whatsapp' ? 'whatsapp' : activeTab === 'sms' ? 'sms' : 'email';

    const result = await sendOtp(destination, channel, countryCode);
    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to dispatch verification cipher.');
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
      setError(result.error || 'Invalid verification cipher. Please check and retry.');
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

    // Pasting full 6-digit code
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
    }
  };

  return (
    <section
      className="block on-ink"
      id="authentication"
      aria-labelledby="auth-section-heading"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(5rem, 8vw, 8rem) 0',
      }}
    >
      {/* Archival Sashiko Pattern Background */}
      <SashikoGrid opacity={0.03} />

      {/* Vertical Japanese Calligraphy Watermark */}
      <VerticalKanjiStamp text="入室認証" subtext="COLLECTOR CITADEL RECORD" top="12%" right="2.5%" opacity={0.045} />
      <VerticalKanjiStamp text="身份証明" subtext="PROVENANCE PASSPORT" top="58%" left="2%" opacity={0.035} />

      <div className="wrap" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>
        <RevealOnScroll>
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span className="eyebrow" style={{ color: 'var(--otaru-gold)', letterSpacing: '0.2em' }}>
              Collector Citadel · Identity Gate
            </span>
            <h2
              className="section-title"
              id="auth-section-heading"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                lineHeight: 1.1,
                marginTop: '0.4rem',
              }}
            >
              Authenticate your Archival Passport.
            </h2>
            <p
              className="section-lede"
              style={{
                margin: '1.1rem auto 0',
                color: 'var(--otaru-parchment-dim)',
                fontSize: '1rem',
                lineHeight: 1.65,
              }}
            >
              Verify your identity via SMS OTP, WhatsApp, or Email to claim permanent batch allocations, track dispatch logistics, and inspect cryptographic garment deeds.
            </p>
          </div>
        </RevealOnScroll>

        {/* Dynamic Section Body: Logged In Dossier VS Authentication Portal */}
        {isAuthenticated && user ? (
          /* AUTHENTICATED COLLECTOR PASSPORT CARD */
          <RevealOnScroll>
            <div
              style={{
                maxWidth: '680px',
                margin: '0 auto',
                backgroundColor: 'rgba(14, 23, 36, 0.75)',
                border: '1px solid rgba(226, 194, 133, 0.35)',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(226, 194, 133, 0.08)',
                padding: 'clamp(2rem, 5vw, 3.2rem)',
                borderRadius: '2px',
                position: 'relative',
              }}
            >
              {/* Gold Top Trim */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, var(--otaru-gold) 50%, transparent 100%)',
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.65rem',
                      letterSpacing: '0.18em',
                      color: 'var(--otaru-gold)',
                      textTransform: 'uppercase',
                    }}
                  >
                    [ VERIFIED COLLECTOR SESSION ]
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.9rem',
                      color: 'var(--otaru-parchment)',
                      marginTop: '0.3rem',
                      marginBottom: 0,
                    }}
                  >
                    {user.name || 'Archival Member'}
                  </h3>
                  <p style={{ color: 'var(--otaru-parchment-dim)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                    {user.phone ? `Phone: ${user.phone}` : `Email: ${user.email}`}
                  </p>
                </div>

                <div
                  style={{
                    padding: '0.4rem 0.85rem',
                    backgroundColor: 'rgba(226, 194, 133, 0.1)',
                    border: '1px solid var(--otaru-gold-dim)',
                    borderRadius: '2px',
                    textAlign: 'right',
                  }}
                >
                  <span style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--otaru-gold)', display: 'block', fontFamily: 'monospace' }}>
                    TIER STATUS
                  </span>
                  <span style={{ fontSize: '0.86rem', color: 'var(--otaru-parchment)', fontWeight: 600 }}>
                    Vanguard Circle
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '1rem',
                  marginTop: '2rem',
                  padding: '1.4rem',
                  backgroundColor: '#070d14',
                  border: '1px solid rgba(248, 245, 238, 0.08)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--otaru-parchment-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', fontFamily: 'monospace' }}>
                    ALLOCATIONS
                  </span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--otaru-parchment)', fontFamily: 'var(--font-display)' }}>
                    Active Priority
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--otaru-parchment-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', fontFamily: 'monospace' }}>
                    CRYPTOGRAPHIC KEY
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--otaru-gold-dim)', fontFamily: 'monospace' }}>
                    {user.id ? user.id.slice(0, 14) + '...' : 'Verified'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--otaru-parchment-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', fontFamily: 'monospace' }}>
                    LIFETIME CARE
                  </span>
                  <span style={{ fontSize: '1.2rem', color: '#4ade80', fontFamily: 'var(--font-display)' }}>
                    Active
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <Link
                  href="/profile"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '0.85rem 1.4rem',
                    backgroundColor: 'var(--otaru-gold)',
                    color: '#070d14',
                    textDecoration: 'none',
                    fontSize: '0.76rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    borderRadius: '2px',
                  }}
                >
                  Enter Collector Profile →
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  style={{
                    padding: '0.85rem 1.4rem',
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(248, 245, 238, 0.2)',
                    color: 'var(--otaru-parchment-dim)',
                    fontSize: '0.76rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#fca5a5';
                    e.currentTarget.style.borderColor = '#fca5a5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--otaru-parchment-dim)';
                    e.currentTarget.style.borderColor = 'rgba(248, 245, 238, 0.2)';
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </RevealOnScroll>
        ) : (
          /* UNVERIFIED: INLINE MULTI-CHANNEL AUTHENTICATION INTERFACE */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'stretch',
            }}
          >
            {/* Left Feature Column: Collector Benefits */}
            <RevealOnScroll>
              <div
                style={{
                  height: '100%',
                  padding: '2.5rem',
                  backgroundColor: 'rgba(14, 23, 36, 0.45)',
                  border: '1px solid rgba(248, 245, 238, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '2px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '0.64rem',
                      letterSpacing: '0.18em',
                      color: 'var(--otaru-gold)',
                      textTransform: 'uppercase',
                    }}
                  >
                    ✦ LIVING ARCHIVE DOSSIER
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.75rem',
                      color: 'var(--otaru-parchment)',
                      marginTop: '0.5rem',
                      lineHeight: 1.25,
                    }}
                  >
                    Why authenticate with your phone or email?
                  </h3>
                  <ul
                    style={{
                      marginTop: '1.8rem',
                      paddingLeft: 0,
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.2rem',
                    }}
                  >
                    {[
                      {
                        title: '48-Hour Priority Drop Window',
                        desc: 'Receive instant SMS or WhatsApp notices before garments are indexed publicly.',
                      },
                      {
                        title: 'Permanent Garment Passports',
                        desc: 'Inspect cryptographic ownership hashes, weave origin records, and botanical dye dates.',
                      },
                      {
                        title: 'Hokkaido Studio Care & Repairs',
                        desc: 'Lifetime complimentary re-waxing and sashiko stitching for registered garments.',
                      },
                      {
                        title: 'Zero Password Friction',
                        desc: 'Log in with one tap using 6-digit SMS, WhatsApp, or email verification codes.',
                      },
                    ].map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--otaru-gold)', fontSize: '0.85rem', lineHeight: 1.4 }}>◇</span>
                        <div>
                          <strong style={{ color: 'var(--otaru-parchment)', fontSize: '0.88rem', display: 'block' }}>
                            {item.title}
                          </strong>
                          <span style={{ color: 'var(--otaru-parchment-dim)', fontSize: '0.78rem', lineHeight: 1.5, display: 'block', marginTop: '0.15rem' }}>
                            {item.desc}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1.2rem', borderTop: '1px solid rgba(248, 245, 238, 0.08)' }}>
                  <button
                    type="button"
                    onClick={() => openAuthModal('sms')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--otaru-gold)',
                      fontSize: '0.76rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                    }}
                  >
                    Open Standalone Auth Dialog ↗
                  </button>
                </div>
              </div>
            </RevealOnScroll>

            {/* Right Column: Multi-Channel Sign In Card */}
            <RevealOnScroll staggerIndex={1}>
              <div
                style={{
                  height: '100%',
                  padding: '2.5rem',
                  backgroundColor: '#0e1724',
                  border: '1px solid rgba(226, 194, 133, 0.35)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.55), 0 0 30px rgba(226, 194, 133, 0.06)',
                  borderRadius: '2px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.64rem',
                        letterSpacing: '0.16em',
                        color: 'var(--otaru-gold)',
                        textTransform: 'uppercase',
                      }}
                    >
                      Instant Verification
                    </span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--otaru-parchment-dim)', fontFamily: 'monospace' }}>
                      256-BIT CRYPTO
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.7rem',
                      color: 'var(--otaru-parchment)',
                      marginTop: '0.2rem',
                      lineHeight: 1.2,
                    }}
                  >
                    {isOtpSent ? 'Enter Security Cipher' : 'Sign in to your Archive'}
                  </h3>

                  {/* Channel Switcher */}
                  {!isOtpSent && (
                    <div
                      style={{
                        marginTop: '1.4rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '0.3rem',
                        backgroundColor: '#070d14',
                        padding: '0.25rem',
                        border: '1px solid rgba(248, 245, 238, 0.08)',
                        borderRadius: '2px',
                      }}
                    >
                      {([
                        { id: 'sms', label: 'SMS' },
                        { id: 'whatsapp', label: 'WhatsApp' },
                        { id: 'email', label: 'Email' },
                        { id: 'password', label: 'Password' },
                      ] as const).map((tab) => {
                        const isSelected = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => {
                              setActiveTab(tab.id);
                              setError(null);
                            }}
                            style={{
                              padding: '0.5rem 0.2rem',
                              fontSize: '0.66rem',
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

                  {/* Error Notification */}
                  {error && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: 'rgba(181, 73, 50, 0.15)',
                        border: '1px solid rgba(181, 73, 50, 0.4)',
                        color: '#fca5a5',
                        fontSize: '0.78rem',
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
                        marginTop: '1rem',
                        padding: '0.6rem 0.85rem',
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
                        <strong>[Dev]</strong> Code: <code>{devOtp}</code>
                      </span>
                      <span style={{ textDecoration: 'underline', fontSize: '0.66rem' }}>Auto-Fill →</span>
                    </div>
                  )}

                  {/* FORM 1: SEND CODE */}
                  {!isOtpSent && activeTab !== 'password' && (
                    <form onSubmit={handleSendCode} style={{ marginTop: '1.4rem' }}>
                      {activeTab === 'sms' || activeTab === 'whatsapp' ? (
                        <div>
                          <label
                            style={{
                              fontSize: '0.68rem',
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              color: 'var(--otaru-parchment-dim)',
                              display: 'block',
                              marginBottom: '0.45rem',
                              fontFamily: 'monospace',
                            }}
                          >
                            {activeTab === 'whatsapp' ? 'WhatsApp Phone Number' : 'Mobile Phone Number'}
                          </label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                                fontSize: '0.85rem',
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
                              style={{
                                flex: 1,
                                padding: '0.8rem 1rem',
                                backgroundColor: '#070d14',
                                border: '1px solid rgba(248, 245, 238, 0.18)',
                                color: 'var(--otaru-parchment)',
                                borderRadius: '2px',
                                fontSize: '0.92rem',
                                outline: 'none',
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label
                            style={{
                              fontSize: '0.68rem',
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              color: 'var(--otaru-parchment-dim)',
                              display: 'block',
                              marginBottom: '0.45rem',
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
                            style={{
                              width: '100%',
                              padding: '0.8rem 1rem',
                              backgroundColor: '#070d14',
                              border: '1px solid rgba(248, 245, 238, 0.18)',
                              color: 'var(--otaru-parchment)',
                              borderRadius: '2px',
                              fontSize: '0.92rem',
                              outline: 'none',
                            }}
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          marginTop: '1.4rem',
                          padding: '0.9rem',
                          backgroundColor: 'var(--otaru-gold)',
                          color: '#070d14',
                          border: 'none',
                          borderRadius: '2px',
                          fontSize: '0.76rem',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          cursor: isLoading ? 'wait' : 'pointer',
                          transition: 'background-color 0.2s ease',
                        }}
                      >
                        {isLoading
                          ? 'Dispatching Code...'
                          : activeTab === 'whatsapp'
                          ? 'Send WhatsApp Code →'
                          : activeTab === 'sms'
                          ? 'Send SMS Code →'
                          : 'Send Email Code →'}
                      </button>
                    </form>
                  )}

                  {/* FORM 2: PASSWORD */}
                  {!isOtpSent && activeTab === 'password' && (
                    <form onSubmit={handlePasswordLogin} style={{ marginTop: '1.4rem' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)', display: 'block', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="collector@archive.otaru.in"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.78rem 1rem',
                            backgroundColor: '#070d14',
                            border: '1px solid rgba(248, 245, 238, 0.18)',
                            color: 'var(--otaru-parchment)',
                            borderRadius: '2px',
                            fontSize: '0.9rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '1.2rem' }}>
                        <label style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--otaru-parchment-dim)', display: 'block', marginBottom: '0.4rem', fontFamily: 'monospace' }}>
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
                            padding: '0.78rem 1rem',
                            backgroundColor: '#070d14',
                            border: '1px solid rgba(248, 245, 238, 0.18)',
                            color: 'var(--otaru-parchment)',
                            borderRadius: '2px',
                            fontSize: '0.9rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          width: '100%',
                          padding: '0.9rem',
                          backgroundColor: 'var(--otaru-gold)',
                          color: '#070d14',
                          border: 'none',
                          borderRadius: '2px',
                          fontSize: '0.76rem',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          cursor: isLoading ? 'wait' : 'pointer',
                        }}
                      >
                        {isLoading ? 'Verifying...' : 'Sign In With Password →'}
                      </button>
                    </form>
                  )}

                  {/* FORM 3: 6-DIGIT OTP PIN BOXES */}
                  {isOtpSent && (
                    <div style={{ marginTop: '1.4rem' }}>
                      <p style={{ fontSize: '0.78rem', color: 'var(--otaru-parchment-dim)', marginBottom: '1rem' }}>
                        Enter 6-digit code sent to <strong>{maskedDestination}</strong>:
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.45rem', marginBottom: '1.4rem' }}>
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
                              width: '46px',
                              height: '50px',
                              fontSize: '1.35rem',
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
                          padding: '0.9rem',
                          backgroundColor:
                            otpDigits.join('').length === 6 ? 'var(--otaru-gold)' : 'rgba(226, 194, 133, 0.3)',
                          color: '#070d14',
                          border: 'none',
                          borderRadius: '2px',
                          fontSize: '0.76rem',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          cursor: otpDigits.join('').length === 6 && !isLoading ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {isLoading ? 'Verifying...' : 'Verify Code & Sign In →'}
                      </button>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.74rem' }}>
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
                          ← Change Number
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

                <div style={{ marginTop: '1.8rem', paddingTop: '1rem', borderTop: '1px solid rgba(248, 245, 238, 0.08)', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--otaru-parchment-dim)' }}>
                    Need archival assistance?{' '}
                    <Link href="/contact" style={{ color: 'var(--otaru-gold)', textDecoration: 'none' }}>
                      Atelier Concierge →
                    </Link>
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useConcierge } from '@/lib/concierge';
import { subscribeToNewsletter } from '@/actions/newsletter';
import { HouseOfOtaruWordmark } from '@/components/ui/HouseOfOtaruWordmark';
import { FooterAtmosphereArt } from '@/components/ui/FooterAtmosphereArt';

/**
 * Converts a calendar year into classical Roman numeral notation
 * e.g. 2026 -> MMXXVI
 */
function getRomanYear(year: number): string {
  const romanMap: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let result = '';
  let remainder = year;
  for (const [val, char] of romanMap) {
    while (remainder >= val) {
      result += char;
      remainder -= val;
    }
  }
  return result;
}

/**
 * SiteFooter — House of Otaru
 * 
 * Recreates the definitive luxury editorial fashion-house footer reference:
 * - 01. Top Section:
 *     - Left: Master calligraphic "House of Otaru™" signature & descriptor
 *     - Center: Fine vertical rule & editorial statement ("Limited run pieces for a deeper tomorrow.")
 *     - Right: "JOIN OUR JOURNEY" with pill-shaped email input & circular ivory submit arrow
 * - 02. Primary Divider: Hairline separation rule
 * - 03. Navigation Grid:
 *     - 01 / THE ARCHIVE (All Objects, Live Batch Run, Material Ledger, Outerwear Pieces)
 *     - 02 / CHAPTERS (Italic serif: Chapter I - Kyoto Nights, Chapter II - Otaru Harbor, Chapter III - Quiet Interior, Chapter 0 - Prototypes)
 *     - 03 / STUDIO & CRAFT (Warehouse History, Field Notes Journal, Canal Dyehouse, Lifetime Repairs)
 *     - 04 / CONCIERGE (Italic serif: Collector Profile, Track Dispatch, Archival Circle, Contact Atelier)
 *     - Delicate vertical divider
 *     - FOLLOW (Social icons, "Different places. Same sky.", 4-point star)
 * - 04. Second Divider: Hairline separation rule
 * - 05. Lower Metadata Row:
 *     - Left: Delicate wireframe globe icon + "© MMXXVI HOUSE OF OTARU · ESTABLISHED IN HOKKAIDO · 43.1907° N, 140.9947° E"
 *     - Right: "ALL OBJECTS PROTECTED | ZERO MASS-PRODUCTION"
 * - 06. Atmosphere & Materiality:
 *     - Pure deep charcoal #080B0B base with subtle washi grain
 *     - Left botanical leaf specimen & vertical '小樽' kanji hallmark
 *     - Right dark craggy natural mineral rock formation
 *     - Top-right fine circular line motif
 *     - Zero unwanted bottom-left overlays or redundant HUDs
 */
export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const romanYear = getRomanYear(currentYear);
  const { openConcierge } = useConcierge();

  // Newsletter interaction state
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await subscribeToNewsletter(email);
      if (res.success) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
        setErrorMessage(res.error || 'Could not subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <footer
      className="relative w-full bg-[#080B0B] text-[#F2E8D6] pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-14 overflow-hidden border-t border-[rgba(222,210,188,0.18)]"
      aria-label="House of Otaru Editorial Archive"
    >
      {/* Visual Material Textures & Perimeter Artwork */}
      <FooterAtmosphereArt />

      {/* Main Content Stage */}
      <div className="relative z-10 w-full max-w-[1560px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        
        {/* ========================================================
            01. UPPER SECTION: Wordmark, Brand Statement, Newsletter
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start lg:items-center">
          
          {/* TOP-LEFT: The Master Signature Wordmark (~39% desktop width) */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link
              href="/"
              className="inline-block group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F2E8D6]"
              aria-label="House of Otaru Homepage"
            >
              <HouseOfOtaruWordmark
                className="w-[330px] sm:w-[420px] lg:w-[520px] xl:w-[600px] max-w-full text-[#F2E8D6] group-hover:opacity-95 transition-opacity"
              />
            </Link>

            {/* Muted Atelier Descriptor */}
            <div className="mt-3.5 sm:mt-4 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.36em] text-[#C7B9A0]/85 select-none pl-1">
              CLOTHING &nbsp;/&nbsp; CULTURE &nbsp;/&nbsp; COMMUNITY
            </div>
          </div>

          {/* TOP-CENTER: Brand Statement & Delicate Vertical Divider (~29% desktop width) */}
          <div className="lg:col-span-3 flex items-center lg:border-l lg:border-[rgba(222,210,188,0.22)] lg:pl-8 lg:py-2">
            <div className="flex flex-col justify-center">
              <p
                className="font-display italic text-[#F2E8D6] text-base sm:text-lg lg:text-[1.18rem] leading-[1.38] font-light max-w-[28ch]"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Limited run pieces for a
                <br />
                deeper tomorrow.
              </p>

              <p className="mt-3 font-sans text-[10px] sm:text-[10.5px] uppercase tracking-[0.26em] text-[#C7B9A0] font-normal select-none">
                HERITAGE &nbsp;×&nbsp; CRAFT &nbsp;×&nbsp; YOU
              </p>
            </div>
          </div>

          {/* TOP-RIGHT: Newsletter Signup (~32% desktop width) */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center lg:text-left">
            <div className="w-full max-w-[340px]">
              <span className="block font-sans text-[11px] uppercase tracking-[0.22em] text-[#F2E8D6] font-medium mb-3">
                JOIN OUR JOURNEY
              </span>

              {/* Pill-shaped horizontal email field */}
              <form
                onSubmit={handleNewsletterSubmit}
                noValidate
                className="relative flex items-center w-full bg-[#0A0E0E]/90 border border-[rgba(222,210,188,0.32)] rounded-full pl-4 pr-1.5 py-1.5 transition-all focus-within:border-[#F2E8D6] focus-within:bg-[#0E1313] focus-within:shadow-[0_0_12px_rgba(242,232,214,0.12)]"
              >
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Your email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  disabled={status === 'loading'}
                  className="w-full bg-transparent text-xs sm:text-[13px] text-[#F2E8D6] placeholder:text-[#C7B9A0]/50 outline-none pr-2 font-sans"
                  autoComplete="email"
                  spellCheck="false"
                />

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  aria-label="Submit email to archival dispatch journey"
                  className="w-8 h-8 rounded-full bg-[#F2E8D6] text-[#080B0B] flex items-center justify-center shrink-0 hover:bg-[#FAF6EF] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2E8D6] shadow-sm cursor-pointer"
                >
                  {status === 'loading' ? (
                    <svg
                      className="animate-spin w-3.5 h-3.5 text-[#080B0B]"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </button>
              </form>

              {/* Status feedback message */}
              {status === 'success' && (
                <p className="mt-2 text-[11px] font-mono text-[#D9BD83] tracking-wide animate-in fade-in">
                  ✓ Allocated into atelier dispatch ledger.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-2 text-[11px] font-mono text-[#E58B79] tracking-wide animate-in fade-in">
                  {errorMessage}
                </p>
              )}

              {/* Explanatory subcopy */}
              <p
                className="mt-2.5 font-display italic text-[11.5px] sm:text-xs text-[#C7B9A0]/85 font-light"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                Be the first to know about new drops, stories &amp; more.
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================
            02. THE PRIMARY DIVIDER: Subtle Horizontal Rule
            ======================================================== */}
        <div className="w-full border-t border-[rgba(222,210,188,0.22)] my-11 sm:my-14" />

        {/* ========================================================
            03. MIDDLE NAVIGATION GRID: 4 Columns + Delicate Rule + Follow
            ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          
          {/* COLUMN 01: THE ARCHIVE */}
          <div className="lg:col-span-2">
            <span
              className="font-display italic text-xs text-[#C7B9A0]/90 mb-1.5 block select-none"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              01 /
            </span>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.22em] font-semibold text-[#F2E8D6] mb-4">
              THE ARCHIVE
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#C7B9A0]">
              <li>
                <Link
                  href="/archive"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  All Objects
                </Link>
              </li>
              <li>
                <Link
                  href="/#batch"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Live Batch Run
                </Link>
              </li>
              <li>
                <Link
                  href="/#material"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Material Ledger
                </Link>
              </li>
              <li>
                <Link
                  href="/archive?category=outerwear"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Outerwear Pieces
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 02: CHAPTERS (Editorial Italic Serif Links) */}
          <div className="lg:col-span-3">
            <span
              className="font-display italic text-xs text-[#C7B9A0]/90 mb-1.5 block select-none"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              02 /
            </span>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.22em] font-semibold text-[#F2E8D6] mb-4">
              CHAPTERS
            </h3>
            <ul
              className="space-y-2.5 text-xs sm:text-[13px] text-[#C7B9A0] font-display italic font-light"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              <li>
                <Link
                  href="/chapters#chapter-1"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Chapter I - Kyoto Nights
                </Link>
              </li>
              <li>
                <Link
                  href="/chapters#chapter-2"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Chapter II - Otaru Harbor
                </Link>
              </li>
              <li>
                <Link
                  href="/chapters#chapter-3"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Chapter III - Quiet Interior
                </Link>
              </li>
              <li>
                <Link
                  href="/chapters#chapter-0"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Chapter 0 - Prototypes
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 03: STUDIO & CRAFT */}
          <div className="lg:col-span-2">
            <span
              className="font-display italic text-xs text-[#C7B9A0]/90 mb-1.5 block select-none"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              03 /
            </span>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.22em] font-semibold text-[#F2E8D6] mb-4">
              STUDIO &amp; CRAFT
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#C7B9A0]">
              <li>
                <Link
                  href="/studio"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Warehouse History
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Field Notes Journal
                </Link>
              </li>
              <li>
                <Link
                  href="/studio#dyehouse"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Canal Dyehouse
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping-exchanges"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Lifetime Repairs
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 04: CONCIERGE (Editorial Italic Serif Links) */}
          <div className="lg:col-span-2">
            <span
              className="font-display italic text-xs text-[#C7B9A0]/90 mb-1.5 block select-none"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              04 /
            </span>
            <h3 className="font-sans text-[11px] uppercase tracking-[0.22em] font-semibold text-[#F2E8D6] mb-4">
              CONCIERGE
            </h3>
            <ul
              className="space-y-2.5 text-xs sm:text-[13px] text-[#C7B9A0] font-display italic font-light"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              <li>
                <Link
                  href="/cart"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Acquisition Tray &amp; Wishlist
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Collector Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Track Dispatch
                </Link>
              </li>
              <li>
                <Link
                  href="/#circle"
                  className="hover:text-[#F2E8D6] transition-colors inline-block focus:outline-none focus-visible:underline"
                >
                  Archival Circle
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openConcierge('fit')}
                  className="hover:text-[#F2E8D6] transition-colors inline-block text-left cursor-pointer focus:outline-none focus-visible:underline"
                >
                  Contact Atelier
                </button>
              </li>
            </ul>
          </div>

          {/* DELICATE VERTICAL SEPARATOR between Concierge and Social on Desktop */}
          <div className="hidden lg:flex lg:col-span-1 justify-center self-stretch py-1">
            <div className="w-[1px] h-36 bg-[rgba(222,210,188,0.2)]" />
          </div>

          {/* COLUMN 05 / SOCIAL AREA: FOLLOW */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h3 className="font-sans text-[11px] uppercase tracking-[0.22em] font-semibold text-[#F2E8D6] mb-4">
              FOLLOW
            </h3>

            {/* Social Icons row */}
            <div className="flex items-center gap-4 text-[#C7B9A0]">
              {/* Instagram */}
              <a
                href="https://instagram.com/houseofotaru"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow House of Otaru on Instagram"
                className="hover:text-[#F2E8D6] transition-colors p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F2E8D6]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/houseofotaru"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow House of Otaru on X"
                className="hover:text-[#F2E8D6] transition-colors p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F2E8D6]"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@houseofotaru"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to House of Otaru on YouTube"
                className="hover:text-[#F2E8D6] transition-colors p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F2E8D6]"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://pinterest.com/houseofotaru"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow House of Otaru on Pinterest"
                className="hover:text-[#F2E8D6] transition-colors p-0.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F2E8D6]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 20.5l1.5-6.5c-.3-.6-.4-1.4-.4-2.2 0-2.1 1.2-3.7 2.8-3.7 1.3 0 1.9 1 1.9 2.2 0 1.3-.8 3.3-1.3 5.2-.4 1.5.8 2.8 2.3 2.8 2.8 0 4.6-3.6 4.6-7.8 0-3.3-2.2-5.7-6.2-5.7-4.5 0-7.3 3.4-7.3 7.1 0 1.3.5 2.7 1.1 3.5.1.2.2.3.1.5l-.4 1.7c-.1.3-.3.4-.6.3-2.1-1-3.1-3.6-3.1-6.1 0-4.9 3.6-9.6 10.7-9.6 5.7 0 9.5 4.1 9.5 8.6 0 5.8-3.3 10.2-8.2 10.2-1.6 0-3.1-.9-3.7-1.9L9.6 22" />
                </svg>
              </a>
            </div>

            {/* Editorial sentiment lines */}
            <div
              className="mt-4 font-display italic text-xs text-[#C7B9A0]/85 leading-snug"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              <p>Different places.</p>
              <p>Same sky.</p>
            </div>

            {/* Tiny Four-Point Archival Star */}
            <div className="mt-3.5 text-[#F2E8D6]/70">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0 C12 6.627 17.373 12 24 12 C17.373 12 12 17.373 12 24 C12 17.373 6.627 12 0 12 C6.627 12 12 6.627 12 0 Z" />
              </svg>
            </div>
          </div>

        </div>

        {/* ========================================================
            04. SECOND DIVIDER: Subtle Horizontal Rule
            ======================================================== */}
        <div className="w-full border-t border-[rgba(222,210,188,0.22)] my-11 sm:my-14" />

        {/* ========================================================
            05. LOWER METADATA ROW: Globe, Copyright, Coordinates & Invariants
            ======================================================== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] sm:text-[10.5px] uppercase tracking-[0.2em] text-[#C7B9A0] font-sans">
          
          {/* LEFT: Delicate Wireframe Globe + Brand Copyright + Coordinates */}
          <div className="flex items-center gap-3.5 flex-wrap">
            {/* Wireframe Globe Icon */}
            <svg
              width="24"
              height="15"
              viewBox="0 0 32 20"
              fill="none"
              className="text-[#C7B9A0]/80 shrink-0"
              aria-hidden="true"
            >
              {/* Outer horizontal ellipse */}
              <ellipse cx="16" cy="10" rx="15" ry="9" stroke="currentColor" strokeWidth="0.85" />
              {/* Horizontal equator */}
              <line x1="1" y1="10" x2="31" y2="10" stroke="currentColor" strokeWidth="0.85" />
              {/* Upper latitude curve */}
              <path d="M 3 6 Q 16 8 29 6" stroke="currentColor" strokeWidth="0.65" />
              {/* Lower latitude curve */}
              <path d="M 3 14 Q 16 12 29 14" stroke="currentColor" strokeWidth="0.65" />
              {/* Vertical center meridian */}
              <line x1="16" y1="1" x2="16" y2="19" stroke="currentColor" strokeWidth="0.85" />
              {/* Inner longitudinal ellipses */}
              <ellipse cx="16" cy="10" rx="9" ry="9" stroke="currentColor" strokeWidth="0.75" />
              <ellipse cx="16" cy="10" rx="4.5" ry="9" stroke="currentColor" strokeWidth="0.65" />
            </svg>

            <span>
              &copy; {romanYear} HOUSE OF OTARU
            </span>
            <span className="text-[rgba(222,210,188,0.3)]">·</span>
            <span>
              ESTABLISHED IN HOKKAIDO
            </span>
            <span className="text-[rgba(222,210,188,0.3)]">·</span>
            <span className="font-mono text-[9.5px] sm:text-[10px]">
              43.1907° N, 140.9947° E
            </span>
          </div>

          {/* RIGHT: Object Protection & Production Guarantee */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-medium">
            <span>ALL OBJECTS PROTECTED</span>
            <span className="text-[rgba(222,210,188,0.3)]">|</span>
            <span>ZERO MASS-PRODUCTION</span>
          </div>

        </div>

      </div>
    </footer>
  );
}

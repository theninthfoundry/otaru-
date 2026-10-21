'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { CONSENT_OPEN_EVENT, getConsent, saveConsent, useConsent } from '@/lib/consent/consent';

const noopSubscribe = () => () => {};
const btn =
  'min-h-[44px] px-4 text-[11px] font-mono uppercase tracking-wider border border-[rgba(222,210,188,0.5)] text-[#F2E8D6] hover:bg-[#F2E8D6] hover:text-[#080B0B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2E8D6] transition-colors cursor-pointer';

/** Consent banner: equal-weight Accept / Reject, granular choices, re-openable from the footer. */
export function CookieConsent() {
  const consent = useConsent();
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [reopened, setReopened] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const open = () => {
      const c = getConsent();
      setAnalytics(c.analytics);
      setMarketing(c.marketing);
      setManage(true);
      setReopened(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    if (reopened) ref.current?.focus();
  }, [reopened]);

  if (!isClient || (consent.decided && !reopened)) return null;

  const decide = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    setReopened(false);
    setManage(false);
  };

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && reopened) setReopened(false);
      }}
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-[27rem] z-[300] bg-[#0B1010] text-[#F2E8D6] border border-[rgba(222,210,188,0.3)] p-5 sm:p-6 outline-none"
    >
      <h2 id={titleId} className="font-display italic text-lg mb-2">Your privacy, your choice</h2>
      <p className="text-[13px] leading-relaxed text-[#D8CBB2]">
        We use essential storage to run the store. With your permission we also use analytics and marketing tools.
        Details in our <Link href="/cookies" className="underline underline-offset-4">cookie notice</Link> and{' '}
        <Link href="/privacy" className="underline underline-offset-4">privacy policy</Link>.
      </p>

      {manage && (
        <fieldset className="mt-4 space-y-3 border-t border-[rgba(222,210,188,0.2)] pt-4">
          <legend className="sr-only">Cookie categories</legend>
          <label className="flex items-start gap-3 text-[13px] opacity-80">
            <input type="checkbox" checked disabled className="mt-1 h-4 w-4" />
            <span><b className="font-medium">Essential</b> — consent choice, bag and sign-in. Always on.</span>
          </label>
          <label className="flex items-start gap-3 text-[13px] cursor-pointer">
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 h-4 w-4" />
            <span><b className="font-medium">Analytics</b> — Google Analytics, Microsoft Clarity.</span>
          </label>
          <label className="flex items-start gap-3 text-[13px] cursor-pointer">
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 h-4 w-4" />
            <span><b className="font-medium">Marketing</b> — Meta Pixel.</span>
          </label>
        </fieldset>
      )}

      <div className="mt-5 grid grid-cols-2 gap-2">
        {manage ? (
          <>
            <button type="button" className={btn} onClick={() => decide(false, false)}>Reject non-essential</button>
            <button type="button" className={btn} onClick={() => decide(analytics, marketing)}>Save choices</button>
          </>
        ) : (
          <>
            <button type="button" className={btn} onClick={() => decide(false, false)}>Reject non-essential</button>
            <button type="button" className={btn} onClick={() => decide(true, true)}>Accept all</button>
            <button type="button" className="col-span-2 min-h-[44px] text-[11px] font-mono uppercase tracking-wider text-[#D8CBB2] underline underline-offset-4 hover:text-[#F2E8D6] cursor-pointer" onClick={() => setManage(true)}>
              Manage choices
            </button>
          </>
        )}
      </div>
    </div>
  );
}

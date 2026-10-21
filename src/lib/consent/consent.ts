'use client';

import { useSyncExternalStore } from 'react';

export interface ConsentState {
  version: number;
  decided: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string | null;
}

const COOKIE = 'otaru_consent';
const VERSION = 1;
const CHANGE_EVENT = 'otaru:consent-change';
export const CONSENT_OPEN_EVENT = 'otaru:consent-open';
const UNDECIDED: ConsentState = { version: VERSION, decided: false, analytics: false, marketing: false, updatedAt: null };
const TRACKING_COOKIE = /^(_ga|_gid|_gat|_clck|_clsk|CLID|_fbp|_fbc)/;

let lastRaw: string | null = null;
let lastState: ConsentState = UNDECIDED;

function readRaw(): string {
  const hit = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE}=`));
  return hit ? hit.slice(COOKIE.length + 1) : '';
}

function parse(raw: string): ConsentState {
  if (!raw) return UNDECIDED;
  try {
    const v: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof v === 'object' && v !== null) {
      const o = v as Record<string, unknown>;
      if (o.version === VERSION && typeof o.analytics === 'boolean' && typeof o.marketing === 'boolean') {
        return {
          version: VERSION,
          decided: true,
          analytics: o.analytics,
          marketing: o.marketing,
          updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : null,
        };
      }
    }
  } catch {
    /* malformed cookie: treat as undecided */
  }
  return UNDECIDED;
}

/** Stable snapshot: the same object is returned until the cookie string changes. */
export function getConsent(): ConsentState {
  if (typeof document === 'undefined') return UNDECIDED;
  const raw = readRaw();
  if (raw !== lastRaw) {
    lastRaw = raw;
    lastState = parse(raw);
  }
  return lastState;
}

function clearTrackingCookies(): void {
  const hosts = ['', `; Domain=${window.location.hostname}`, `; Domain=.${window.location.hostname}`];
  document.cookie.split('; ').forEach((pair) => {
    const name = pair.split('=')[0] ?? '';
    if (TRACKING_COOKIE.test(name)) {
      hosts.forEach((d) => {
        document.cookie = `${name}=; Max-Age=0; Path=/${d}`;
      });
    }
  });
}

export function saveConsent(choice: { analytics: boolean; marketing: boolean }): void {
  const value = encodeURIComponent(
    JSON.stringify({ version: VERSION, analytics: choice.analytics, marketing: choice.marketing, updatedAt: new Date().toISOString() }),
  );
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE}=${value}; Max-Age=15552000; Path=/; SameSite=Lax${secure}`;
  if (!choice.analytics || !choice.marketing) clearTrackingCookies();
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, getConsent, () => UNDECIDED);
}

export function openConsentPreferences(): void {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

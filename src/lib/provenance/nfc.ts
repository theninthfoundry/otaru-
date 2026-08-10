/**
 * OTARU — Provenance Domain: Web NFC Service
 */
export function isNfcSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'NDEFReader' in window;
}

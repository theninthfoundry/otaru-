/**
 * OTARU — Provenance Domain: Verification Registry
 */
export const VERIFICATION_REGISTRY = {
  isValidSerial(serial: string): boolean {
    return /^OTARU-\d{3}-\d{3}$/.test(serial);
  },
};

// Global memory store for OTPs if Redis is offline
const OTP_STORE = new Map<string, { otp: string; expiresAt: number; destination: string }>();

export function storeInMemoryOtp(input: string, otp: string, ttlSeconds = 300) {
  const cleanInput = input.trim().toLowerCase();
  OTP_STORE.set(cleanInput, {
    otp,
    expiresAt: Date.now() + ttlSeconds * 1000,
    destination: cleanInput,
  });
}

export function verifyInMemoryOtp(input: string, candidateOtp: string): boolean {
  const cleanInput = input.trim().toLowerCase();
  const entry = OTP_STORE.get(cleanInput);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    OTP_STORE.delete(cleanInput);
    return false;
  }
  if (entry.otp === candidateOtp.trim()) {
    OTP_STORE.delete(cleanInput);
    return true;
  }
  return false;
}

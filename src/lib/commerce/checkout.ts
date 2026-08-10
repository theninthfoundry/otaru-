/**
 * OTARU — Commerce Domain: Checkout Service
 */
export async function createCheckoutSession(cart: Record<string, unknown>) {
  return { id: 'session_mock_' + Date.now(), cart };
}

/**
 * OTARU — Commerce Domain: Orders Service
 */
export async function createOrder(orderData: Record<string, unknown>) {
  return { id: 'order_mock_' + Date.now(), status: 'CREATED', data: orderData };
}

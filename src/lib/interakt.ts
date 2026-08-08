const INTERAKT_API_KEY = process.env.INTERAKT_API_KEY;

interface InteraktNotificationOptions {
  phoneNumber: string;
  customerName: string;
  orderNumber: string;
  templateName: string;
  bodyValues: string[];
}

export async function sendInteraktNotification({
  phoneNumber,
  customerName,
  orderNumber,
  templateName,
  bodyValues,
}: InteraktNotificationOptions): Promise<{ success: boolean; error?: string }> {
  if (!INTERAKT_API_KEY) {
    console.warn(
      `[Interakt WhatsApp Mock] Template: ${templateName} -> ${customerName} (${phoneNumber}) for Order #${orderNumber}`,
      bodyValues,
    );
    return { success: true };
  }

  try {
    const payload = {
      countryCode: '+91',
      phoneNumber: phoneNumber.replace(/^\+91/, '').trim(),
      type: 'Template',
      template: {
        name: templateName,
        languageCode: 'en',
        bodyValues,
      },
    };

    const response = await fetch('https://api.interakt.ai/v1/public/track/users/', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${INTERAKT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Interakt WhatsApp Error]:', errorText);
      return { success: false, error: 'Failed to send WhatsApp message.' };
    }

    return { success: true };
  } catch (error) {
    console.error('[Interakt WhatsApp Exception]:', error);
    return { success: false, error: 'WhatsApp notification failed.' };
  }
}

export async function sendOrderConfirmationWhatsApp(
  phoneNumber: string,
  customerName: string,
  orderNumber: string,
  totalAmount: string,
) {
  return sendInteraktNotification({
    phoneNumber,
    customerName,
    orderNumber,
    templateName: 'otaru_order_confirmation',
    bodyValues: [customerName, orderNumber, totalAmount],
  });
}

export async function sendShippingUpdateWhatsApp(
  phoneNumber: string,
  customerName: string,
  orderNumber: string,
  trackingUrl: string,
  courierName: string,
) {
  return sendInteraktNotification({
    phoneNumber,
    customerName,
    orderNumber,
    templateName: 'otaru_shipping_update',
    bodyValues: [customerName, orderNumber, courierName, trackingUrl],
  });
}

export async function sendDeliveryWhatsApp(
  phoneNumber: string,
  customerName: string,
  orderNumber: string,
) {
  return sendInteraktNotification({
    phoneNumber,
    customerName,
    orderNumber,
    templateName: 'otaru_delivery_confirmation',
    bodyValues: [customerName, orderNumber],
  });
}

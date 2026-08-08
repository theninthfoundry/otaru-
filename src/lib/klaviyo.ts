const KLAVIYO_PRIVATE_API_KEY = process.env.KLAVIYO_PRIVATE_API_KEY;
const KLAVIYO_PUBLIC_API_KEY = process.env.KLAVIYO_PUBLIC_API_KEY;
export const KLAVIYO_NEWSLETTER_LIST_ID = process.env.KLAVIYO_NEWSLETTER_LIST_ID ?? '';

interface SubscribeOptions {
  email: string;
  listId?: string;
  customProperties?: Record<string, unknown>;
}

interface TrackEventOptions {
  eventName: string;
  email: string;
  properties?: Record<string, unknown>;
}

export async function subscribeProfileToList({
  email,
  listId = KLAVIYO_NEWSLETTER_LIST_ID,
  customProperties = {},
}: SubscribeOptions): Promise<{ success: boolean; error?: string }> {
  if (!KLAVIYO_PRIVATE_API_KEY) {
    console.warn(
      `[Klaviyo] Private API key not configured. Mock subscribing email: ${email} to list: ${listId}`,
    );
    return { success: true };
  }

  if (!listId) {
    console.warn('[Klaviyo] Newsletter list ID is not configured.');
    return { success: false, error: 'List ID missing.' };
  }

  try {
    const payload = {
      data: {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          profiles: {
            data: [
              {
                type: 'profile',
                attributes: {
                  email,
                  properties: customProperties,
                },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: {
              type: 'list',
              id: listId,
            },
          },
        },
      },
    };

    const response = await fetch(
      'https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/',
      {
        method: 'POST',
        headers: {
          Authorization: `Klaviyo-API-Key ${KLAVIYO_PRIVATE_API_KEY}`,
          accept: 'application/json',
          'content-type': 'application/json',
          revision: '2024-02-15',
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Klaviyo API Error]:', errorText);
      return { success: false, error: 'Subscription failed with Klaviyo API.' };
    }

    return { success: true };
  } catch (error) {
    console.error('[Klaviyo Exception]:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during subscription.',
    };
  }
}

export async function trackKlaviyoEvent({
  eventName,
  email,
  properties = {},
}: TrackEventOptions): Promise<void> {
  const apiKey = KLAVIYO_PRIVATE_API_KEY || KLAVIYO_PUBLIC_API_KEY;

  if (!apiKey) {
    console.warn(
      `[Klaviyo Event Mock] ${eventName} for ${email}:`,
      properties,
    );
    return;
  }

  try {
    const payload = {
      data: {
        type: 'event',
        attributes: {
          metric: {
            data: {
              type: 'metric',
              attributes: {
                name: eventName,
              },
            },
          },
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email,
              },
            },
          },
          properties,
          time: new Date().toISOString(),
        },
      },
    };

    await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        accept: 'application/json',
        'content-type': 'application/json',
        revision: '2024-02-15',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(`[Klaviyo Event Error (${eventName})]:`, error);
  }
}

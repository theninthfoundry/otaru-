"use server";

interface WaitlistResult {
  success: boolean;
  error?: string;
}

/** Registers a Drop waitlist entry with Klaviyo, plus an Interakt WhatsApp opt-in. */
export async function joinWaitlistAction(
  email: string,
  dropSlug: string,
  phone?: string
): Promise<WaitlistResult> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Enter a valid email address." };
  }

  const klaviyoKey = process.env.KLAVIYO_PRIVATE_KEY;
  const interaktKey = process.env.INTERAKT_API_KEY;

  if (!klaviyoKey) {
    console.warn("[waitlist] KLAVIYO_PRIVATE_KEY not set — simulating success in dev.");
    return { success: true };
  }

  try {
    await fetch("https://a.klaviyo.com/api/events/", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${klaviyoKey}`,
        "Content-Type": "application/json",
        revision: "2024-10-15",
      },
      body: JSON.stringify({
        data: {
          type: "event",
          attributes: {
            profile: { data: { type: "profile", attributes: { email, phone_number: phone } } },
            metric: { data: { type: "metric", attributes: { name: "Joined Drop Waitlist" } } },
            properties: { dropSlug },
          },
        },
      }),
    });

    if (interaktKey && phone) {
      await fetch("https://api.interakt.ai/v1/public/track/users/", {
        method: "POST",
        headers: { Authorization: `Basic ${interaktKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, event: "drop_waitlist_joined", traits: { email, dropSlug } }),
      });
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Could not join the waitlist right now. Please try again." };
  }
}

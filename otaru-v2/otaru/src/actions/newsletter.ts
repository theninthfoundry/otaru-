"use server";

interface NewsletterResult {
  success: boolean;
  error?: string;
}

/** Registers an email with Klaviyo. Requires KLAVIYO_PRIVATE_KEY. */
export async function subscribeNewsletterAction(email: string): Promise<NewsletterResult> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Enter a valid email address." };
  }

  const apiKey = process.env.KLAVIYO_PRIVATE_KEY;
  if (!apiKey) {
    console.warn("[newsletter] KLAVIYO_PRIVATE_KEY not set — simulating success in dev.");
    return { success: true };
  }

  try {
    const res = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        "Content-Type": "application/json",
        revision: "2024-10-15",
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: { profiles: { data: [{ type: "profile", attributes: { email } }] } },
        },
      }),
    });
    if (!res.ok) throw new Error(`Klaviyo error: ${res.status}`);
    return { success: true };
  } catch (err) {
    return { success: false, error: "Could not subscribe right now. Please try again." };
  }
}

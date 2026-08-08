import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().optional().default('https://otaru.in'),
  SHOPIFY_STORE_DOMAIN: z.string().optional().default('otaru.myshopify.com'),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: z.string().optional(),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional().default('otaru-project'),
  NEXT_PUBLIC_SANITY_DATASET: z.string().optional().default('production'),

  NEXT_PUBLIC_GA4_ID: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_CLARITY_ID: z.string().optional(),
  KLAVIYO_PRIVATE_API_KEY: z.string().optional(),
  KLAVIYO_PUBLIC_API_KEY: z.string().optional(),
  KLAVIYO_NEWSLETTER_LIST_ID: z.string().optional(),

  SHIPROCKET_EMAIL: z.string().optional(),
  SHIPROCKET_PASSWORD: z.string().optional(),
  INTERAKT_API_KEY: z.string().optional(),
  SHOPIFY_REVALIDATION_SECRET: z.string().optional(),
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

export type Env = any;

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('[Environment Validation Failed]:', result.error.format());
    return process.env as unknown as Env;
  }

  const env = result.data;

  if (!env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    console.warn('[Otaru Environment Warning]: SHOPIFY_STOREFRONT_ACCESS_TOKEN is missing. Mock fallback data will be used.');
  }

  if (!env.KLAVIYO_PRIVATE_API_KEY) {
    console.info('[Otaru Environment Info]: KLAVIYO_PRIVATE_API_KEY is not set. Subscriptions will be logged to console.');
  }

  if (!env.SHIPROCKET_EMAIL) {
    console.info('[Otaru Environment Info]: SHIPROCKET_EMAIL is not set. Order tracking will run in mock mode.');
  }

  if (!env.INTERAKT_API_KEY) {
    console.info('[Otaru Environment Info]: INTERAKT_API_KEY is not set. WhatsApp notifications will be logged to console.');
  }

  return env;
}

export const env = validateEnv();

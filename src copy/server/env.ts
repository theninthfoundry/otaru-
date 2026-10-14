import 'server-only';
import { z } from 'zod';

const intFromEnv = (def: number) =>
  z
    .string()
    .optional()
    .transform((v) => (v === undefined || v === '' ? def : Number(v)))
    .pipe(z.number().int().nonnegative());

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  DATABASE_URL: z.string().min(1),
  DIRECT_DATABASE_URL: z.string().optional(),

  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  RAZORPAY_KEY_ID: z.string().regex(/^rzp_(test|live)_/, 'must start with rzp_test_ or rzp_live_'),
  RAZORPAY_KEY_SECRET: z.string().min(8),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(8),

  CRON_SECRET: z.string().min(16).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().optional(),

  // Interpretation (reconcile with any existing use of this flag):
  // in production, refuse test keys and refuse to run without a rate limiter.
  STRICT_PAYMENT_MODE: z.enum(['true', 'false']).default('true'),

  // Business rules — set these to match the storefront's free-shipping progress bar.
  ORDER_HOLD_MINUTES: intFromEnv(20),
  SHIPPING_FLAT_PAISE: intFromEnv(0),
  FREE_SHIPPING_THRESHOLD_PAISE: intFromEnv(0), // 0 => no threshold (flat rate always applies)
});

export type Env = z.infer<typeof schema>;
let cached: Env | undefined;

/** Lazy + memoised so `next build` does not need runtime secrets. Never echoes values. */
export function env(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Invalid server environment — ${msg}`);
  }
  const e = parsed.data;
  if (e.NODE_ENV === 'production' && e.STRICT_PAYMENT_MODE === 'true') {
    if (e.RAZORPAY_KEY_ID.startsWith('rzp_test_')) {
      throw new Error('STRICT_PAYMENT_MODE: refusing to run production with Razorpay test keys');
    }
  }
  cached = e;
  return e;
}

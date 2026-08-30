import { z } from 'zod';

const AMOUNT_MIN = 0.5;
const AMOUNT_MAX = 500_000;

const EmailSchema = z
  .string()
  .trim()
  .email('Invalid email address.')
  .max(254, 'Email exceeds maximum length.');

const NameSchema = z
  .string()
  .trim()
  .min(1, 'Name cannot be empty.')
  .max(100, 'Name exceeds maximum length.')
  .regex(/^[\p{L}\p{M}'\- ]+$/u, 'Name contains invalid characters.');

const AmountSchema = z
  .number()
  .finite('Amount must be a finite number.')
  .positive('Amount must be greater than zero.')
  .min(AMOUNT_MIN, `Amount must be at least ${AMOUNT_MIN}.`)
  .max(AMOUNT_MAX, `Amount exceeds maximum allowed value of ${AMOUNT_MAX}.`);

const CurrencySchema = z
  .string()
  .length(3, 'Currency must be a 3-letter ISO code.')
  .toUpperCase();

const RazorpayOrderIdSchema = z
  .string()
  .regex(/^(order_[A-Za-z0-9_-]+|OTARU-REG-.*)$/, 'Invalid Razorpay order ID format.');

const RazorpayPaymentIdSchema = z
  .string()
  .regex(/^(pay_[A-Za-z0-9_-]+)$/, 'Invalid Razorpay payment ID format.');

const RazorpaySignatureSchema = z
  .string()
  .min(1, 'Signature cannot be empty.')
  .max(256, 'Signature too long.');

const CartLineSchema = z.object({
  id: z.string().optional(),
  quantity: z.number().int().positive().max(100),
  cost: z.object({
    totalAmount: z.object({
      amount: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid amount format.'),
      currencyCode: CurrencySchema,
    }),
  }),
  merchandise: z.object({
    id: z.string().optional(),
    price: z.object({
      amount: z.string().optional(),
    }).optional(),
    product: z.object({
      id: z.string().optional(),
      title: z.string().optional(),
      featuredImage: z.object({ url: z.string().url() }).optional(),
    }).optional(),
    title: z.string().optional(),
  }).optional(),
}).passthrough();

export const OrderRequestSchema = z.object({
  cart: z.object({
    lines: z.array(CartLineSchema).min(1, 'Cart cannot be empty.').max(50, 'Cart has too many items.'),
    cost: z.object({
      subtotalAmount: z.object({
        currencyCode: CurrencySchema,
        amount: z.string().optional(),
      }),
    }).optional(),
  }),
  customer: z.object({
    email: EmailSchema,
    firstName: NameSchema,
    lastName: NameSchema,
    address: z.string().trim().min(1).max(300),
    city: z.string().trim().min(1).max(100),
    zip: z.string().trim().min(1).max(20),
  }),
}).strict();

export type OrderRequest = z.infer<typeof OrderRequestSchema>;

export const VerifyRequestSchema = z.object({
  razorpay_order_id: RazorpayOrderIdSchema,
  razorpay_payment_id: z.union([
    RazorpayPaymentIdSchema,
    z.string().regex(/^pay_MOCK_[A-Z0-9]+$/, 'Invalid mock payment ID.'),
  ]),
  razorpay_signature: RazorpaySignatureSchema,
  mock: z.boolean().optional().default(false),
  nonce: z.string().uuid('Nonce must be a valid UUID.').optional(),
  cartToken: z.string().min(10).optional(),
}).strict();

export type VerifyRequest = z.infer<typeof VerifyRequestSchema>;

export const RefundRequestSchema = z.object({
  paymentId: z.string().min(1, 'paymentId is required.').max(100),
  amount: AmountSchema.optional(),
  reason: z.string().trim().max(500).optional(),
}).strict();

export type RefundRequest = z.infer<typeof RefundRequestSchema>;

export type ValidationResult<T> =
  | { success: true; data: T; error?: undefined }
  | { success: false; data?: undefined; error: string; issues: z.ZodIssue[] };

export function validateBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const firstIssue = result.error.issues[0];
  const errorMessage = firstIssue ? `Validation failed: ${firstIssue.path.join('.')} — ${firstIssue.message}` : 'Validation failed';
  return {
    success: false,
    error: errorMessage,
    issues: result.error.issues,
  };
}

/**
 * Legal copy + business identity.
 * Anything marked [CONFIRM] must be replaced with real, verified facts. `npm run build`
 * runs scripts/check-claims.mjs, which fails while any [CONFIRM] remains — by design,
 * so unverified legal details can never ship. Have an Indian lawyer / CA review before launch.
 */
export const business = {
  legalName: '[CONFIRM] Registered legal business name',
  tradingName: 'House of Otaru',
  address: '[CONFIRM] Registered / principal business address',
  email: 'concierge@otaru.in',
  phone: '[CONFIRM] Customer-care phone number',
  hours: '[CONFIRM] Support hours (IST)',
  gstin: '[CONFIRM] GSTIN, or state that the business is not registered',
  grievanceOfficer: {
    name: '[CONFIRM] Grievance Officer name',
    designation: '[CONFIRM] Designation',
    email: '[CONFIRM] Grievance email',
  },
} as const;

export const policySlugs = ['refunds', 'cancellation', 'cookies', 'accessibility', 'grievance', 'contact'] as const;
export type LegalSlug = (typeof policySlugs)[number];

export interface LegalSection {
  heading: string;
  body?: string[];
  list?: string[];
  table?: { head: string[]; rows: string[][] };
}
export interface LegalPolicy {
  slug: LegalSlug;
  title: string;
  eyebrow: string;
  description: string;
  updated: string;
  sections: LegalSection[];
}

const UPDATED = 'October 2026';

export const policies: Record<LegalSlug, LegalPolicy> = {
  refunds: {
    slug: 'refunds',
    title: 'Refund Policy',
    eyebrow: 'Legal archive · Refunds',
    description: 'When House of Otaru issues refunds, how they are paid, and how long they take.',
    updated: UPDATED,
    sections: [
      { heading: 'When a refund is issued', list: [
        'An eligible return is received and inspected (see Returns & Repairs).',
        'An order is cancelled before dispatch (see Cancellation Policy).',
        'An item arrives faulty, damaged, incorrect, or materially different from its description.',
        'We cannot fulfil an order, or a payment was taken twice or taken without an order being created.',
      ] },
      { heading: 'How refunds are paid', body: [
        'Refunds go back to the original payment method through our payment gateway. We do not refund to a different account or method.',
        'We initiate approved refunds within [CONFIRM] working days. After we initiate, your bank or payment provider sets the final timeline; this is usually [CONFIRM] working days.',
      ] },
      { heading: 'Deductions', body: ['We deduct nothing from a refund unless the policy for that item says so before you pay. Any deduction is stated at checkout or on the product page. [CONFIRM] whether any deduction applies.'] },
      { heading: 'Faulty, incorrect or misdescribed items', body: ['These are always eligible, including limited-release pieces. Write to us with your order number and photographs and we will arrange a replacement or refund. Nothing in this policy limits your statutory consumer rights.'] },
      { heading: 'Failed or duplicate payments', body: ['If money left your account but no order was confirmed, the amount is reversed by the gateway or refunded by us. Contact us with the transaction reference if it has not returned within [CONFIRM] working days.'] },
    ],
  },
  cancellation: {
    slug: 'cancellation',
    title: 'Cancellation Policy',
    eyebrow: 'Legal archive · Cancellations',
    description: 'How and when an order with House of Otaru can be cancelled.',
    updated: UPDATED,
    sections: [
      { heading: 'Before dispatch', body: ['You can cancel any order until it is dispatched. Write to us with your order number as soon as possible; a cancelled order is refunded in full under the Refund Policy.'] },
      { heading: 'After dispatch', body: ['Once an order has shipped it cannot be cancelled, but it can be returned under the Returns & Repairs policy.'] },
      { heading: 'Preorder and made-to-order pieces', body: ['[CONFIRM] State whether preorder or made-to-order pieces can be cancelled, until what stage, and whether any amount is retained. This must be shown on the product page before purchase.'] },
      { heading: 'If we cancel', body: ['We may cancel an order if stock is unavailable, a pricing error occurs, or payment cannot be verified. You are told promptly and refunded in full.'] },
    ],
  },
  cookies: {
    slug: 'cookies',
    title: 'Cookies & Tracking',
    eyebrow: 'Legal archive · Cookies',
    description: 'The cookies and third-party services House of Otaru uses, and how to control them.',
    updated: UPDATED,
    sections: [
      { heading: 'Your choice', body: ['Analytics and marketing tools load only after you opt in. Rejecting them is as easy as accepting, and you can change your mind at any time using "Cookie preferences" in the footer.'] },
      { heading: 'What we set', table: { head: ['Category', 'Purpose', 'Services'], rows: [
        ['Essential (always on)', 'Remember your consent choice, your bag, and your sign-in session.', 'First-party cookies and storage'],
        ['Analytics (opt-in)', 'Understand how pages are used so we can improve them.', 'Google Analytics 4, Microsoft Clarity'],
        ['Marketing (opt-in)', 'Measure campaigns on social platforms.', 'Meta Pixel'],
      ] } },
      { heading: 'Other third parties that receive data', table: { head: ['Service', 'Why'], rows: [
        ['Razorpay', 'Payment processing. Card details never reach our servers.'],
        ['Shopify', 'Product catalogue, orders and checkout records.'],
        ['Shiprocket', 'Delivery and tracking.'],
        ['Klaviyo', 'Email, only if you tick the newsletter consent box.'],
        ['Sanity', 'Editorial content management.'],
      ] } },
      { heading: 'Withdrawing consent', body: ['Choosing "Reject non-essential" stops new tracking and clears the analytics and marketing cookies we can reach. Scripts already loaded in an open tab stop on the next page load.'] },
    ],
  },
  accessibility: {
    slug: 'accessibility',
    title: 'Accessibility Statement',
    eyebrow: 'Legal archive · Accessibility',
    description: 'Our accessibility commitments for houseofotaru and how to report a barrier.',
    updated: UPDATED,
    sections: [
      { heading: 'Our aim', body: ['We aim to meet WCAG 2.2 Level AA. We have not yet completed an independent accessibility audit, so we do not claim conformance.'] },
      { heading: 'What we do', list: [
        'Text and controls are designed for readable contrast on our dark theme.',
        'Every interactive control is reachable by keyboard and shows a visible focus state.',
        'Meaningful images have descriptive alternative text; decorative ones are hidden from assistive technology.',
        'Animation respects the "reduce motion" setting on your device.',
        'Form fields have visible labels and errors are explained in text.',
      ] },
      { heading: 'Known limitations', body: ['Some editorial and animated sections are still being reviewed against keyboard and screen-reader use. [CONFIRM] update this list after the first audit.'] },
      { heading: 'Report a barrier', body: ['If something is hard to use, write to us at the support address on the Contact page. Tell us the page, your device and what went wrong, and we will respond within [CONFIRM] working days.'] },
    ],
  },
  grievance: {
    slug: 'grievance',
    title: 'Grievance Redressal',
    eyebrow: 'Legal archive · Grievances',
    description: 'How to raise a complaint with House of Otaru and how it is handled.',
    updated: UPDATED,
    sections: [
      { heading: 'Seller details', list: [
        `Legal name: ${business.legalName}`,
        `Brand: ${business.tradingName}`,
        `Address: ${business.address}`,
        `Support email: ${business.email}`,
        `Support phone: ${business.phone}`,
        `GSTIN: ${business.gstin}`,
      ] },
      { heading: 'Grievance Officer', list: [
        `Name: ${business.grievanceOfficer.name}`,
        `Designation: ${business.grievanceOfficer.designation}`,
        `Email: ${business.grievanceOfficer.email}`,
      ] },
      { heading: 'How a complaint is handled', body: [
        'Send your order number and a description of the issue to the Grievance Officer. We acknowledge a complaint within 48 hours and aim to resolve it within one month of receipt, in line with the Consumer Protection (E-Commerce) Rules, 2020. [CONFIRM] with your lawyer.',
      ] },
      { heading: 'If you are not satisfied', body: ['You may contact the National Consumer Helpline on 1915 or through consumerhelpline.gov.in.'] },
    ],
  },
  contact: {
    slug: 'contact',
    title: 'Contact',
    eyebrow: 'The atelier · Contact',
    description: 'Contact details for House of Otaru customer care.',
    updated: UPDATED,
    sections: [
      { heading: 'Customer care', list: [
        `Email: ${business.email}`,
        `Phone: ${business.phone}`,
        `Hours: ${business.hours}`,
      ] },
      { heading: 'Business details', list: [
        `${business.legalName}, trading as ${business.tradingName}`,
        `Address: ${business.address}`,
      ] },
      { heading: 'Before you write', body: ['For an order, include your order number. To check a delivery, use Track Dispatch. For sizing, see the Size Guide. For a complaint, see Grievance Redressal.'] },
    ],
  },
};

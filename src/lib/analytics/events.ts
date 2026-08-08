declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    posthog?: { capture: (event: string, properties?: Record<string, unknown>) => void };
  }
}

export function trackPageView(url: string) {
  if (typeof window === 'undefined') return;
  window.gtag?.('config', process.env.NEXT_PUBLIC_GA4_ID, {
    page_path: url,
  });
  window.fbq?.('track', 'PageView');
  window.posthog?.capture('$pageview');
}

export function trackSearch(query: string) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'search', { search_term: query });
  window.fbq?.('track', 'Search', { search_string: query });
  window.posthog?.capture('search', { query });
}

export function trackFilter(category: string, value: string) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'select_content', {
    content_type: category,
    item_id: value,
  });
  window.posthog?.capture('filter_change', { category, value });
}

export function trackViewItem(artifact: {
  id: string;
  name: string;
  price: string;
  category?: string;
}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'view_item', {
    currency: 'INR',
    value: parseFloat(artifact.price || '0'),
    items: [
      {
        item_id: artifact.id,
        item_name: artifact.name,
        item_category: artifact.category ?? 'Garments',
        price: parseFloat(artifact.price || '0'),
      },
    ],
  });
  window.fbq?.('track', 'ViewContent', {
    content_ids: [artifact.id],
    content_type: 'product',
    value: parseFloat(artifact.price || '0'),
    currency: 'INR',
  });
  window.posthog?.capture('view_item', artifact);
}

export function trackAddToCart(artifact: {
  id: string;
  name: string;
  price: string;
  variant: string;
}) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'add_to_cart', {
    currency: 'INR',
    value: parseFloat(artifact.price || '0'),
    items: [
      {
        item_id: artifact.id,
        item_name: artifact.name,
        item_variant: artifact.variant,
        price: parseFloat(artifact.price || '0'),
        quantity: 1,
      },
    ],
  });
  window.fbq?.('track', 'AddToCart', {
    content_ids: [artifact.id],
    content_type: 'product',
    value: parseFloat(artifact.price || '0'),
    currency: 'INR',
  });
  window.posthog?.capture('add_to_cart', artifact);
}

export function trackBeginCheckout(value: string, itemCount: number) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'begin_checkout', {
    currency: 'INR',
    value: parseFloat(value || '0'),
    items: [],
  });
  window.fbq?.('track', 'InitiateCheckout', {
    num_items: itemCount,
    value: parseFloat(value || '0'),
    currency: 'INR',
  });
  window.posthog?.capture('begin_checkout', {
    value: parseFloat(value || '0'),
    itemCount,
  });
}

export function trackNewsletterSignup() {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'newsletter_signup');
  window.fbq?.('track', 'Lead');
  window.posthog?.capture('newsletter_signup');
}

export function trackWaitlistJoin(chapterSlug: string) {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'waitlist_join', { chapter: chapterSlug });
  window.fbq?.('trackCustom', 'WaitlistJoin', { chapter: chapterSlug });
  window.posthog?.capture('waitlist_join', { chapter: chapterSlug });
}

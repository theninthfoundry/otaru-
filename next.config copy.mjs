const isProd = process.env.NODE_ENV === 'production';
const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

/**
 * NOTE: the previous version of this file copied hero images from a local
 * Windows path into /public at config-load time. That leaked a local username,
 * made builds non-deterministic and silently produced a site with no hero image
 * on any other machine / CI. Commit the image to public/images/hero/ instead.
 *
 * Content-Security-Policy is NOT set here. It is built per-request in
 * src/middleware.ts (nonce on payment surfaces, baseline elsewhere).
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,

  env: {
    FEATURE_FULL_ARCHIVE: process.env.FEATURE_FULL_ARCHIVE || 'true',
    FEATURE_COMMERCE: process.env.FEATURE_COMMERCE || 'true',
    FEATURE_MEMBERSHIP: process.env.FEATURE_MEMBERSHIP || 'true',
    FEATURE_AUTH: process.env.FEATURE_AUTH || 'true',
    FEATURE_TRACKING: process.env.FEATURE_TRACKING || 'true',
  },

  // null => Next generates a unique id. The old constant fallback meant every
  // non-Vercel build shared one build id (stale chunks / version skew).
  generateBuildId: async () =>
    process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || null,

  experimental: {
    webpackBuildWorker: false,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/s/files/**' },
      ...(sanityProjectId
        ? [{ protocol: 'https', hostname: 'cdn.sanity.io', pathname: `/images/${sanityProjectId}/**` }]
        : []),
      // Dev-only placeholders. Wildcard third-party hosts in production let
      // anyone proxy arbitrary images through your image optimizer (cost/abuse).
      ...(isProd
        ? []
        : [
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
          ]),
    ],
  },

  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, max-age=0' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // allow-popups: UPI / 3-D Secure flows may open a popup that must keep an opener.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=(), ' +
              'payment=(self "https://api.razorpay.com" "https://checkout.razorpay.com"), fullscreen=(self)',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  env: {
    FEATURE_FULL_ARCHIVE: process.env.FEATURE_FULL_ARCHIVE || 'true',
    FEATURE_COMMERCE: process.env.FEATURE_COMMERCE || 'true',
    FEATURE_MEMBERSHIP: process.env.FEATURE_MEMBERSHIP || 'true',
    FEATURE_AUTH: process.env.FEATURE_AUTH || 'true',
    FEATURE_TRACKING: process.env.FEATURE_TRACKING || 'true',
  },
  generateBuildId: async () => {
    return (
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
      process.env.BUILD_ID ||
      `otaru-${Date.now()}`
    );
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, max-age=0' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(self "https://api.razorpay.com" "https://checkout.razorpay.com"), clipboard-read=(self), clipboard-write=(self), fullscreen=(self)' },
        ],
      },
    ];
  },
};

export default nextConfig;

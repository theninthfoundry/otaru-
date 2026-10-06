import fs from 'fs';
import path from 'path';

// Synchronize hero image to public/images/hero on config load
try {
  const sourceCandidates = [
    'C:/Users/namir/.gemini/antigravity-ide/brain/d99372f4-137f-400c-8ca7-53cfb22560ee/.tempmediaStorage/media_1791313662732.jpg',
    'C:/Users/namir/.gemini/antigravity-ide/brain/4bc2bd3d-ccb4-4fd5-a1fa-496dd5ca5dd9/atelier_indigo_hero_1791225223047.jpg',
  ];
  const targetDir = path.join(process.cwd(), 'public', 'images', 'hero');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  for (const src of sourceCandidates) {
    if (fs.existsSync(src)) {
      const buf = fs.readFileSync(src);
      fs.writeFileSync(path.join(targetDir, 'hero-atelier.jpg'), buf);
      fs.writeFileSync(path.join(targetDir, 'atelier-indigo.jpg'), buf);
      break;
    }
  }
} catch (e) {
  // Ignore sync error in constrained environments
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    FEATURE_FULL_ARCHIVE: process.env.FEATURE_FULL_ARCHIVE || 'false',
    FEATURE_COMMERCE: process.env.FEATURE_COMMERCE || 'false',
    FEATURE_MEMBERSHIP: process.env.FEATURE_MEMBERSHIP || 'false',
    FEATURE_AUTH: process.env.FEATURE_AUTH || 'false',
    FEATURE_TRACKING: process.env.FEATURE_TRACKING || 'false',
  },
  generateBuildId: async () => {
    return process.env.VERCEL_GIT_COMMIT_SHA || process.env.BUILD_ID || 'otaru-v2.0-two-harbours';
  },
  experimental: {
    webpackBuildWorker: false,
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
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
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
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
        ],
      },
    ];
  },
};

export default nextConfig;

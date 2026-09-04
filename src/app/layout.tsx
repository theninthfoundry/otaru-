import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import { CurrencyProvider } from '@/lib/currency';
import { SizeGuideProvider } from '@/lib/size-guide';
import { AuthProvider } from '@/context/auth-context';
import { AuthModal } from '@/components/auth/AuthModal';
import { MaterialInspectorProvider } from '@/components/ui/MaterialInspectorModal';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/search/SearchModal';
import { SizeGuideModal } from '@/components/ui/SizeGuideModal';
import { MoonProgress } from '@/components/ui/MoonProgress';
import { ArchiveTextureOverlay } from '@/components/ui/ArchiveTextureOverlay';
import { ArchivePageTransition } from '@/components/ui/ArchivePageTransition';
import { StudioStatusBar } from '@/components/ui/StudioStatusBar';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://otaru.in',
  ),
  title: {
    default: 'Otaru — Living Image Archive',
    template: '%s | Otaru',
  },
  description:
    'A living image archive. Limited-run, design-led garments built from exceptional raw textiles, precise architectural cuts, and permanent intention.',
  keywords: [
    'Otaru',
    'garments',
    'craftsmanship',
    'living image archive',
    'limited edition',
    'design house',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Otaru',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <head>
        {/* Enforce permanent suppression of any custom cursor follower overlays */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .archival-cursor-wrapper,
              [class*="archival-cursor"],
              [class*="custom-cursor"],
              [data-cursor-dot],
              [data-cursor-ring] {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
                width: 0 !important;
                height: 0 !important;
              }
            `,
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ArchiveTextureOverlay />
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <SizeGuideProvider>
                <MaterialInspectorProvider>
                  <SiteHeader />
                  <ArchivePageTransition>
                    <main id="main">{children}</main>
                  </ArchivePageTransition>
                  <SiteFooter />
                  <StudioStatusBar />
                  <CartDrawer />
                  <SearchModal />
                  <SizeGuideModal />
                  <AuthModal />
                  <MoonProgress />
                </MaterialInspectorProvider>
              </SizeGuideProvider>
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

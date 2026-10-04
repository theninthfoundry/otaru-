import type { Metadata } from 'next';
import { Fraunces, Hanken_Grotesk, DM_Mono, Tiro_Devanagari_Hindi } from 'next/font/google';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import '@/styles/globals.css';
import { site } from '../../content/site';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const dm_mono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

const tiro = Tiro_Devanagari_Hindi({
  weight: ['400'],
  subsets: ['latin', 'devanagari'],
  display: 'swap',
  variable: '--font-devanagari',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://otaru.in',
  ),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  robots: {
    index: true,
    follow: true,
  },
};

import { AppProviders } from '@/components/providers/AppProviders';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable} ${dm_mono.variable} ${tiro.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <AppProviders>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}

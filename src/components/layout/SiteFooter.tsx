import React from 'react';
import Link from 'next/link';
import { site } from '../../../content/site';
import { strings } from '../../../content/strings';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-paper-2 border-t border-hairline py-16 md:py-24">
      <div className="wrap">
        <div className="grid-otaru">
          
          {/* Lockup */}
          <div className="col-span-full md:col-span-4 mb-12 md:mb-0">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-display text-3xl text-ink/20">{strings.ja.house}</span>
              <span className="w-px h-8 bg-hairline" />
              <span className="font-devanagari text-4xl text-ink/20">{strings.hi.house}</span>
            </div>
            <p className="caption text-ink/50 max-w-[20ch]">
              {site.description}
            </p>
          </div>

          {/* Social / Contact */}
          <div className="col-span-6 md:col-span-4 mb-8 md:mb-0">
            <h4 className="caption text-ink/40 mb-6">Connect</h4>
            <ul className="space-y-4 font-mono text-sm">
              <li>
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-madder transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href={`mailto:${site.founder.email}`} className="hover:text-madder transition-colors">
                  Email Studio
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Info */}
          <div className="col-span-6 md:col-span-4">
            <h4 className="caption text-ink/40 mb-6">Information</h4>
            <ul className="space-y-4 font-mono text-sm">
              <li>
                <Link href="/shipping-exchanges" className="hover:text-madder transition-colors">
                  Shipping & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-madder transition-colors">
                  Indian Size Guide
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-madder transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-madder transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-8 border-t border-hairline flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="caption text-ink/40">
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p className="caption text-ink/30">
            {site.legal.trademark}
          </p>
        </div>
      </div>
    </footer>
  );
}

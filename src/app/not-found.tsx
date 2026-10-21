import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'This path has grown over. Return to the House of Otaru archive.',
  robots: { index: false, follow: true },
};

const ways = [
  { href: '/archive', label: 'Enter the archive', primary: true },
  { href: '/chapters', label: 'Chapters' },
  { href: '/track-order', label: 'Track dispatch' },
  { href: '/contact', label: 'Contact' },
];

export default function NotFound() {
  return (
    <section className={styles.stage} aria-labelledby="nf-title">
      <Image
        src="/images/404/wanderer.jpg"
        alt="A lone wanderer in a straw hat stands on a windswept green ridge above misty valleys."
        fill
        priority
        sizes="100vw"
        className={styles.photo}
      />
      <div className={styles.veil} aria-hidden="true" />

      <svg className={styles.frame} width="100%" height="100%" aria-hidden="true" focusable="false">
        <rect x="0.5" y="0.5" width="99.8%" height="99.6%" rx="2" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeDasharray="8 6" strokeLinecap="round" />
      </svg>
      <div className={styles.wind} aria-hidden="true"><i /><i /><i /></div>
      <div className={styles.numerals} lang="ja" aria-hidden="true">四〇四</div>
      <div className={styles.seal} lang="ja" aria-hidden="true">迷</div>

      <div className={styles.copy}>
        <p className={styles.kicker}>
          <span lang="ja">道に迷う</span> &nbsp;·&nbsp; 404
        </p>
        <h1 id="nf-title" className={styles.title}>This path has grown over.</h1>
        <p className={styles.verse}>
          Wind through the tall grass —<br />
          the road you followed is gone,<br />
          the hill remains.
        </p>
        <p className={styles.lede}>
          The page you were walking toward is not in the archive. It may have moved, ended its run, or never existed.
        </p>
        <nav className={styles.actions} aria-label="Ways back">
          {ways.map((w) => (
            <Link key={w.href} href={w.href} className={`${styles.btn} ${w.primary ? styles.btnPrimary : ''}`}>
              {w.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}

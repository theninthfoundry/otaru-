import Link from 'next/link';
import type { LegalPolicy } from '../../../content/legal';

const RELATED: { href: string; label: string }[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/shipping-exchanges', label: 'Shipping' },
  { href: '/returns', label: 'Returns & Repairs' },
  { href: '/refunds', label: 'Refunds' },
  { href: '/cancellation', label: 'Cancellation' },
  { href: '/cookies', label: 'Cookies' },
  { href: '/accessibility', label: 'Accessibility' },
  { href: '/grievance', label: 'Grievances' },
  { href: '/contact', label: 'Contact' },
];

export function LegalDocument({ policy }: { policy: LegalPolicy }) {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] pt-32 pb-28">
      <div className="wrap max-w-3xl mx-auto px-6">
        <header className="border-b border-hairline pb-8 mb-12">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--ink-muted)] block mb-3">
            {policy.eyebrow}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl tracking-tight mb-4">{policy.title}</h1>
          <p className="font-mono text-xs text-[var(--ink-muted)] uppercase tracking-wider">
            Last updated {policy.updated}
          </p>
        </header>

        <div className="space-y-10 text-sm sm:text-[15px] leading-relaxed text-[var(--ink)]/80">
          {policy.sections.map((s) => (
            <section key={s.heading} className="space-y-3">
              <h2 className="font-display text-xl text-[var(--ink)]">{s.heading}</h2>
              {s.body?.map((p) => <p key={p}>{p}</p>)}
              {s.list && (
                <ul className="list-disc pl-5 space-y-1.5">
                  {s.list.map((li) => <li key={li}>{li}</li>)}
                </ul>
              )}
              {s.table && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px] border-collapse">
                    <thead>
                      <tr>
                        {s.table.head.map((h) => (
                          <th key={h} scope="col" className="border-b border-hairline py-2 pr-4 font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((r) => (
                        <tr key={r.join('|')}>
                          {r.map((c, i) => <td key={`${c}-${i}`} className="border-b border-hairline py-2.5 pr-4 align-top">{c}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>

        <nav aria-label="Policies" className="mt-16 pt-8 border-t border-hairline flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider">
          {RELATED.map((r) => (
            <Link key={r.href} href={r.href} className="text-[var(--ink-muted)] hover:text-[var(--ink)] focus-visible:text-[var(--ink)] underline-offset-4 hover:underline">
              {r.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

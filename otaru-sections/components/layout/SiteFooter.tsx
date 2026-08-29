import Link from "next/link";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Archive",
    links: [
      { label: "New Drops", href: "/archive?sort=new" },
      { label: "Chapters", href: "/chapters" },
      { label: "Outerwear", href: "/archive?category=outerwear" },
      { label: "Accessories", href: "/archive?category=accessories" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "About", href: "/studio" },
      { label: "Journal", href: "/journal" },
      { label: "Careers", href: "/studio/careers" },
      { label: "Verify a Piece", href: "/verify" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Track an Order", href: "/track-order" },
      { label: "Returns", href: "/returns" },
      { label: "Care Guide", href: "/journal/care" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/sign-in" },
      { label: "Your Profile", href: "/profile" },
      { label: "Membership", href: "/membership" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--otaru-line)] bg-[var(--otaru-ink)] pb-8 pt-16">
      <div className="mx-auto max-w-[1360px] px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="font-display text-2xl italic text-[var(--otaru-parchment)]">
              Otaru
            </Link>
            <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-[var(--otaru-parchment-dim)]">
              A living image archive. Water, timber, cloth, and the objects that pass through them.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-[0.7rem] uppercase tracking-[0.12em] text-[var(--otaru-gold-dim)]">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--otaru-parchment-dim)] transition-colors hover:text-[var(--otaru-parchment)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--otaru-line)] pt-6 text-[0.72rem] uppercase tracking-[0.06em] text-[var(--otaru-horizon)]">
          <span>© {new Date().getFullYear()} Otaru Design House</span>
          <span>Kyoto · Tokyo · Otaru</span>
          <span className="flex gap-6">
            <Link href="/privacy" className="hover:text-[var(--otaru-parchment-dim)]">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--otaru-parchment-dim)]">Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

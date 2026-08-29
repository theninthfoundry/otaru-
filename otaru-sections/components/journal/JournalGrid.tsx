import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export type JournalPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
};

export function JournalGrid({ featured, posts }: { featured: JournalPost; posts: JournalPost[] }) {
  return (
    <>
      <Link href={featured.href} className="group mt-10 grid grid-cols-1 gap-8 border-b border-[var(--otaru-line)] pb-12 md:grid-cols-2 md:gap-14">
        <ImagePlaceholder ratio="wide" label="Featured — 1600×1000" />
        <div className="flex flex-col justify-center">
          <p className="text-[0.7rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment-dim)]">{featured.date}</p>
          <h2 className="mt-2 font-display text-[clamp(1.6rem,3vw,2.3rem)] leading-snug text-[var(--otaru-parchment)]">
            {featured.title}
          </h2>
          <p className="mt-3 max-w-[46ch] leading-relaxed text-[var(--otaru-parchment-dim)]">{featured.excerpt}</p>
          <span className="mt-4 inline-flex w-fit items-center gap-2 border-b border-[var(--otaru-gold-dim)] pb-1 text-[0.78rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment)] transition-[gap] group-hover:gap-3">
            Read the entry <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>

      <ul className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id} className="list-none">
            <Link href={post.href} className="group block">
              <ImagePlaceholder ratio="wide" label="Journal — 800×500" />
              <p className="mt-4 text-[0.68rem] uppercase tracking-[0.1em] text-[var(--otaru-parchment-dim)]">{post.date}</p>
              <h3 className="mt-1.5 font-display text-[1.2rem] leading-snug text-[var(--otaru-parchment)]">{post.title}</h3>
              <p className="mt-2 text-[0.86rem] leading-relaxed text-[var(--otaru-parchment-dim)]">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

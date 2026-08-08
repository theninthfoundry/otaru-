import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity-image";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="font-display text-display-sm mt-12 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="font-display text-display-sm/tight mt-8 mb-3">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-otaru-ink pl-6 my-8 font-display text-display-sm/tight italic text-foreground-muted">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="text-body-md leading-relaxed mb-6 text-foreground">{children}</p>,
  },
  types: {
    image: ({ value }) => {
      const url = urlForImage(value)?.width(1600).url();
      if (!url) return null;
      return (
        <div className="relative aspect-[4/3] my-10 overflow-hidden rounded-sm bg-surface-alt">
          <Image src={url} alt={value.alt ?? ""} fill sizes="(min-width: 1024px) 800px, 100vw" className="object-cover" />
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="underline underline-offset-4" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export function PortableTextRenderer({ blocks }: { blocks: unknown[] }) {
  if (!blocks || blocks.length === 0) {
    return <p className="text-body-md text-foreground-muted">This entry has no published body yet.</p>;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PortableText value={blocks as any} components={components} />;
}

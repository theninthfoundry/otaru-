import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-8 md:mb-12", className)}>
      {eyebrow && <p className="otaru-eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-display text-display-sm md:text-display-md leading-tight text-foreground">{title}</h2>
    </div>
  );
}

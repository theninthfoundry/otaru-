import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Otaru image component — wrapper around next/image
 * with consistent aspect ratios and loading patterns.
 */
interface OtaruImageProps extends Omit<NextImageProps, 'alt'> {
  alt: string;
  aspect?: 'product' | 'landscape' | 'square' | 'portrait';
}

const aspectClasses = {
  product: 'aspect-[3/4]',
  landscape: 'aspect-[16/9]',
  square: 'aspect-square',
  portrait: 'aspect-[2/3]',
} as const;

export function OtaruImage({
  alt,
  aspect = 'product',
  className,
  ...props
}: OtaruImageProps) {
  return (
    <div className={cn('overflow-hidden bg-otaru-cream', aspectClasses[aspect], className)}>
      <NextImage
        alt={alt}
        className="h-full w-full object-cover"
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
        {...props}
      />
    </div>
  );
}

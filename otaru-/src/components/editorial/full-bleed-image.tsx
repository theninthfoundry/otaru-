interface FullBleedImageProps {
  url: string;
  alt?: string;
  caption?: string;
}

export function FullBleedImage({ url, alt = '', caption }: FullBleedImageProps) {
  return (
    <figure className="w-screen relative left-1/2 right-1/2 -mx-[50vw] my-12 md:my-20">
      <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-otaru-cream overflow-hidden">
        <img
          src={url}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="grid-container max-w-5xl mt-3 text-caption text-otaru-ink-subtle text-xs italic text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

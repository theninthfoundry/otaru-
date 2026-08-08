interface ImageItem {
  url: string;
  alt?: string;
  caption?: string;
}

interface ImageMasonryProps {
  images: ImageItem[];
  title?: string;
}

export function ImageMasonry({ images, title }: ImageMasonryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="my-12 md:my-16 space-y-6">
      {title && (
        <h3 className="text-heading-sm font-semibold tracking-tight text-otaru-ink">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {images.map((img, index) => (
          <figure
            key={index}
            className={`group relative overflow-hidden bg-otaru-cream rounded-sm ${
              index % 3 === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
            }`}
          >
            <img
              src={img.url}
              alt={img.alt ?? `Editorial Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            {img.caption && (
              <figcaption className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-otaru-ink/80 to-transparent text-otaru-chalk text-caption text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

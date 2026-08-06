import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductByHandle, getProductRecommendations } from '@/lib/shopify/queries/products';
import { generateProductJsonLd } from '@/lib/seo/structured-data';
import { formatPrice } from '@/lib/utils';
import { ArtifactGallery } from '@/components/artifact/artifact-gallery';
import { Artifact3DViewer } from '@/components/three/artifact-3d-viewer';
import { ProductForm } from '@/components/artifact/product-form';
import { ProductAccordion } from '@/components/artifact/product-accordion';
import { ArtifactCard } from '@/components/artifact/artifact-card';

interface ArtifactPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({
  params,
}: ArtifactPageProps): Promise<Metadata> {
  const { handle } = await params;
  const artifact = await getProductByHandle(handle);

  if (!artifact) return { title: 'Artifact Not Found' };

  const displayName = artifact.artifactName
    ? `Artifact ${artifact.artifactNumber} — "${artifact.artifactName}"`
    : artifact.title;

  return {
    title: `${displayName} | Otaru`,
    description:
      artifact.seo.description ??
      `${artifact.gsm} ${artifact.construction} · ${artifact.wash} · ${artifact.printTechnique}`,
    openGraph: {
      title: displayName,
      description: artifact.seo.description ?? artifact.description,
      images: artifact.featuredImage
        ? [
            {
              url: artifact.featuredImage.url,
              width: artifact.featuredImage.width,
              height: artifact.featuredImage.height,
              alt: artifact.featuredImage.altText ?? displayName,
            },
          ]
        : [],
    },
  };
}

export default async function ArtifactPage({ params }: ArtifactPageProps) {
  const { handle } = await params;

  const artifact = await getProductByHandle(handle);
  if (!artifact) notFound();

  // Fetch recommendations in parallel (non-blocking)
  const recommendations = await getProductRecommendations(artifact.id).catch(
    () => [],
  );

  // JSON-LD structured data
  const jsonLd = generateProductJsonLd(artifact);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article id="artifact-page" itemScope itemType="https://schema.org/Product" className="py-12 md:py-16">
        <div className="grid-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column: Image Gallery + 3D Material Inspection (Span 7) */}
          <section id="artifact-gallery" aria-label="Artifact images" className="lg:col-span-7 space-y-8">
            <ArtifactGallery 
              images={artifact.images} 
              artifactName={artifact.artifactName || artifact.title} 
            />

            {/* 3D WebGL Material Specimen Canvas */}
            <Artifact3DViewer title={artifact.artifactName || artifact.title} tags={artifact.tags} />
          </section>

          {/* Right Column: Details & Purchase Form (Span 5) */}
          <section id="artifact-info" aria-label="Artifact details" className="lg:col-span-5 space-y-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" id="artifact-breadcrumb" className="text-caption text-otaru-ink-subtle text-xs">
              <ol className="flex items-center gap-2">
                <li>
                  <a href="/archive" className="hover:text-otaru-ink transition-colors">Archive</a>
                </li>
                {artifact.chapterId && (
                  <>
                    <li>/</li>
                    <li>
                      <a href={`/chapter/${artifact.chapterId}`} className="hover:text-otaru-ink transition-colors">
                        Chapter
                      </a>
                    </li>
                  </>
                )}
                <li>/</li>
                <li aria-current="page" className="text-otaru-ink font-medium">
                  {artifact.artifactName || artifact.title}
                </li>
              </ol>
            </nav>

            {/* Header */}
            <header className="space-y-1">
              {artifact.artifactNumber ? (
                <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
                  Artifact {artifact.artifactNumber}
                </p>
              ) : (
                <p className="text-overline tracking-widest uppercase text-otaru-ink-subtle text-[11px] font-semibold">
                  Otaru Design House
                </p>
              )}
              <h1 className="text-display-md font-semibold text-otaru-ink tracking-tight" itemProp="name">
                {artifact.artifactName ? `"${artifact.artifactName}"` : artifact.title}
              </h1>
            </header>

            {/* Material Specs */}
            <div id="artifact-specs" className="text-body-sm text-otaru-ink-muted font-light leading-relaxed">
              {artifact.gsm && <span>{artifact.gsm}</span>}
              {artifact.construction && <span> · {artifact.construction}</span>}
              {artifact.wash && <span> · {artifact.wash}</span>}
              {artifact.printTechnique && <span> · {artifact.printTechnique}</span>}
            </div>

            {/* Price */}
            <div id="artifact-price" itemProp="offers" itemScope itemType="https://schema.org/Offer" className="pt-2">
              <meta itemProp="priceCurrency" content={artifact.price.currencyCode} />
              <meta itemProp="price" content={artifact.price.amount} />
              <meta
                itemProp="availability"
                content={
                  artifact.availableForSale
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/SoldOut'
                }
              />
              <p className="text-heading-md font-semibold text-otaru-ink">
                {formatPrice(artifact.price.amount, artifact.price.currencyCode)}
              </p>
            </div>

            {/* Product Form (Variants + Add to Bag) */}
            <ProductForm 
              variants={artifact.variants} 
              productTitle={artifact.artifactName || artifact.title} 
            />

            {/* Product Story Accordions (Specs, Fit, Care) */}
            <ProductAccordion artifact={artifact} />

            {/* Full Description */}
            {artifact.descriptionHtml && (
              <div
                id="artifact-description"
                className="text-body-sm text-otaru-ink-muted pt-4 border-t border-otaru-border/40 font-light leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: artifact.descriptionHtml,
                }}
              />
            )}
          </section>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section id="recommendations" aria-label="You may also like" className="grid-container pt-20 border-t border-otaru-border/40 mt-20 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-md font-semibold text-otaru-ink">
                Related Artifacts
              </h2>
              <a href="/archive" className="text-caption text-otaru-ink-muted hover:text-otaru-ink underline text-xs">
                View Archive
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommendations.slice(0, 4).map((rec) => (
                <ArtifactCard key={rec.id} artifact={rec} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}

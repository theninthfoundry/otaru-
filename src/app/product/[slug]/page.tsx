import React from 'react';
import { drop01 } from '../../../../content/drop01';
import { notFound } from 'next/navigation';
import { Plate } from '@/components/ui/Plate';
import { Stamp } from '@/components/ui/Stamp';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = drop01.products.find(p => p.slug === slug);
  
  if (!product) {
    notFound();
  }

  const numberStr = product.objectNumber.replace(/[^0-9]/g, '');

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="wrap grid-otaru">
        
        {/* Left: Imagery */}
        <div className="col-span-full md:col-span-6 lg:col-span-7 space-y-8">
          <Plate src={product.image} label={`ARTIFACT ${product.objectNumber}`} ratio="portrait" />
          {/* In a full build, this would map over product.images */}
        </div>

        {/* Right: Info */}
        <div className="col-span-full md:col-span-6 lg:col-span-4 lg:col-start-9 flex flex-col pt-12 md:pt-0 sticky top-32 h-fit">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="font-display text-4xl mb-2">{product.name}</h1>
              <p className="font-mono text-ink/60 text-sm tracking-widest uppercase">{product.lane} &middot; {product.material}</p>
            </div>
            <Stamp number={numberStr} total={product.runQuantity} />
          </div>

          <div className="text-xl mb-12">
            ₹{product.priceINR.toLocaleString('en-IN')}
          </div>

          <p className="text-ink/80 leading-relaxed mb-8">
            {product.fitNote}
          </p>

          <button className="btn-primary w-full py-4 text-lg mb-4" disabled>
            Reservations Open Soon
          </button>
          
          <p className="caption text-ink/40 text-center">
            Drop 01 access is limited to Residents.
          </p>

        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { drop01 } from '../../../content/drop01';
import { ProductPlate } from '../ui/ProductPlate';

export function DropSection() {
  return (
    <section className="relative section-pad bg-paper" id="drop-01">
      <div className="wrap">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="caption text-ink/40 mb-4">DROP 01</h2>
            <p className="font-display text-4xl">The First Four.</p>
          </div>
          <div className="font-mono text-sm tracking-widest uppercase text-ink/60">
            Access closes: {drop01.dates.liveEnd}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {drop01.products.map((product) => (
            <ProductPlate key={product.slug} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}

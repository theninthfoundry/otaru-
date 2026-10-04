import React from 'react';
import { Plate } from './Plate';
import { Stamp } from './Stamp';

interface ProductPlateProps {
  product: {
    objectNumber: string;
    name: string;
    priceINR: string | number;
    runQuantity: string | number;
    material: string;
    lane: string;
    image: string;
    slug: string;
  };
}

export function ProductPlate({ product }: ProductPlateProps) {
  // Extract number from "No. 01" string
  const numberStr = product.objectNumber.replace(/[^0-9]/g, '');
  
  return (
    <a href={`/product/${product.slug}`} className="group block">
      <div className="relative">
        <Plate src={product.image} label={`ARTIFACT ${product.objectNumber}`} />
        
        <div className="absolute -bottom-6 -right-4 z-10">
          <Stamp number={numberStr} total={product.runQuantity} />
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="font-display text-2xl">{product.name}</h3>
          <span className="font-mono text-sm tracking-wider">₹{product.priceINR.toLocaleString('en-IN')}</span>
        </div>
        
        <div className="flex gap-4 text-xs text-ink/60 font-mono tracking-widest uppercase">
          <span>{product.lane}</span>
          <span>&middot;</span>
          <span>{product.material}</span>
        </div>
      </div>
    </a>
  );
}

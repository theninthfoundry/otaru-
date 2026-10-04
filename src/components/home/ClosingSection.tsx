import React from 'react';

export function ClosingSection() {
  return (
    <section className="relative section-pad bg-ink text-paper">
      <div className="wrap text-center">
        <h2 className="font-display text-5xl md:text-7xl mb-8 text-paper-2">
          A house between two harbours.
        </h2>
        <p className="font-mono text-sm tracking-widest text-paper/40 uppercase mb-16">
          MMXXVI
        </p>
        
        <div className="inline-block border border-paper/10 p-1">
          <div className="border border-paper/10 px-8 py-12 bg-paper/5">
            <span className="font-devanagari text-4xl text-madder/80 block mb-4">घर</span>
            <span className="font-display text-4xl text-madder/80 block">家</span>
          </div>
        </div>
      </div>
    </section>
  );
}

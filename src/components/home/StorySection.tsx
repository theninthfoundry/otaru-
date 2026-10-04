import React from 'react';

export function StorySection() {
  return (
    <section className="relative section-pad bg-paper-2 border-t border-b border-hairline" id="story">
      <div className="wrap">
        <div className="grid-otaru">
          <div className="col-span-full md:col-span-8 lg:col-span-6 md:col-start-3 lg:col-start-4">
            
            <h2 className="caption text-madder mb-8">THE HOUSE</h2>
            
            <div className="space-y-12">
              <div>
                <h3 className="font-display text-3xl mb-4">Why Otaru?</h3>
                <p className="text-ink/80 text-lg leading-relaxed">
                  Otaru is a port town in Hokkaido that survived by preserving what others tore down. Its stone warehouses, once built for herring and coal, now hold glassworks and time. It is a monument to doing things slowly, permanently, and once.
                </p>
              </div>

              <div>
                <h3 className="font-display text-3xl mb-4">Two Harbours</h3>
                <p className="text-ink/80 text-lg leading-relaxed">
                  We are an Indian design studio obsessed with Japanese restraint. We weave in India, dye in India, and sew in India—but we measure our decisions against the quiet perfectionism of Japanese heritage craft. Two harbours, sharing one water.
                </p>
              </div>

              <blockquote className="border-l-2 border-indigo/20 pl-6 py-2 my-12">
                <p className="font-display text-2xl italic text-indigo">
                  "We do not chase seasons. We chase the right amount of time."
                </p>
              </blockquote>

              <div>
                <h3 className="font-display text-3xl mb-4">The Maker</h3>
                <p className="text-ink/80 text-lg leading-relaxed">
                  Built by [CONFIRM], this house operates without investors, seasons, or mass production lines. Every piece is numbered, documented, and never restocked.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

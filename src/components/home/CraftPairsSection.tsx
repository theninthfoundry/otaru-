'use client';

import React from 'react';
import { craftPairs } from '../../../content/craft-pairs';
import { CraftPair } from '../ui/CraftPair';

export function CraftPairsSection() {
  return (
    <section className="relative section-pad">
      <div className="wrap">
        
        <div className="mb-16">
          <h2 className="caption text-ink/40 mb-4">CRAFT / 理念</h2>
          <p className="font-display text-3xl max-w-2xl">
            Parallel histories. The same pursuit.
          </p>
        </div>

        <div className="border-t border-hairline">
          {craftPairs.map((pair) => (
            <CraftPair
              key={pair.id}
              japanName={pair.japan.name}
              japanDesc={pair.japan.desc}
              indiaName={pair.india.name}
              indiaDesc={pair.india.desc}
              sharedIdea={pair.shared}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

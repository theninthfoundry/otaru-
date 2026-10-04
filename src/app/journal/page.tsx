import React from 'react';
import { FieldNotesSection } from '@/components/home/FieldNotesSection';

export default function JournalPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="wrap mb-16">
        <h1 className="font-display text-5xl mb-4">Field Notes</h1>
        <p className="text-ink/60">An archive of our sourcing trips, dye experiments, and studio process.</p>
      </div>
      <FieldNotesSection />
    </div>
  );
}

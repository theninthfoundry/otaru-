import React from 'react';
import Link from 'next/link';

export function FieldNotesSection() {
  const notes = [
    {
      id: 1,
      date: 'OCT 2026',
      title: 'Dyeing with Madder in Gujarat',
      excerpt: 'The vat requires constant feeding. It is not a chemical equation but a living organism.'
    },
    {
      id: 2,
      date: 'SEP 2026',
      title: 'The Brass Hardware Problem',
      excerpt: 'We rejected three batches of buttons before finding a foundry willing to cast without the anti-tarnish coating.'
    },
    {
      id: 3,
      date: 'AUG 2026',
      title: 'Why We Avoid Elastane',
      excerpt: 'A garment with elastane cannot be recycled, and it cannot be inherited.'
    }
  ];

  return (
    <section className="relative section-pad bg-paper">
      <div className="wrap">
        
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="caption text-ink/40">FIELD NOTES</h2>
          <Link href="/journal" className="caption hover:text-madder transition-colors">
            View Archive →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {notes.map((note) => (
            <Link href="/journal" key={note.id} className="group block border border-hairline bg-paper-2 p-6 hover:border-indigo/30 transition-colors">
              <span className="caption text-madder mb-4 block">{note.date}</span>
              <h3 className="font-display text-xl mb-3 group-hover:text-indigo transition-colors">{note.title}</h3>
              <p className="text-sm text-ink/70 leading-relaxed">{note.excerpt}</p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

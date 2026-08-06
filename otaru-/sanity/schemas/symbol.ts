/**
 * OTARU — Sanity Symbol Schema
 *
 * The seven-symbol arc (§1.8):
 * Origin → Growth → Decay → Reflection → Memory → Motion → Silence
 */

import { defineType, defineField } from 'sanity';

export const symbol = defineType({
  name: 'symbol',
  title: 'Symbol',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g., Origin, Growth, Decay…',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order in Sequence',
      type: 'number',
      description: '1–7 in the seven-symbol arc',
      validation: (rule) => rule.required().integer().min(1).max(7),
    }),
    defineField({
      name: 'meaning',
      title: 'Meaning',
      type: 'text',
      rows: 4,
      description: 'What this symbol represents in the Otaru language',
    }),
    defineField({
      name: 'svgMarkup',
      title: 'SVG Markup',
      type: 'text',
      rows: 10,
      description: 'Raw SVG code for the symbol',
    }),
    defineField({
      name: 'image',
      title: 'Symbol Image',
      type: 'image',
      description: 'Rasterized version for fallback',
    }),
  ],
  orderings: [
    {
      title: 'Sequence Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'order' },
    prepare({ title, subtitle }) {
      return { title, subtitle: `Symbol #${subtitle}` };
    },
  },
});

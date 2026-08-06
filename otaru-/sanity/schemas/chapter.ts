/**
 * OTARU — Sanity Chapter Schema
 *
 * Chapter = Collection (§1.11)
 * Contains story, status, production details, cover image, symbol.
 */

import { defineType, defineField } from 'sanity';

export const chapter = defineType({
  name: 'chapter',
  title: 'Chapter',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g., "Origin"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'chapterNumber',
      title: 'Chapter Number',
      type: 'number',
      validation: (rule) => rule.required().integer().positive(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Archived', value: 'archived' },
          { title: 'Upcoming', value: 'upcoming' },
        ],
      },
      initialValue: 'upcoming',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short description for cards and previews',
    }),
    defineField({
      name: 'story',
      title: 'Chapter Story',
      type: 'blockContent',
      description: 'The full editorial narrative for this Chapter',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),
    defineField({
      name: 'symbol',
      title: 'Chapter Symbol',
      type: 'reference',
      to: [{ type: 'symbol' }],
      description: 'The recurring symbol for this Chapter (§1.8)',
    }),
    defineField({
      name: 'shopifyCollectionHandle',
      title: 'Shopify Collection Handle',
      type: 'string',
      description: 'Handle of the corresponding Shopify collection',
    }),
    defineField({
      name: 'productionYear',
      title: 'Production Year',
      type: 'number',
    }),
    defineField({
      name: 'totalProduced',
      title: 'Total Units Produced',
      type: 'number',
      description: 'Total Artifacts manufactured for this Chapter',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Meta Title' },
        { name: 'description', type: 'text', title: 'Meta Description', rows: 3 },
      ],
    }),
  ],
  orderings: [
    {
      title: 'Chapter Number',
      name: 'chapterNumberAsc',
      by: [{ field: 'chapterNumber', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      chapterNumber: 'chapterNumber',
      status: 'status',
      media: 'coverImage',
    },
    prepare({ title, chapterNumber, status, media }) {
      return {
        title: `Chapter ${chapterNumber?.toString().padStart(2, '0')} — "${title}"`,
        subtitle: status,
        media,
      };
    },
  },
});

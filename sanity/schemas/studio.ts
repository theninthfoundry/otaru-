import { defineType, defineField } from 'sanity';

export const studioPage = defineType({
  name: 'studioPage',
  title: 'Studio Page',
  type: 'document',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'blockContent',
    }),
    defineField({
      name: 'philosophySections',
      title: 'Philosophy Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Section Title' },
            { name: 'body', type: 'blockContent', title: 'Content' },
            {
              name: 'image',
              type: 'image',
              title: 'Section Image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
            },
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),
    defineField({
      name: 'designPrinciples',
      title: 'Design Principles',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Principle Name' },
            { name: 'description', type: 'text', title: 'Description', rows: 3 },
          ],
          preview: {
            select: { title: 'name' },
          },
        },
      ],
    }),
    defineField({
      name: 'symbolLanguage',
      title: 'Symbol Language',
      type: 'blockContent',
      description: 'Explanation of the seven-symbol arc (§1.8)',
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
  preview: {
    prepare() {
      return { title: 'Studio Page' };
    },
  },
});

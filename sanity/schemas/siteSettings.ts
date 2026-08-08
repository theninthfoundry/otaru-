import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Otaru',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 2,
      initialValue: 'Garments worth keeping. Craftsmanship outlasts trends.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
      description: 'Default social sharing image',
    }),
    defineField({
      name: 'announcement',
      title: 'Announcement Bar',
      type: 'object',
      fields: [
        { name: 'enabled', type: 'boolean', title: 'Show Announcement' },
        { name: 'text', type: 'string', title: 'Announcement Text' },
        { name: 'link', type: 'url', title: 'Link' },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'instagram', type: 'url', title: 'Instagram' },
        { name: 'twitter', type: 'url', title: 'Twitter / X' },
        { name: 'youtube', type: 'url', title: 'YouTube' },
      ],
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'newsletterHeadline',
      title: 'Newsletter Headline',
      type: 'string',
    }),
    defineField({
      name: 'newsletterSubtext',
      title: 'Newsletter Subtext',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});

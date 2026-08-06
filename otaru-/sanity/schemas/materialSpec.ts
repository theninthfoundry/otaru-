/**
 * OTARU — Sanity Material Spec Schema
 *
 * Reusable material specifications from the Material Library (§1.5).
 */

import { defineType, defineField } from 'sanity';

export const materialSpec = defineType({
  name: 'materialSpec',
  title: 'Material Specification',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Base Fabric', value: 'baseFabric' },
          { title: 'Wash / Dye', value: 'washDye' },
          { title: 'Graphic Technique', value: 'graphicTechnique' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'properties',
      title: 'Properties',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'key', type: 'string', title: 'Property' },
            { name: 'value', type: 'string', title: 'Value' },
          ],
          preview: {
            select: { title: 'key', subtitle: 'value' },
          },
        },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Reference Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category' },
  },
});

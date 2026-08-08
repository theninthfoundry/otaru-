import { defineType, defineArrayMember } from 'sanity';

export const blockContent = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
                validation: (rule) =>
                  rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
              },
              {
                title: 'Open in new tab',
                name: 'blank',
                type: 'boolean',
                initialValue: false,
              },
            ],
          },
          {
            title: 'Artifact Reference',
            name: 'artifactRef',
            type: 'object',
            fields: [
              {
                title: 'Artifact Handle',
                name: 'handle',
                type: 'string',
                description: 'Shopify product handle',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
          description: 'Describe the image for accessibility',
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    defineArrayMember({
      title: 'Material Callout',
      name: 'materialCallout',
      type: 'object',
      fields: [
        {
          name: 'material',
          type: 'string',
          title: 'Material Name',
        },
        {
          name: 'description',
          type: 'text',
          title: 'Description',
          rows: 3,
        },
        {
          name: 'specs',
          type: 'array',
          title: 'Specifications',
          of: [{ type: 'string' }],
        },
      ],
      preview: {
        select: { title: 'material' },
        prepare({ title }) {
          return { title: `Material: ${title}` };
        },
      },
    }),
  ],
});

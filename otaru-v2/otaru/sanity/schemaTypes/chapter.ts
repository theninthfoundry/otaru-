import { defineField, defineType } from "sanity";

export const chapter = defineType({
  name: "chapter",
  title: "Chapter",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "number", title: "Chapter Number", type: "number", validation: (r) => r.required().integer().positive() }),
    defineField({ name: "curatorNote", title: "Curator's Note", type: "text", rows: 4 }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string", title: "Alt text" }] }),
    defineField({
      name: "moodboard",
      title: "Moodboard",
      type: "array",
      of: [{ type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string", title: "Alt text" }] }],
    }),
    defineField({
      name: "artifactHandles",
      title: "Artifact Handles (Shopify)",
      description: "Product handles from Shopify to feature in this Chapter, in display order.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime", validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "title", subtitle: "number", media: "heroImage" },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle: `Chapter ${subtitle}`, media }),
  },
});

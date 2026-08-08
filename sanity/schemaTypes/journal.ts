import { defineField, defineType } from "sanity";

export const journal = defineType({
  name: "journal",
  title: "Journal Entry",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Excerpt", type: "text", rows: 3, validation: (r) => r.max(240) }),
    defineField({ name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "author",
      title: "Author",
      type: "object",
      fields: [
        { name: "name", type: "string", title: "Name" },
        { name: "avatar", type: "image", title: "Avatar" },
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string", title: "Alt text" }] },
      ],
    }),
    defineField({ name: "readingTimeMinutes", title: "Reading Time (minutes)", type: "number" }),
    defineField({ name: "publishedAt", title: "Published At", type: "datetime", validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "title", subtitle: "author.name", media: "coverImage" },
  },
});

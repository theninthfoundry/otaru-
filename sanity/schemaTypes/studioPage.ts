import { defineField, defineType } from "sanity";

/** Singleton "About / Studio" manifesto page. */
export const studioPage = defineType({
  name: "studioPage",
  title: "Studio Page",
  type: "document",
  fields: [
    defineField({ name: "manifesto", title: "Manifesto", type: "text", rows: 6 }),
    defineField({ name: "history", title: "Atelier History", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image", options: { hotspot: true } }),
  ],
});

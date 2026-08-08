import { defineField, defineType } from "sanity";

export const materialSpec = defineType({
  name: "materialSpec",
  title: "Material Spec",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Material Name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "composition", title: "Composition", type: "string", description: "e.g. '100% Japanese selvedge cotton, 13oz'" }),
    defineField({ name: "origin", title: "Origin", type: "string" }),
    defineField({ name: "careInstructions", title: "Care Instructions", type: "array", of: [{ type: "string" }] }),
  ],
});

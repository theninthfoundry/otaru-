import type { StructureResolver } from "sanity/structure";

/** Custom desk structure — surfaces the Studio singleton above the document lists. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Otaru Content")
    .items([
      S.listItem()
        .title("Studio Page")
        .child(S.document().schemaType("studioPage").documentId("studioPage")),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => item.getId() !== "studioPage"),
    ]);

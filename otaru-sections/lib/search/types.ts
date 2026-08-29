export type SearchKind = "artifact" | "chapter" | "journal";

export type SearchableRecord = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle?: string; // material, chapter tagline, publish date — shown under the title
  keywords?: string[]; // material names, catalog number, tags — matched but not displayed
  url: string;
};

export type SearchResult = {
  record: SearchableRecord;
  score: number; // 0..1, see fuzzy-search.ts
};

/**
 * Search index.
 * -----------------------------------------------------------------
 * This static array is placeholder data matching the New Drops /
 * Chapters / Journal sections built earlier. Replace `DEMO_INDEX`
 * with a real `buildSearchIndex()` that maps your Shopify/Sanity
 * data into `SearchableRecord[]` — one function, called wherever
 * fits your setup:
 *
 *   - Small catalog (current mock-data scale): call it in a server
 *     component, pass the array down to a client provider, done.
 *   - Larger catalog: build it once at request time in a route
 *     handler (`app/api/search-index/route.ts`) with `revalidate`,
 *     so the client fetches a cached JSON blob instead of every
 *     artifact's full record.
 */
import type { SearchableRecord } from "./types";

export const DEMO_INDEX: SearchableRecord[] = [
  {
    id: "yama-field-jacket",
    kind: "artifact",
    title: "Yama Field Jacket",
    subtitle: "Raw indigo canvas — $480",
    keywords: ["No. 041", "indigo", "canvas", "jacket", "outerwear"],
    url: "/archive/yama-field-jacket",
  },
  {
    id: "kiryu-wrap-trouser",
    kind: "artifact",
    title: "Kiryū Wrap Trouser",
    subtitle: "Washed silk blend — $310",
    keywords: ["No. 042", "silk", "trouser"],
    url: "/archive/kiryu-wrap-trouser",
  },
  {
    id: "biratori-overshirt",
    kind: "artifact",
    title: "Biratori Overshirt",
    subtitle: "Boiled wool — $395",
    keywords: ["No. 043", "wool", "overshirt", "top"],
    url: "/archive/biratori-overshirt",
  },
  {
    id: "omi-hemp-tote",
    kind: "artifact",
    title: "Ōmi Hemp Tote",
    subtitle: "Raw hemp canvas — $165",
    keywords: ["No. 044", "hemp", "tote", "accessory"],
    url: "/archive/omi-hemp-tote",
  },
  {
    id: "kyoto-nights",
    kind: "chapter",
    title: "Chapter I — Kyoto Nights",
    subtitle: "Indigo cotton · 11 pieces · AW26",
    keywords: ["chapter", "kyoto", "indigo"],
    url: "/chapters/kyoto-nights",
  },
  {
    id: "otaru-harbor",
    kind: "chapter",
    title: "Chapter II — Otaru Harbor",
    subtitle: "Oiled canvas · 8 pieces · AW26",
    keywords: ["chapter", "harbor", "canvas"],
    url: "/chapters/otaru-harbor",
  },
  {
    id: "quiet-interior",
    kind: "chapter",
    title: "Chapter III — Quiet Interior",
    subtitle: "Undyed linen · 6 pieces · SS26",
    keywords: ["chapter", "linen", "silk"],
    url: "/chapters/quiet-interior",
  },
  {
    id: "on-boro",
    kind: "journal",
    title: "On boro, and the ethics of repair",
    subtitle: "12 Aug MMXXVI",
    keywords: ["journal", "boro", "repair"],
    url: "/journal/on-boro",
  },
  {
    id: "a-week-in-omi",
    kind: "journal",
    title: "A week in Ōmi, where the hemp is cut",
    subtitle: "30 Jul MMXXVI",
    keywords: ["journal", "omi", "hemp"],
    url: "/journal/a-week-in-omi",
  },
];

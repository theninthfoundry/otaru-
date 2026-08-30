/**
 * Embedded Sanity Studio at /admin/studio. Requires NEXT_PUBLIC_SANITY_PROJECT_ID
 * to be set — the Studio itself has no mock-data fallback since it edits
 * real content directly.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

export const dynamic = "force-static";

export default function SanityStudioPage() {
  return <NextStudio config={config} />;
}

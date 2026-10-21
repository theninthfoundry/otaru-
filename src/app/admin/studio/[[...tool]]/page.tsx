/**
 * Embedded Sanity Studio at /admin/studio. Requires NEXT_PUBLIC_SANITY_PROJECT_ID
 * to be set — the Studio itself has no mock-data fallback since it edits
 * real content directly.
 */
"use client";

import React from "react";
import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";
import { sanityConfig } from "../../../../../sanity/env";

export default function SanityStudioPage() {
  if (!sanityConfig.projectId) {
    return (
      <div className="min-h-screen bg-[#0b1420] text-[#F4F0E8] flex flex-col items-center justify-center p-8 text-center font-mono">
        <div className="max-w-md p-6 border border-white/10 bg-white/[0.02] rounded space-y-4">
          <span className="text-amber-400 text-xs uppercase tracking-widest block">Studio Configuration Pending</span>
          <h1 className="text-xl font-display font-normal text-white">Sanity Studio Requires Configuration</h1>
          <p className="text-xs text-white/60 leading-relaxed">
            Please configure <code className="text-white bg-white/10 px-1 py-0.5 rounded">NEXT_PUBLIC_SANITY_PROJECT_ID</code> in your deployment environment variables to connect the archival editorial desk.
          </p>
        </div>
      </div>
    );
  }

  return <NextStudio config={config} />;
}

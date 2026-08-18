/**
 * OTARU — Sanity 3D Material Asset Loader & GROQ Queries
 */

import { sanityClient } from '@/lib/sanity/client';

export interface Sanity3DAsset {
  _id: string;
  title: string;
  artifactHandle: string;
  glbUrl?: string;
  usdzUrl?: string;
  normalMapUrl?: string;
  roughnessMapUrl?: string;
  fabricPreset: 'denim' | 'wool' | 'cotton';
}

const ARTIFACT_3D_GROQ = `*[_type == "artifact3d" && artifactHandle == $handle][0]{
  _id,
  title,
  artifactHandle,
  "glbUrl": glbFile.asset->url,
  "usdzUrl": usdzFile.asset->url,
  "normalMapUrl": normalMap.asset->url,
  "roughnessMapUrl": roughnessMap.asset->url,
  fabricPreset
}`;

/**
 * Loads 3D specimen assets from Sanity CDN by artifact handle.
 */
export async function getArtifact3DAsset(handle: string): Promise<Sanity3DAsset | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return {
      _id: `mock-3d-${handle}`,
      title: 'Specimen Physical Spec',
      artifactHandle: handle,
      glbUrl: '/models/specimen.glb',
      usdzUrl: '/models/specimen.usdz',
      fabricPreset: handle.includes('wool') ? 'wool' : handle.includes('cotton') ? 'cotton' : 'denim',
    };
  }

  try {
    const asset = await sanityClient.fetch<Sanity3DAsset>(ARTIFACT_3D_GROQ, { handle });
    return asset || null;
  } catch {
    return null;
  }
}

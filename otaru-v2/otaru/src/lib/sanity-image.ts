import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { sanityClient } from "./sanity";

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

/** Returns null (not a placeholder URL) when Sanity isn't configured — callers should handle gracefully. */
export function urlForImage(source: SanityImageSource) {
  return builder ? builder.image(source) : null;
}

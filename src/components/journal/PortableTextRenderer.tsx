/**
 * Minimal Portable Text renderer placeholder. Swap for `@portabletext/react`
 * once real Sanity Journal content with rich blocks is live.
 */
export function PortableTextRenderer({ blocks }: { blocks: unknown[] }) {
  if (!blocks || blocks.length === 0) {
    return <p className="text-body-md text-foreground-muted">This entry has no published body yet.</p>;
  }
  return <div className="prose max-w-none">{JSON.stringify(blocks)}</div>;
}

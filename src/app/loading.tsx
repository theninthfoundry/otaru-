export default function Loading() {
  return (
    <div className="grid-container" role="status" aria-label="Loading">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-otaru-cream rounded" />
        <div className="mt-4 h-4 w-96 bg-otaru-cream rounded" />
        <div className="mt-2 h-4 w-80 bg-otaru-cream rounded" />
      </div>
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

'use client';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function CartDrawer({ isOpen, onClose, children }: CartDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-otaru-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        id="cart-drawer"
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-otaru-chalk shadow-otaru-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-otaru-border p-6">
            <h2 className="text-heading-sm font-semibold">Bag</h2>
            <button
              onClick={onClose}
              className="text-body-sm text-otaru-ink-muted hover:text-otaru-ink"
              aria-label="Close bag"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>
      </aside>
    </>
  );
}

"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/Button";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  serialNumber: string;
}

export function TransferModal({ isOpen, onClose, serialNumber }: TransferModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transferToken, setTransferToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/verify/transfer?action=initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serialNumber, ownerEmail: email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create transfer token");
      }

      setTransferToken(data.transfer.transferToken);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Transfer initialization failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!transferToken) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/verify?claimToken=${transferToken}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="TRANSFER GARMENT PROVENANCE">
      <div className="space-y-6 pt-2">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Transferring the digital ownership certificate will revoke this certificate from your
          patron account and issue a cryptographically sealed claim invite for garment{" "}
          <strong className="text-foreground font-mono">{serialNumber}</strong>.
        </p>

        {!transferToken ? (
          <form onSubmit={handleInitiate} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Your Registered Patron Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@otaru.co"
                className="w-full bg-secondary/50 border border-border px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground"
              />
            </div>

            {error && (
              <p className="text-[11px] font-mono text-destructive">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                CANCEL
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "SEALING..." : "GENERATE TRANSFER TOKEN"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 rounded-md border border-border bg-secondary/30 p-4">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
                TRANSFER TOKEN GENERATED
              </span>
              <p className="font-mono text-xs font-bold tracking-wider text-foreground break-all">
                {transferToken}
              </p>
            </div>

            <p className="text-[11px] text-muted-foreground text-center">
              Share this secure link with the recipient. Valid for 48 hours.
            </p>

            <Button onClick={handleCopy} className="w-full">
              {copied ? "COPIED CLAIM LINK TO CLIPBOARD" : "COPY CLAIM LINK"}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

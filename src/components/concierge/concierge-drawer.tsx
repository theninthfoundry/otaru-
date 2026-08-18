"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";

interface ConciergeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  artifactHandle?: string;
}

export function ConciergeDrawer({ isOpen, onClose, artifactHandle }: ConciergeDrawerProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState<string>("BESPOKE_SIZING");
  const [contactMethod, setContactMethod] = useState<string>("EMAIL");
  const [contactValue, setContactValue] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patronName: name,
          patronEmail: email,
          inquiryType: type,
          artifactHandle,
          preferredContact: contactMethod,
          contactValue: contactValue || email,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit concierge request");
      }

      setSubmittedId(data.inquiry.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Inquiry submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="ARCHIVAL CONCIERGE" position="right">
      <div className="space-y-6 pt-2">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Request bespoke tailoring consultations, private archive viewings, or garment care
          restoration directly with the Otaru atelier.
        </p>

        {!submittedId ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Consultation Nature
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-secondary/50 border border-border px-3 py-2.5 text-xs text-foreground focus:outline-none focus:border-foreground"
              >
                <option value="BESPOKE_SIZING">Bespoke Silhouette & Sizing</option>
                <option value="PRIVATE_ARCHIVE_VIEWING">Private Collection Viewing</option>
                <option value="REPAIR_RESTORATION">Garment Restoration & Repair</option>
                <option value="CUSTOM_ORDER">Special Commission Request</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Patron Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Lord / Lady Patron"
                className="w-full bg-secondary/50 border border-border px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Email Address
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

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Preferred Channel
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["EMAIL", "WHATSAPP", "PHONE"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setContactMethod(method)}
                    className={`border px-2 py-2 text-[10px] font-mono uppercase tracking-wider transition-all ${
                      contactMethod === method
                        ? "border-foreground bg-foreground text-background font-bold"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {contactMethod !== "EMAIL" && (
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  required
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-secondary/50 border border-border px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Inquiry Details
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail your request, measurements, or preferred consultation dates..."
                className="w-full bg-secondary/50 border border-border px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground resize-none"
              />
            </div>

            {error && (
              <p className="text-[11px] font-mono text-destructive">{error}</p>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "DISPATCHING INQUIRY..." : "TRANSMIT TO ATELIER"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 rounded border border-border bg-secondary/30 p-5 text-center">
            <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
              INQUIRY SEALED
            </span>
            <p className="font-mono text-xs font-bold text-foreground">{submittedId}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your inquiry has been received by the Otaru concierge. A master atelier consultant will
              respond via {contactMethod.toLowerCase()} within 4 business hours.
            </p>
            <Button onClick={onClose} className="w-full">
              CLOSE CONCIERGE
            </Button>
          </div>
        )}
      </div>
    </Drawer>
  );
}

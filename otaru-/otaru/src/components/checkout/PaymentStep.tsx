"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ExpressPayButtons } from "./ExpressPayButtons";
import { CardForm, type CardData } from "@/components/payments/CardForm";
import { UpiForm } from "@/components/payments/UpiForm";
import { BnplOption } from "@/components/payments/BnplOption";
import { TrustBadges } from "./TrustBadges";

export type PaymentMethod = "card" | "upi" | "cod" | "bnpl";

export interface PaymentData {
  method: PaymentMethod;
  card: CardData;
}

const EMPTY_CARD: CardData = { number: "", name: "", expiry: "", cvc: "", billingSameAsShipping: true };

/**
 * Method tabs (one choice visible at a time — Baymard: don't show every
 * field for every method simultaneously). COD is included because it's the
 * dominant fallback payment method in the Indian market alongside UPI.
 */
export function PaymentStep({
  countryCode,
  totalAmount,
  currencyCode,
  onBack,
  onContinue,
}: {
  countryCode: string;
  totalAmount: string;
  currencyCode: string;
  onBack: () => void;
  onContinue: (data: PaymentData) => void;
}) {
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState<CardData>(EMPTY_CARD);

  const showUpiAndCod = countryCode === "IN";
  const methods: { id: PaymentMethod; label: string }[] = [
    { id: "card", label: "Card" },
    ...(showUpiAndCod ? [{ id: "upi" as const, label: "UPI" }, { id: "cod" as const, label: "Cash on Delivery" }] : []),
    { id: "bnpl", label: "Pay in installments" },
  ];

  const isValid = method !== "card" || (card.number.length >= 19 && card.name && card.expiry && card.cvc.length >= 3);

  return (
    <div className="space-y-6">
      <ExpressPayButtons onSelect={(m) => onContinue({ method: "card", card })} />

      <div className="flex gap-2 border-b border-border">
        {methods.map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`px-1 pb-3 text-body-sm border-b-2 -mb-px transition-colors duration-1 ${
              method === m.id ? "border-otaru-ink text-foreground" : "border-transparent text-foreground-muted"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div>
        {method === "card" && <CardForm data={card} onChange={setCard} />}
        {method === "upi" && <UpiForm />}
        {method === "cod" && (
          <p className="text-body-sm text-foreground-muted">
            Pay in cash when your order arrives. A verification call may be made before dispatch.
          </p>
        )}
        {method === "bnpl" && <BnplOption totalAmount={totalAmount} currencyCode={currencyCode} />}
      </div>

      <TrustBadges />

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button className="flex-1" disabled={!isValid} onClick={() => onContinue({ method, card })}>
          Review Order
        </Button>
      </div>
    </div>
  );
}

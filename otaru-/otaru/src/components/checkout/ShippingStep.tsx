"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export interface ShippingData {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  saveAddress: boolean;
  shippingMethod: "standard" | "express";
}

const REQUIRED_FIELDS: (keyof ShippingData)[] = ["firstName", "lastName", "address1", "city", "state", "postalCode", "country"];

export function ShippingStep({ initial, onBack, onContinue }: { initial: ShippingData; onBack: () => void; onContinue: (data: ShippingData) => void }) {
  const [data, setData] = useState<ShippingData>(initial);

  const isValid = REQUIRED_FIELDS.every((f) => data[f].toString().trim().length > 0);

  function update<K extends keyof ShippingData>(key: K, value: ShippingData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <input placeholder="First name" value={data.firstName} onChange={(e) => update("firstName", e.target.value)} className="h-12 rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink" />
        <input placeholder="Last name" value={data.lastName} onChange={(e) => update("lastName", e.target.value)} className="h-12 rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink" />
      </div>

      <input placeholder="Address" value={data.address1} onChange={(e) => update("address1", e.target.value)} className="h-12 w-full rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink" />
      <input placeholder="Apartment, suite, etc. (optional)" value={data.address2} onChange={(e) => update("address2", e.target.value)} className="h-12 w-full rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink" />

      <div className="grid grid-cols-3 gap-4">
        <input placeholder="City" value={data.city} onChange={(e) => update("city", e.target.value)} className="h-12 rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink" />
        <input placeholder="State" value={data.state} onChange={(e) => update("state", e.target.value)} className="h-12 rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink" />
        <input placeholder="Postal code" value={data.postalCode} onChange={(e) => update("postalCode", e.target.value)} className="h-12 rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select value={data.country} onChange={(e) => update("country", e.target.value)} className="h-12 rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink">
          <option value="">Country</option>
          <option value="US">United States</option>
          <option value="IN">India</option>
          <option value="GB">United Kingdom</option>
          <option value="DE">Germany</option>
        </select>
        <input placeholder="Phone (for delivery updates)" value={data.phone} onChange={(e) => update("phone", e.target.value)} className="h-12 rounded-sm border border-border-strong bg-surface px-3 text-body-md focus:outline-none focus:border-otaru-ink" />
      </div>

      <label className="flex items-center gap-2 text-body-sm">
        <input type="checkbox" checked={data.saveAddress} onChange={(e) => update("saveAddress", e.target.checked)} className="h-4 w-4" />
        Save this address for next time
      </label>

      <div>
        <p className="otaru-eyebrow mb-3">Shipping Method</p>
        <div className="space-y-2">
          {[
            { id: "standard" as const, label: "Standard", detail: "3–5 business days", price: "Free over $300" },
            { id: "express" as const, label: "Express", detail: "1–2 business days", price: "$25" },
          ].map((option) => (
            <label
              key={option.id}
              className={`flex items-center justify-between rounded-sm border p-4 cursor-pointer ${data.shippingMethod === option.id ? "border-otaru-ink" : "border-border-strong"}`}
            >
              <div className="flex items-center gap-3">
                <input type="radio" name="shipping" checked={data.shippingMethod === option.id} onChange={() => update("shippingMethod", option.id)} />
                <div>
                  <p className="text-body-sm">{option.label}</p>
                  <p className="text-caption text-foreground-muted">{option.detail}</p>
                </div>
              </div>
              <p className="text-body-sm">{option.price}</p>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onBack}>Back</Button>
        <Button className="flex-1" disabled={!isValid} onClick={() => onContinue(data)}>Continue to Payment</Button>
      </div>
    </div>
  );
}

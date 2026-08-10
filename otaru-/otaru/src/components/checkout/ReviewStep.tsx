"use client";

import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/utils";
import type { Cart } from "@/types/shopify";
import type { ContactData } from "./ContactStep";
import type { ShippingData } from "./ShippingStep";
import type { PaymentData } from "./PaymentStep";

const METHOD_LABELS: Record<PaymentData["method"], string> = {
  card: "Card",
  upi: "UPI",
  cod: "Cash on Delivery",
  bnpl: "Pay in installments",
};

export function ReviewStep({
  cart,
  contact,
  shipping,
  payment,
  onEditStep,
  onPlaceOrder,
  isSubmitting,
}: {
  cart: Cart;
  contact: ContactData;
  shipping: ShippingData;
  payment: PaymentData;
  onEditStep: (step: "contact" | "shipping" | "payment") => void;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-sm border border-border divide-y divide-border">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="otaru-eyebrow mb-1">Contact</p>
            <p className="text-body-sm">{contact.email}</p>
          </div>
          <button onClick={() => onEditStep("contact")} className="text-caption underline underline-offset-2">Edit</button>
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="otaru-eyebrow mb-1">Ship to</p>
            <p className="text-body-sm">
              {shipping.firstName} {shipping.lastName}, {shipping.address1}, {shipping.city} {shipping.postalCode}, {shipping.country}
            </p>
          </div>
          <button onClick={() => onEditStep("shipping")} className="text-caption underline underline-offset-2">Edit</button>
        </div>
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="otaru-eyebrow mb-1">Payment</p>
            <p className="text-body-sm">{METHOD_LABELS[payment.method]}</p>
          </div>
          <button onClick={() => onEditStep("payment")} className="text-caption underline underline-offset-2">Edit</button>
        </div>
      </div>

      <div className="space-y-3">
        {cart.lines.map((line) => (
          <div key={line.id} className="flex justify-between text-body-sm">
            <span>{line.merchandise.product.title} × {line.quantity}</span>
            <span>{formatMoney(line.merchandise.price.amount, line.merchandise.price.currencyCode)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-body-sm">
          <span>Subtotal</span>
          <span>{formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}</span>
        </div>
        <div className="flex justify-between text-body-sm">
          <span>Shipping</span>
          <span>{shipping.shippingMethod === "express" ? "$25.00" : "Free"}</span>
        </div>
        <div className="flex justify-between text-body-md font-medium pt-2 border-t border-border">
          <span>Total</span>
          <span>{formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}</span>
        </div>
      </div>

      <Button className="w-full" onClick={onPlaceOrder} disabled={isSubmitting}>
        {isSubmitting ? "Placing Order…" : "Place Order"}
      </Button>
      <p className="text-caption text-foreground-muted text-center">
        By placing your order you agree to Otaru's Terms of Sale and Privacy Policy.
      </p>
    </div>
  );
}

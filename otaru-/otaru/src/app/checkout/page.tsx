"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { CheckoutSteps, type CheckoutStep } from "@/components/checkout/CheckoutSteps";
import { ContactStep, type ContactData } from "@/components/checkout/ContactStep";
import { ShippingStep, type ShippingData } from "@/components/checkout/ShippingStep";
import { PaymentStep, type PaymentData } from "@/components/checkout/PaymentStep";
import { ReviewStep } from "@/components/checkout/ReviewStep";
import { OrderSummarySidebar } from "@/components/checkout/OrderSummarySidebar";

const EMPTY_CONTACT: ContactData = { email: "", marketingOptIn: false };
const EMPTY_SHIPPING: ShippingData = {
  firstName: "", lastName: "", address1: "", address2: "", city: "", state: "",
  postalCode: "", country: "", phone: "", saveAddress: false, shippingMethod: "standard",
};
const EMPTY_PAYMENT: PaymentData = { method: "card", card: { number: "", name: "", expiry: "", cvc: "", billingSameAsShipping: true } };

/**
 * Custom checkout UI/UX. IMPORTANT: this page composes the interface layer
 * only — actual payment capture is not implemented here. In production,
 * "Place Order" on the Review step should either (a) hand off to Shopify's
 * hosted checkout (cart.checkoutUrl) for PCI-compliant payment, or (b) post
 * to a real payment processor via Shopify Checkout Extensibility / a
 * Stripe/Razorpay integration. Wire that call where noted below.
 */
export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartStore((s) => s.cart);
  const countryCode = useCurrencyStore((s) => s.countryCode);

  const [step, setStep] = useState<CheckoutStep>("contact");
  const [contact, setContact] = useState<ContactData>(EMPTY_CONTACT);
  const [shipping, setShipping] = useState<ShippingData>(EMPTY_SHIPPING);
  const [payment, setPayment] = useState<PaymentData>(EMPTY_PAYMENT);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = shipping.shippingMethod === "express" ? 25 : 0;

  if (cart.lines.length === 0 && step !== "review") {
    return (
      <div className="otaru-container pt-44 pb-24 text-center">
        <p className="text-body-md text-foreground-muted">Your bag is empty.</p>
      </div>
    );
  }

  async function handlePlaceOrder() {
    setIsSubmitting(true);
    // TODO: real integration point — either redirect to cart.checkoutUrl
    // (Shopify-hosted, PCI-compliant) or POST to a processor here.
    await new Promise((r) => setTimeout(r, 900));
    router.push("/checkout/confirmation");
  }

  return (
    <div className="otaru-container pt-36 pb-24">
      <div className="grid gap-12 md:grid-cols-[1fr_400px]">
        <div className="max-w-lg">
          <CheckoutSteps current={step} onStepClick={setStep} />

          {step === "contact" && (
            <ContactStep initial={contact} onContinue={(data) => { setContact(data); setStep("shipping"); }} />
          )}
          {step === "shipping" && (
            <ShippingStep initial={shipping} onBack={() => setStep("contact")} onContinue={(data) => { setShipping(data); setStep("payment"); }} />
          )}
          {step === "payment" && (
            <PaymentStep
              countryCode={countryCode}
              totalAmount={cart.cost.totalAmount.amount}
              currencyCode={cart.cost.totalAmount.currencyCode}
              onBack={() => setStep("shipping")}
              onContinue={(data) => { setPayment(data); setStep("review"); }}
            />
          )}
          {step === "review" && (
            <ReviewStep
              cart={cart}
              contact={contact}
              shipping={shipping}
              payment={payment}
              onEditStep={setStep}
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        <div>
          <OrderSummarySidebar cart={cart} shippingCost={shippingCost} />
        </div>
      </div>
    </div>
  );
}

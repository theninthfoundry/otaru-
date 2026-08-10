import { formatMoney } from "@/lib/utils";

/** Buy-now-pay-later split preview (Klarna/Affirm-style, ASOS "payment diversity" pattern). */
export function BnplOption({ totalAmount, currencyCode }: { totalAmount: string; currencyCode: string }) {
  const installments = 4;
  const perInstallment = parseFloat(totalAmount) / installments;

  return (
    <div className="rounded-sm border border-border-strong p-4">
      <p className="text-body-sm mb-2">Pay in {installments} interest-free installments</p>
      <p className="text-body-md font-medium mb-1">{formatMoney(perInstallment, currencyCode)} × {installments}</p>
      <p className="text-caption text-foreground-muted">First installment charged today. No fees if paid on time.</p>
    </div>
  );
}

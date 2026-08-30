import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class lists safely, resolving conflicting utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a Shopify MoneyV2-shaped value using Intl, no hardcoded symbols. */
export function formatMoney(amount: string | number, currencyCode = "USD") {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function absoluteUrl(path: string = "") {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://otaru.in";
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function formatPrice(amount: number | string, currency = "USD") {
  return formatMoney(amount, currency);
}

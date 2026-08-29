import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In — Otaru",
  robots: { index: false }, // auth pages generally shouldn't be indexed
};

export default function SignInPage() {
  return <SignInForm />;
}

import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart/cart-context";
import { SearchModal } from "@/components/search/SearchModal";
import { MoonProgress } from "@/components/ui/MoonProgress";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
// import { Newsreader, Inter } from "next/font/google"; — see INTEGRATION.md section 4

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <SearchModal />
          <MoonProgress />
        </CartProvider>
      </body>
    </html>
  );
}

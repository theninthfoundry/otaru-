import type { Metadata } from "next";
import "@/styles/globals.css";
import { LenisProvider } from "@/components/common/LenisProvider";
import { CartProvider } from "@/components/cart/CartContext";
import { WishlistProvider } from "@/components/wishlist/WishlistContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Otaru — Garments worth keeping",
  description:
    "Otaru is an editorial luxury garment archive. Numbered Chapters, not seasonal collections. Craftsmanship outlasts trends.",
  metadataBase: new URL("https://otaru.example.com"),
  openGraph: {
    title: "Otaru — Garments worth keeping",
    description: "An editorial, story-driven luxury garment archive.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LenisProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <CartDrawer />
            </WishlistProvider>
          </CartProvider>
        </LenisProvider>
      </body>
    </html>
  );
}

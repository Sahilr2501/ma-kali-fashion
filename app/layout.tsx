import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { CartProvider } from "@/components/cart/CartProvider";
import { STORE_NAME } from "@/lib/constants";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: STORE_NAME,
    template: `%s · ${STORE_NAME}`,
  },
  description:
    "Browse clothing, earrings, necklaces, and accessories. Add items to your cart and place an order by email confirmation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

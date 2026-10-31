"use client";

import Link from "next/link";
import { useState } from "react";
import { STORE_NAME, STORE_SHORT_NAME } from "@/lib/constants";
import { useCart } from "./cart/CartProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#eadfce] bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-serif text-xl tracking-wide text-maroon focus-visible:outline-2 focus-visible:outline-gold">
          {STORE_SHORT_NAME}
          <span className="hidden sm:inline"> Fashion</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-charcoal hover:text-maroon focus-visible:outline-2 focus-visible:outline-gold">
              {link.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="rounded-full border border-gold px-4 py-1.5 text-maroon focus-visible:outline-2 focus-visible:outline-gold"
          >
            Cart ({count})
          </Link>
        </nav>
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/cart" className="rounded-full border border-gold px-3 py-1 text-sm text-maroon">
            Cart ({count})
          </Link>
          <button
            type="button"
            className="rounded border border-[#eadfce] px-3 py-1 text-sm"
            aria-expanded={open}
            aria-label="Open menu"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-[#eadfce] px-4 py-3 md:hidden" aria-label={STORE_NAME}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-charcoal"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

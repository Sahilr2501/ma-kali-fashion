import Link from "next/link";
import { STORE_NAME, storeContact } from "@/lib/constants";

export function Footer() {
  const contact = storeContact();

  return (
    <footer className="mt-auto border-t border-[#eadfce] bg-maroon text-ivory">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">{STORE_NAME}</p>
          <p className="mt-3 max-w-sm text-sm text-ivory/80">
            Clothing, earrings, necklaces, and accessories. Browse, add to your cart, and place an order without creating an account.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-gold">Visit</p>
          <div className="mt-3 space-y-1 text-sm text-ivory/85">
            <Link className="block hover:text-gold" href="/shop">
              Shop
            </Link>
            <Link className="block hover:text-gold" href="/contact">
              Contact
            </Link>
            <Link className="block hover:text-gold" href="/policies/shipping">
              Shipping
            </Link>
            <Link className="block hover:text-gold" href="/policies/returns">
              Returns
            </Link>
            <Link className="block hover:text-gold" href="/policies/privacy">
              Privacy
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold tracking-wide text-gold">Contact</p>
          <div className="mt-3 space-y-1 text-sm text-ivory/85">
            {contact.phone ? <p>{contact.phone}</p> : null}
            {contact.email ? <p>{contact.email}</p> : null}
            {contact.address ? <p>{contact.address}</p> : null}
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 px-4 py-4 text-center text-xs text-ivory/70">
        Jewellery descriptions use gold-coloured coated where that is accurate. Items are not advertised as solid gold unless that is true of the product.
      </p>
    </footer>
  );
}

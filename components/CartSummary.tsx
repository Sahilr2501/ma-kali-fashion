"use client";

import Link from "next/link";
import { formatINR } from "@/lib/format";
import { deliveryChargeFor, orderTotals } from "@/lib/pricing";
import { lineKey, useCart } from "./cart/CartProvider";

export function CartSummary({ checkoutHref = true }: { checkoutHref?: boolean }) {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const totals = orderTotals(subtotal);

  if (items.length === 0) {
    return (
      <div className="border border-[#eadfce] bg-white p-8 text-center">
        <p>Your cart is empty.</p>
        <Link href="/shop" className="mt-4 inline-block bg-maroon px-5 py-2 text-ivory">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={lineKey(item)} className="flex gap-4 border border-[#eadfce] bg-white p-4">
            <div className="min-w-0 flex-1">
              <p className="font-serif text-lg text-maroon">{item.name}</p>
              <p className="text-sm text-[#6b6258]">
                {item.size ? `Size: ${item.size}` : null}
                {item.size && item.color ? " · " : null}
                {item.color ? `Colour: ${item.color}` : null}
              </p>
              <p className="mt-1 text-sm">{formatINR(item.price)}</p>
              <div className="mt-3 flex items-center gap-2">
                <label className="text-sm" htmlFor={`qty-${lineKey(item)}`}>
                  Qty
                </label>
                <input
                  id={`qty-${lineKey(item)}`}
                  type="number"
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(lineKey(item), Number(event.target.value))}
                  className="w-20 border border-[#eadfce] bg-ivory px-2 py-1"
                />
                <button type="button" className="text-sm text-maroon underline" onClick={() => removeItem(lineKey(item))}>
                  Remove
                </button>
              </div>
            </div>
            <p className="font-medium">{formatINR(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>
      <aside className="h-fit border border-[#eadfce] bg-white p-5">
        <h2 className="font-serif text-2xl text-maroon">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatINR(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>{deliveryChargeFor(totals.subtotal) === 0 ? "Free" : formatINR(totals.deliveryCharge)}</dd>
          </div>
          <div className="flex justify-between border-t border-[#eadfce] pt-2 text-base font-medium">
            <dt>Total</dt>
            <dd>{formatINR(totals.total)}</dd>
          </div>
        </dl>
        <Link href="/shop" className="mt-4 block text-center text-sm text-maroon underline">
          Continue shopping
        </Link>
        {checkoutHref ? (
          <Link href="/checkout" className="mt-3 block bg-maroon px-4 py-3 text-center text-ivory">
            Proceed to checkout
          </Link>
        ) : null}
      </aside>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAYMENT_LABELS, storeContact } from "@/lib/constants";
import { formatINR } from "@/lib/format";
import { orderTotals } from "@/lib/pricing";
import { lineKey, useCart } from "./cart/CartProvider";

type FieldErrors = Record<string, string>;

export function CheckoutForm() {
  const { items, subtotal, clear } = useCart();
  const totals = orderTotals(subtotal);
  const router = useRouter();
  const contact = storeContact();
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  if (items.length === 0) {
    return <p>Add items to your cart before checking out.</p>;
  }

  return (
    <form
      className="grid gap-8 lg:grid-cols-[1fr_320px]"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setMessage("");
        setErrors({});
        const form = new FormData(event.currentTarget);
        const payload = {
          customerName: String(form.get("customerName") || ""),
          email: String(form.get("email") || ""),
          phone: String(form.get("phone") || ""),
          address: String(form.get("address") || ""),
          city: String(form.get("city") || ""),
          state: String(form.get("state") || ""),
          pinCode: String(form.get("pinCode") || ""),
          paymentMethod: String(form.get("paymentMethod") || ""),
          notes: String(form.get("notes") || ""),
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
          })),
        };

        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as {
          message?: string;
          errors?: FieldErrors;
          orderReference?: string;
          customerEmailSent?: boolean;
          adminEmailSent?: boolean;
          status?: string;
          paymentMethod?: string;
          paymentStatus?: string;
          totals?: typeof totals;
          items?: typeof items;
          upiId?: string;
        };
        setPending(false);

        if (data.errors) setErrors(data.errors);
        if (!data.orderReference) {
          setMessage(data.message || "Checkout could not be completed.");
          return;
        }

        sessionStorage.setItem(
          "mkfa_last_order",
          JSON.stringify({
            orderReference: data.orderReference,
            message: data.message,
            status: data.status,
            customerEmailSent: data.customerEmailSent,
            adminEmailSent: data.adminEmailSent,
            paymentMethod: data.paymentMethod,
            paymentStatus: data.paymentStatus,
            totals: data.totals,
            items: data.items,
            upiId: data.upiId,
          }),
        );

        if (data.adminEmailSent) {
          clear();
        }
        router.push("/order-success");
      }}
    >
      <div className="space-y-4 border border-[#eadfce] bg-white p-5">
        <h2 className="font-serif text-2xl text-maroon">Delivery details</h2>
        {[
          ["customerName", "Customer name", "text"],
          ["email", "Email address", "email"],
          ["phone", "Phone number", "tel"],
          ["address", "Delivery address", "text"],
          ["city", "City", "text"],
          ["state", "State", "text"],
          ["pinCode", "PIN code", "text"],
        ].map(([name, label, type]) => (
          <label key={name} className="block text-sm">
            {label}
            {name === "address" ? (
              <textarea name={name} required className="mt-1 w-full border border-[#eadfce] bg-ivory px-3 py-2" rows={3} />
            ) : (
              <input name={name} type={type} required className="mt-1 w-full border border-[#eadfce] bg-ivory px-3 py-2" />
            )}
            {errors[name] ? <span className="mt-1 block text-red-800">{errors[name]}</span> : null}
          </label>
        ))}
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Payment method</legend>
          {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="paymentMethod"
                value={value}
                checked={paymentMethod === value}
                onChange={() => setPaymentMethod(value)}
                required
              />
              {label}
            </label>
          ))}
          {paymentMethod === "upi" && contact.upiId ? (
            <p className="text-sm text-[#5c534b]">
              After submitting, pay manually to UPI ID {contact.upiId}. The store will confirm payment separately. Orders are never marked as paid automatically.
            </p>
          ) : null}
        </fieldset>
        <label className="block text-sm">
          Order notes (optional)
          <textarea name="notes" rows={3} className="mt-1 w-full border border-[#eadfce] bg-ivory px-3 py-2" />
        </label>
        {errors.items ? <p className="text-sm text-red-800">{errors.items}</p> : null}
        {message ? <p className="text-sm text-red-800">{message}</p> : null}
      </div>
      <aside className="h-fit border border-[#eadfce] bg-white p-5">
        <h2 className="font-serif text-2xl text-maroon">Your items</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((item) => (
            <li key={lineKey(item)} className="flex justify-between gap-3">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{formatINR(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">Delivery {formatINR(totals.deliveryCharge)}</p>
        <p className="mt-1 font-medium">Total {formatINR(totals.total)}</p>
        <p className="mt-3 text-xs text-[#6b6258]">
          Prices and stock are checked again on the server. Displayed cart prices are for guidance only.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="mt-5 w-full bg-maroon px-4 py-3 text-ivory disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Place order"}
        </button>
      </aside>
    </form>
  );
}

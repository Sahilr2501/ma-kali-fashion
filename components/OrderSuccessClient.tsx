"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PAYMENT_LABELS, type PaymentMethod, storeContact } from "@/lib/constants";
import { formatINR } from "@/lib/format";

type StoredOrder = {
  orderReference: string;
  message?: string;
  status?: string;
  customerEmailSent?: boolean;
  adminEmailSent?: boolean;
  paymentMethod?: PaymentMethod;
  paymentStatus?: string;
  totals?: { subtotal: number; deliveryCharge: number; total: number };
  items?: { name: string; quantity: number; subtotal: number }[];
  upiId?: string;
};

export function OrderSuccessClient() {
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const contact = storeContact();

  useEffect(() => {
    const raw = sessionStorage.getItem("mkfa_last_order");
    if (raw) setOrder(JSON.parse(raw) as StoredOrder);
  }, []);

  if (!order) {
    return (
      <div className="border border-[#eadfce] bg-white p-8">
        <h1 className="font-serif text-3xl text-maroon">Order status</h1>
        <p className="mt-4">
          No recent order details were found in this browser. If you placed an order and did not receive confirmation, please contact the store.
        </p>
        <Link href="/contact" className="mt-6 inline-block text-maroon underline">
          Contact the store
        </Link>
      </div>
    );
  }

  const bothOk = order.status === "both_ok";
  const customerFailed = order.status === "customer_failed_admin_ok";
  const adminFailed = order.status === "customer_ok_admin_failed" || order.status === "both_failed";

  return (
    <div className="border border-[#eadfce] bg-white p-8">
      <h1 className="font-serif text-3xl text-maroon">
        {bothOk ? "Order submitted" : adminFailed ? "Order not fully confirmed" : "Order received"}
      </h1>
      <p className="mt-4">{order.message}</p>
      <p className="mt-4 text-sm">
        Order reference: <strong>{order.orderReference}</strong>
      </p>
      {bothOk ? (
        <p className="mt-3 text-sm">A confirmation email has been requested for your inbox. Delivery to the inbox is not guaranteed; contact the store if you do not receive it.</p>
      ) : null}
      {customerFailed ? (
        <p className="mt-3 text-sm">A confirmation email was not sent. Please keep this reference and contact the store if you need a copy.</p>
      ) : null}
      {adminFailed ? (
        <p className="mt-3 text-sm text-red-800">
          Please contact the store immediately with this reference and your order details. The application does not keep a database copy of orders.
        </p>
      ) : null}
      {order.items ? (
        <ul className="mt-6 space-y-1 text-sm">
          {order.items.map((item) => (
            <li key={`${item.name}-${item.quantity}`}>
              {item.name} × {item.quantity} — {formatINR(item.subtotal)}
            </li>
          ))}
        </ul>
      ) : null}
      {order.totals ? <p className="mt-3 font-medium">Total {formatINR(order.totals.total)}</p> : null}
      {order.paymentMethod ? (
        <p className="mt-3 text-sm">
          Payment: {PAYMENT_LABELS[order.paymentMethod]} — {order.paymentStatus}
        </p>
      ) : null}
      {order.paymentMethod === "upi" && (order.upiId || contact.upiId) ? (
        <p className="mt-3 text-sm">
          Complete a manual UPI transfer to {order.upiId || contact.upiId} using your order reference in the note. Do not treat the order as paid until the store confirms receipt.
        </p>
      ) : null}
      <div className="mt-8 flex gap-4">
        <Link href="/shop" className="bg-maroon px-4 py-2 text-ivory">
          Continue shopping
        </Link>
        <Link href="/contact" className="border border-gold px-4 py-2 text-maroon">
          Contact
        </Link>
      </div>
    </div>
  );
}

import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div>
      <h1 className="mb-2 font-serif text-4xl text-maroon">Checkout</h1>
      <p className="mb-6 text-sm text-[#5c534b]">
        Orders are sent by email. Nothing is stored as an order record in the database. If you do not receive confirmation, contact the store.
      </p>
      <CheckoutForm />
    </div>
  );
}

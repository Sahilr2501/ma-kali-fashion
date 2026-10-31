import { CartSummary } from "@/components/CartSummary";

export const metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div>
      <h1 className="mb-6 font-serif text-4xl text-maroon">Shopping cart</h1>
      <CartSummary />
    </div>
  );
}

export const metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <article className="prose-sm max-w-2xl space-y-4">
      <h1 className="font-serif text-4xl text-maroon">Shipping</h1>
      <p>Orders are packed after the store confirms them by email. Delivery timelines are shared during that confirmation.</p>
      <p>Delivery charges are calculated at checkout. Orders at or above the free-delivery threshold ship without that fee.</p>
    </article>
  );
}

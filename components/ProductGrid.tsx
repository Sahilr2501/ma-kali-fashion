import { ProductList } from "./ProductList";
import type { PublicProduct } from "@/lib/types";

export function ProductGrid({ products }: { products: PublicProduct[] }) {
  if (products.length === 0) {
    return <p className="text-[#6b6258]">No products are available in this view yet.</p>;
  }

  return <ProductList products={products} />;
}

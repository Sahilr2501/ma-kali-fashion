"use client";

import { ProductCard } from "./ProductCard";
import type { PublicProduct } from "@/lib/types";

export function ProductList({ products }: { products: PublicProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

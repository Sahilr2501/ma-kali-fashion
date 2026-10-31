"use client";

import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import type { PublicProduct } from "@/lib/types";
import { useCart } from "./cart/CartProvider";

export function ProductCard({ product }: { product: PublicProduct }) {
  const { addItem } = useCart();
  const needsOptions = product.sizes.length > 0 || product.colors.length > 0;
  const image = product.images[0] || "/images/placeholder.svg";

  return (
    <article className="flex flex-col border border-[#eadfce] bg-white p-3">
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] overflow-hidden bg-[#efe6d8]">
        <Image src={image} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 50vw, 25vw" />
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="font-serif text-lg leading-snug text-maroon">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="mt-1 text-sm">
          <span className="font-medium">{formatINR(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price ? (
            <span className="ml-2 text-[#7a7168] line-through">{formatINR(product.originalPrice)}</span>
          ) : null}
        </p>
        <p className={`mt-1 text-xs ${product.inStock ? "text-emerald-800" : "text-red-800"}`}>
          {product.inStock ? "In stock" : "Out of stock"}
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex flex-1 items-center justify-center border border-maroon px-3 py-2 text-center text-sm text-maroon focus-visible:outline-2 focus-visible:outline-gold"
          >
            View Product
          </Link>
          {needsOptions ? (
            <Link
              href={`/product/${product.slug}`}
              className="inline-flex flex-1 items-center justify-center bg-maroon px-3 py-2 text-sm text-ivory focus-visible:outline-2 focus-visible:outline-gold"
            >
              Select options
            </Link>
          ) : (
            <button
              type="button"
              disabled={!product.inStock}
              onClick={() =>
                addItem({
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  image,
                  price: product.price,
                  stock: product.stock,
                })
              }
              className="inline-flex flex-1 items-center justify-center bg-maroon px-3 py-2 text-sm text-ivory disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-gold"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

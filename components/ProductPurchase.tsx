"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PublicProduct } from "@/lib/types";
import { useCart } from "./cart/CartProvider";

export function ProductPurchase({ product }: { product: PublicProduct }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(product.sizes[0] || "");
  const [color, setColor] = useState(product.colors[0] || "");
  const [message, setMessage] = useState("");

  const disabled = !product.inStock;

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        if (product.sizes.length > 0 && !size) {
          setMessage("Please choose a size.");
          return;
        }
        if (product.colors.length > 0 && !color) {
          setMessage("Please choose a colour.");
          return;
        }
        addItem({
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0] || "/images/placeholder.svg",
          price: product.price,
          stock: product.stock,
          quantity,
          size: size || undefined,
          color: color || undefined,
        });
        setMessage("Added to cart.");
      }}
    >
      {product.sizes.length > 0 ? (
        <label className="block text-sm">
          Size
          <select
            className="mt-1 w-full border border-[#eadfce] bg-white px-3 py-2"
            value={size}
            onChange={(event) => setSize(event.target.value)}
          >
            {product.sizes.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {product.colors.length > 0 ? (
        <label className="block text-sm">
          Colour
          <select
            className="mt-1 w-full border border-[#eadfce] bg-white px-3 py-2"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          >
            {product.colors.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="block text-sm">
        Quantity
        <input
          type="number"
          min={1}
          max={Math.max(1, product.stock)}
          value={quantity}
          disabled={disabled}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="mt-1 w-32 border border-[#eadfce] bg-white px-3 py-2"
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={disabled}
          className="bg-maroon px-5 py-3 text-ivory disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-gold"
        >
          Add to Cart
        </button>
        <button
          type="button"
          disabled={disabled}
          className="border border-gold px-5 py-3 text-maroon disabled:opacity-50"
          onClick={() => {
            addItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              image: product.images[0] || "/images/placeholder.svg",
              price: product.price,
              stock: product.stock,
              quantity,
              size: size || undefined,
              color: color || undefined,
            });
            router.push("/checkout");
          }}
        >
          Buy now
        </button>
      </div>
      {message ? <p className="text-sm text-maroon">{message}</p> : null}
    </form>
  );
}

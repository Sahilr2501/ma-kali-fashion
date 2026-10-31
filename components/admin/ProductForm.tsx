"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CategoryOption = { _id: string; name: string };

type ProductValue = {
  _id?: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  sizes: string[];
  colors: string[];
  isActive: boolean;
};

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOption[];
  product?: ProductValue;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setMessage("");
        const form = new FormData(event.currentTarget);
        const payload = {
          name: form.get("name"),
          description: form.get("description"),
          categoryId: form.get("categoryId"),
          price: Number(form.get("price")),
          originalPrice: form.get("originalPrice") ? Number(form.get("originalPrice")) : undefined,
          stock: Number(form.get("stock")),
          images: String(form.get("images") || "")
            .split("\n")
            .map((value) => value.trim())
            .filter(Boolean),
          sizes: String(form.get("sizes") || "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          colors: String(form.get("colors") || "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
          isActive: form.get("isActive") === "on",
        };
        const path = product?._id ? `/api/admin/products/${product._id}` : "/api/admin/products";
        const response = await fetch(path, {
          method: product?._id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as { message?: string };
        setPending(false);
        if (!response.ok) {
          setMessage(data.message || "The product could not be saved.");
          return;
        }
        router.push("/admin/products");
        router.refresh();
      }}
    >
      <label className="block text-sm">
        Name
        <input name="name" defaultValue={product?.name} required className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
      </label>
      <label className="block text-sm">
        Description
        <textarea name="description" defaultValue={product?.description} required rows={5} className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
      </label>
      <label className="block text-sm">
        Category
        <select name="categoryId" defaultValue={product?.categoryId} required className="mt-1 w-full border border-[#eadfce] px-3 py-2">
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          Selling price
          <input name="price" type="number" min={0} defaultValue={product?.price} required className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
        </label>
        <label className="block text-sm">
          Original price
          <input name="originalPrice" type="number" min={0} defaultValue={product?.originalPrice} className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
        </label>
        <label className="block text-sm">
          Stock
          <input name="stock" type="number" min={0} defaultValue={product?.stock ?? 0} required className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
        </label>
      </div>
      <label className="block text-sm">
        Image URLs (one per line)
        <textarea name="images" defaultValue={product?.images.join("\n")} rows={4} className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
      </label>
      <label className="block text-sm">
        Sizes (comma separated)
        <input name="sizes" defaultValue={product?.sizes.join(", ")} className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
      </label>
      <label className="block text-sm">
        Colours (comma separated)
        <input name="colors" defaultValue={product?.colors.join(", ")} className="mt-1 w-full border border-[#eadfce] px-3 py-2" />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} />
        Active (visible in the store)
      </label>
      <button type="submit" disabled={pending} className="bg-maroon px-5 py-2 text-ivory disabled:opacity-60">
        {pending ? "Saving…" : "Save product"}
      </button>
      {message ? <p className="text-sm text-red-800">{message}</p> : null}
    </form>
  );
}

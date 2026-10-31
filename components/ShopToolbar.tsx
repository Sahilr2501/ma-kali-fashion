"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { PublicCategory } from "@/lib/types";

export function ShopToolbar({ categories }: { categories: PublicCategory[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const selected = params.get("category") || "";
  const query = params.get("q") || "";

  function update(next: Record<string, string>) {
    const search = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (value) search.set(key, value);
      else search.delete(key);
    });
    const qs = search.toString();
    router.push(qs ? `/shop?${qs}` : "/shop");
  }

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => update({ category: "" })}
          className={`border px-3 py-1.5 text-sm ${selected ? "border-[#eadfce]" : "border-maroon bg-maroon text-ivory"}`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => update({ category: category.slug })}
            className={`border px-3 py-1.5 text-sm ${selected === category.slug ? "border-maroon bg-maroon text-ivory" : "border-[#eadfce]"}`}
          >
            {category.name}
          </button>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          update({ q: String(data.get("q") || "") });
        }}
      >
        <label className="sr-only" htmlFor="shop-search">
          Search products
        </label>
        <input
          id="shop-search"
          name="q"
          defaultValue={query}
          placeholder="Search by name"
          className="border border-[#eadfce] bg-white px-3 py-2 text-sm"
        />
        <button type="submit" className="bg-maroon px-3 py-2 text-sm text-ivory">
          Search
        </button>
      </form>
    </div>
  );
}

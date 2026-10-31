import Link from "next/link";
import { Suspense } from "react";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductGrid } from "@/components/ProductGrid";
import { getActiveCategories, getFeaturedProducts, getNewArrivals } from "@/lib/catalog";
import { STORE_NAME } from "@/lib/constants";

async function Featured() {
  const products = await getFeaturedProducts();
  return <ProductGrid products={products} />;
}

async function Categories() {
  const categories = await getActiveCategories();
  if (categories.length === 0) {
    return <p className="text-[#6b6258]">Categories will appear here once the catalogue is connected.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

async function Arrivals() {
  const products = await getNewArrivals();
  return <ProductGrid products={products.slice(0, 8)} />;
}

export default function HomePage() {
  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden border border-[#eadfce] bg-maroon px-6 py-16 text-ivory md:px-12">
        <p className="text-xs tracking-[0.28em] text-gold uppercase">Boutique collection</p>
        <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight md:text-6xl">{STORE_NAME}</h1>
        <p className="mt-4 max-w-xl text-ivory/85">
          Ethnic wear, gold-coloured coated earrings and necklaces, and selected accessories. Browse the shop and place an order in a few steps.
        </p>
        <Link href="/shop" className="mt-8 inline-block bg-gold px-6 py-3 text-maroon">
          Shop the collection
        </Link>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-serif text-3xl text-maroon">Featured</h2>
          <Link href="/shop" className="text-sm text-maroon underline">
            View all
          </Link>
        </div>
        <Suspense fallback={<p>Loading featured products…</p>}>
          <Featured />
        </Suspense>
      </section>

      <section>
        <h2 className="mb-5 font-serif text-3xl text-maroon">Shop by category</h2>
        <Suspense fallback={<p>Loading categories…</p>}>
          <Categories />
        </Suspense>
      </section>

      <section>
        <h2 className="mb-5 font-serif text-3xl text-maroon">New arrivals</h2>
        <Suspense fallback={<p>Loading new arrivals…</p>}>
          <Arrivals />
        </Suspense>
      </section>
    </div>
  );
}

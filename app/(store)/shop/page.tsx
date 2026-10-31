import { Suspense } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { ShopToolbar } from "@/components/ShopToolbar";
import { getActiveCategories, getActiveProducts } from "@/lib/catalog";

export const metadata = { title: "Shop" };

async function ShopResults({
  category,
  query,
}: {
  category?: string;
  query?: string;
}) {
  const products = await getActiveProducts({ categorySlug: category, query });
  return <ProductGrid products={products} />;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const categories = await getActiveCategories();

  return (
    <div>
      <h1 className="font-serif text-4xl text-maroon">Shop</h1>
      <p className="mt-2 mb-6 text-[#5c534b]">Browse clothing, earrings, necklaces, and accessories.</p>
      <Suspense fallback={null}>
        <ShopToolbar categories={categories} />
      </Suspense>
      <Suspense fallback={<p>Loading products…</p>}>
        <ShopResults category={params.category} query={params.q} />
      </Suspense>
    </div>
  );
}

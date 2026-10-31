import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { getActiveProducts, getCategoryBySlug } from "@/lib/catalog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name || "Category" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const products = await getActiveProducts({ categorySlug: slug });

  return (
    <div>
      <h1 className="font-serif text-4xl text-maroon">{category.name}</h1>
      {category.description ? <p className="mt-2 mb-6 text-[#5c534b]">{category.description}</p> : <div className="mb-6" />}
      <ProductGrid products={products} />
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPurchase } from "@/components/ProductPurchase";
import { getProductBySlug } from "@/lib/catalog";
import { formatINR } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name || "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <ProductGallery images={product.images} name={product.name} />
      <div>
        {product.category ? (
          <Link href={`/categories/${product.category.slug}`} className="text-sm text-maroon underline">
            {product.category.name}
          </Link>
        ) : null}
        <h1 className="mt-2 font-serif text-4xl text-maroon">{product.name}</h1>
        <p className="mt-3 text-xl">
          {formatINR(product.price)}
          {product.originalPrice && product.originalPrice > product.price ? (
            <span className="ml-2 text-base text-[#7a7168] line-through">{formatINR(product.originalPrice)}</span>
          ) : null}
        </p>
        <p className={`mt-2 text-sm ${product.inStock ? "text-emerald-800" : "text-red-800"}`}>
          {product.inStock ? `${product.stock} in stock` : "Out of stock"}
        </p>
        <p className="mt-5 whitespace-pre-line text-[#4a433d]">{product.description}</p>
        <ProductPurchase product={product} />
      </div>
    </div>
  );
}

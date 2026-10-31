import { notFound, redirect } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { isObjectId } from "@/lib/validation";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) redirect("/admin/login");
  const { id } = await params;
  if (!isObjectId(id)) notFound();
  await connectDB();
  const [product, categories] = await Promise.all([
    Product.findById(id).lean(),
    Category.find({}).sort({ name: 1 }).lean(),
  ]);
  if (!product) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-serif text-4xl text-maroon">Edit product</h1>
      <ProductForm
        categories={categories.map((category) => ({ _id: String(category._id), name: category.name }))}
        product={{
          _id: String(product._id),
          name: product.name,
          description: product.description,
          categoryId: String(product.categoryId),
          price: product.price,
          originalPrice: product.originalPrice ?? undefined,
          images: product.images ?? [],
          stock: product.stock,
          sizes: product.sizes ?? [],
          colors: product.colors ?? [],
          isActive: product.isActive,
        }}
      />
    </div>
  );
}

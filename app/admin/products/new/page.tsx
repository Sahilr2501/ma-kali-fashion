import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { redirect } from "next/navigation";

export const metadata = { title: "Add product" };

export default async function NewProductPage() {
  if (!(await requireAdmin())) redirect("/admin/login");
  await connectDB();
  const categories = await Category.find({}).sort({ name: 1 }).lean();

  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 font-serif text-4xl text-maroon">Add product</h1>
      <ProductForm
        categories={categories.map((category) => ({ _id: String(category._id), name: category.name }))}
      />
    </div>
  );
}

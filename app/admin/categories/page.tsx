import { CategoryManager } from "@/components/admin/CategoryManager";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { redirect } from "next/navigation";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  if (!(await requireAdmin())) redirect("/admin/login");
  await connectDB();
  const categories = await Category.find({}).sort({ name: 1 }).lean();

  return (
    <div>
      <h1 className="mb-6 font-serif text-4xl text-maroon">Categories</h1>
      <CategoryManager
        categories={categories.map((category) => ({
          _id: String(category._id),
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          isActive: category.isActive,
        }))}
      />
    </div>
  );
}

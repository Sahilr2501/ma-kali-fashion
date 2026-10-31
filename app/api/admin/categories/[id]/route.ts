import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { connectDB } from "@/lib/mongodb";
import { jsonError, jsonOk } from "@/lib/request";
import { isObjectId, validateCategoryInput } from "@/lib/validation";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return jsonError("Authentication required.", 401);
  const { id } = await params;
  if (!isObjectId(id)) return jsonError("Category not found.", 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Category details could not be read.", 400);
  }

  const parsed = validateCategoryInput(body, true);
  if (!parsed.data || Object.keys(parsed.errors).length > 0) {
    return jsonError("Please correct the category details.", 400, { errors: parsed.errors });
  }

  await connectDB();
  const updates: Record<string, unknown> = {};
  const data = parsed.data;
  if (data.name) {
    updates.name = data.name;
    updates.slug = data.slug ? slugify(data.slug) : slugify(data.name);
  } else if (data.slug) {
    updates.slug = slugify(data.slug);
  }
  if (data.description !== undefined) updates.description = data.description;
  if (data.image !== undefined) updates.image = data.image;
  if (data.isActive !== undefined) updates.isActive = data.isActive;

  const category = await Category.findByIdAndUpdate(id, updates, { new: true });
  if (!category) return jsonError("Category not found.", 404);
  return jsonOk({ category });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return jsonError("Authentication required.", 401);
  const { id } = await params;
  if (!isObjectId(id)) return jsonError("Category not found.", 404);
  await connectDB();
  const inUse = await Product.countDocuments({ categoryId: id });
  if (inUse > 0) {
    return jsonError("Reassign or delete products in this category before removing it.", 409);
  }
  const category = await Category.findByIdAndDelete(id);
  if (!category) return jsonError("Category not found.", 404);
  return jsonOk({ message: "Category deleted." });
}

import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { connectDB } from "@/lib/mongodb";
import { jsonError, jsonOk } from "@/lib/request";
import { isObjectId, validateProductInput } from "@/lib/validation";
import { Product } from "@/models/Product";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return jsonError("Authentication required.", 401);
  const { id } = await params;
  if (!isObjectId(id)) return jsonError("Product not found.", 404);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Product details could not be read.", 400);
  }

  const parsed = validateProductInput(body, true);
  if (!parsed.data || Object.keys(parsed.errors).length > 0) {
    return jsonError("Please correct the product details.", 400, { errors: parsed.errors });
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
  if (data.categoryId) updates.categoryId = data.categoryId;
  if (data.price !== undefined) updates.price = data.price;
  if (data.originalPrice !== undefined) updates.originalPrice = data.originalPrice;
  if (data.images) updates.images = data.images;
  if (data.stock !== undefined) updates.stock = data.stock;
  if (data.sizes) updates.sizes = data.sizes;
  if (data.colors) updates.colors = data.colors;
  if (data.isActive !== undefined) updates.isActive = data.isActive;

  const product = await Product.findByIdAndUpdate(id, updates, { new: true });
  if (!product) return jsonError("Product not found.", 404);
  return jsonOk({ product });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return jsonError("Authentication required.", 401);
  const { id } = await params;
  if (!isObjectId(id)) return jsonError("Product not found.", 404);
  await connectDB();
  const product = await Product.findByIdAndDelete(id);
  if (!product) return jsonError("Product not found.", 404);
  return jsonOk({ message: "Product deleted." });
}

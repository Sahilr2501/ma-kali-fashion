import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { jsonError, jsonOk } from "@/lib/request";
import { slugify } from "@/lib/format";
import { validateProductInput } from "@/lib/validation";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export async function GET() {
  if (!(await requireAdmin())) return jsonError("Authentication required.", 401);
  await connectDB();
  const products = await Product.find({})
    .populate("categoryId", "name slug")
    .sort({ updatedAt: -1 })
    .lean();
  return jsonOk({ products });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return jsonError("Authentication required.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Product details could not be read.", 400);
  }

  const parsed = validateProductInput(body);
  if (!parsed.data?.name || !parsed.data.description || !parsed.data.categoryId) {
    return jsonError("Please correct the product details.", 400, { errors: parsed.errors });
  }

  await connectDB();
  const category = await Category.findById(parsed.data.categoryId);
  if (!category) return jsonError("Choose a valid category.", 400);

  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);
  const existing = await Product.findOne({ slug });
  if (existing) return jsonError("A product with this name already exists.", 409);

  const product = await Product.create({
    name: parsed.data.name,
    slug,
    description: parsed.data.description,
    categoryId: parsed.data.categoryId,
    price: parsed.data.price,
    originalPrice: parsed.data.originalPrice,
    images: parsed.data.images ?? [],
    stock: parsed.data.stock ?? 0,
    sizes: parsed.data.sizes ?? [],
    colors: parsed.data.colors ?? [],
    isActive: parsed.data.isActive ?? true,
  });

  return jsonOk({ product }, 201);
}

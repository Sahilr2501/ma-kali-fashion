import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { connectDB } from "@/lib/mongodb";
import { jsonError, jsonOk } from "@/lib/request";
import { validateCategoryInput } from "@/lib/validation";
import { Category } from "@/models/Category";

export async function GET() {
  if (!(await requireAdmin())) return jsonError("Authentication required.", 401);
  await connectDB();
  const categories = await Category.find({}).sort({ name: 1 }).lean();
  return jsonOk({ categories });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return jsonError("Authentication required.", 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Category details could not be read.", 400);
  }

  const parsed = validateCategoryInput(body);
  if (!parsed.data?.name) {
    return jsonError("Please correct the category details.", 400, { errors: parsed.errors });
  }

  await connectDB();
  const slug = parsed.data.slug ? slugify(parsed.data.slug) : slugify(parsed.data.name);
  const existing = await Category.findOne({ slug });
  if (existing) return jsonError("A category with this name already exists.", 409);

  const category = await Category.create({
    name: parsed.data.name,
    slug,
    description: parsed.data.description || "",
    image: parsed.data.image || "",
    isActive: parsed.data.isActive ?? true,
  });

  return jsonOk({ category }, 201);
}

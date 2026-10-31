import mongoose from "mongoose";
import { connectDB, isDatabaseConfigured } from "./mongodb";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import type { PublicCategory, PublicProduct } from "./types";

type ProductLean = {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  categoryId:
    | mongoose.Types.ObjectId
    | {
        _id: mongoose.Types.ObjectId;
        name: string;
        slug: string;
        description?: string;
        image?: string;
      };
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  sizes?: string[];
  colors?: string[];
  isActive: boolean;
};

function toCategory(doc: {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}): PublicCategory {
  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description || "",
    image: doc.image || "",
  };
}

export function serializeProduct(doc: ProductLean): PublicProduct {
  const category =
    doc.categoryId && typeof doc.categoryId === "object" && "name" in doc.categoryId
      ? toCategory(doc.categoryId)
      : null;

  return {
    id: String(doc._id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    category,
    price: doc.price,
    originalPrice: doc.originalPrice,
    images: doc.images?.filter(Boolean) ?? [],
    stock: doc.stock,
    sizes: doc.sizes ?? [],
    colors: doc.colors ?? [],
    inStock: doc.stock > 0,
  };
}

export async function getActiveCategories(): Promise<PublicCategory[]> {
  if (!isDatabaseConfigured()) return [];
  await connectDB();
  const rows = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
  return rows.map((row) => toCategory(row));
}

export async function getAllCategories() {
  await connectDB();
  return Category.find({}).sort({ name: 1 }).lean();
}

export async function getCategoryBySlug(slug: string): Promise<PublicCategory | null> {
  if (!isDatabaseConfigured()) return null;
  await connectDB();
  const row = await Category.findOne({ slug, isActive: true }).lean();
  return row ? toCategory(row) : null;
}

export async function getActiveProducts(options?: {
  categorySlug?: string;
  query?: string;
  limit?: number;
}): Promise<PublicProduct[]> {
  if (!isDatabaseConfigured()) return [];
  await connectDB();

  const filter: Record<string, unknown> = { isActive: true };
  if (options?.categorySlug) {
    const category = await Category.findOne({ slug: options.categorySlug, isActive: true }).lean();
    if (!category) return [];
    filter.categoryId = category._id;
  }
  if (options?.query) {
    filter.name = { $regex: options.query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  }

  const rows = await Product.find(filter)
    .populate("categoryId", "name slug description image")
    .sort({ createdAt: -1 })
    .limit(options?.limit ?? 100)
    .lean();

  return rows.map((row) => serializeProduct(row as unknown as ProductLean));
}

export async function getProductBySlug(slug: string): Promise<PublicProduct | null> {
  if (!isDatabaseConfigured()) return null;
  await connectDB();
  const row = await Product.findOne({ slug, isActive: true })
    .populate("categoryId", "name slug description image")
    .lean();
  return row ? serializeProduct(row as unknown as ProductLean) : null;
}

export async function getProductById(id: string): Promise<PublicProduct | null> {
  if (!isDatabaseConfigured() || !mongoose.Types.ObjectId.isValid(id)) return null;
  await connectDB();
  const row = await Product.findOne({ _id: id, isActive: true })
    .populate("categoryId", "name slug description image")
    .lean();
  return row ? serializeProduct(row as unknown as ProductLean) : null;
}

export async function getFeaturedProducts() {
  return getActiveProducts({ limit: 4 });
}

export async function getNewArrivals() {
  return getActiveProducts({ limit: 8 });
}

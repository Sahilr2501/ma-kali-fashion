import { getProductById } from "@/lib/catalog";
import { jsonError, jsonOk } from "@/lib/request";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return jsonError("Product not found.", 404);
  return jsonOk({ product });
}

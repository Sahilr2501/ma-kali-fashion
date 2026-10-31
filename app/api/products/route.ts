import { getActiveProducts } from "@/lib/catalog";
import { jsonOk } from "@/lib/request";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const products = await getActiveProducts({
    categorySlug: searchParams.get("category") || undefined,
    query: searchParams.get("q") || undefined,
  });
  return jsonOk({ products });
}

import { getActiveCategories } from "@/lib/catalog";
import { jsonOk } from "@/lib/request";

export async function GET() {
  const categories = await getActiveCategories();
  return jsonOk({ categories });
}

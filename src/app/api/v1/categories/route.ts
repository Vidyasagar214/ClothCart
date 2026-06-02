import { listCategories } from "@/lib/products/catalog";
import { jsonOk } from "@/lib/api/response";

export async function GET() {
  const categories = await listCategories();
  return jsonOk({ data: categories });
}

import { requireAuth, unauthorized } from "@/lib/api/auth";
import { removeFromWishlist } from "@/lib/services/wishlist";

interface RouteParams {
  params: Promise<{ productId: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { productId } = await params;
  await removeFromWishlist(auth.supabase, auth.user.id, productId);
  return new Response(null, { status: 204 });
}

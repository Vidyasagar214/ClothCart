import { requireAuth, unauthorized } from "@/lib/api/auth";
import { deleteAddress } from "@/lib/services/addresses";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const auth = await requireAuth();
  if (!auth) return unauthorized();
  const { id } = await params;
  await deleteAddress(auth.supabase, auth.user.id, id);
  return new Response(null, { status: 204 });
}

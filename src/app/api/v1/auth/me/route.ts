import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { isSupabaseConfigured } from "@/lib/env";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return jsonError("CONFIG_ERROR", "Supabase is not configured", 503);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("UNAUTHORIZED", "Not authenticated", 401);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, created_at")
    .eq("id", user.id)
    .single();

  return jsonOk({
    id: user.id,
    email: user.email!,
    fullName: profile?.full_name ?? user.email!.split("@")[0],
    role: profile?.role ?? "customer",
    createdAt: profile?.created_at ?? user.created_at,
  });
}

import { createClient } from "@/lib/supabase/server";
import { jsonError } from "@/lib/api/response";
import { isSupabaseConfigured } from "@/lib/env";

export async function POST() {
  if (!isSupabaseConfigured()) {
    return jsonError("CONFIG_ERROR", "Supabase is not configured", 503);
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  return new Response(null, { status: 204 });
}

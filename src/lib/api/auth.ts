import { createClient } from "@/lib/supabase/server";
import { jsonError } from "@/lib/api/response";

export async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return { supabase, user };
}

export function unauthorized() {
  return jsonError("UNAUTHORIZED", "Authentication required", 401);
}

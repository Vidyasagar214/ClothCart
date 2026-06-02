import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { loginSchema } from "@/lib/validators/auth";
import { isSupabaseConfigured } from "@/lib/env";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonError("CONFIG_ERROR", "Supabase is not configured", 503);
  }

  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("VALIDATION_ERROR", "Invalid email or password", 400);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("email not confirmed") || msg.includes("not confirmed")) {
      return jsonError(
        "EMAIL_NOT_CONFIRMED",
        "Please confirm your email before signing in. Check your inbox for the confirmation link.",
        403
      );
    }
    return jsonError("INVALID_CREDENTIALS", "Invalid email or password", 401);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, created_at")
    .eq("id", data.user.id)
    .single();

  return jsonOk({
    user: {
      id: data.user.id,
      email: data.user.email!,
      fullName: profile?.full_name ?? data.user.email!.split("@")[0],
      role: profile?.role ?? "customer",
    },
    session: data.session,
  });
}

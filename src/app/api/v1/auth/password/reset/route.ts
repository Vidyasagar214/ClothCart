import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { resetPasswordSchema } from "@/lib/validators/auth";
import { getAuthCallbackUrl, isSupabaseConfigured } from "@/lib/env";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonError("CONFIG_ERROR", "Supabase is not configured", 503);
  }

  const body = await request.json();
  const parsed = resetPasswordSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("VALIDATION_ERROR", "Valid email required", 400);
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: getAuthCallbackUrl("/reset-password"),
  });

  return jsonOk({ message: "If an account exists, a reset link has been sent." });
}

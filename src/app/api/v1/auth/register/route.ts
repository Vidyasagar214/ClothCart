import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jsonError, jsonOk } from "@/lib/api/response";
import { registerSchema } from "@/lib/validators/auth";
import { getAuthCallbackUrl, isSupabaseConfigured } from "@/lib/env";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return jsonError("CONFIG_ERROR", "Supabase is not configured", 503);
  }

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input", 400);
  }

  const { email, password, fullName } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: getAuthCallbackUrl("/"),
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return jsonError("EMAIL_EXISTS", "Email already registered", 409);
    }
    return jsonError("REGISTER_FAILED", error.message, 400);
  }

  if (!data.user) {
    return jsonError("REGISTER_FAILED", "Could not create account", 400);
  }

  await supabase.from("profiles").update({ full_name: fullName }).eq("id", data.user.id);

  const emailConfirmationRequired = !data.session;

  return jsonOk(
    {
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName,
        role: "customer",
      },
      session: data.session,
      emailConfirmationRequired,
    },
    201
  );
}

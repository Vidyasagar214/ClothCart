import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", errorDescription ?? error);
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createClient();
  let exchangeError: Error | null = null;

  if (code) {
    const { error: err } = await supabase.auth.exchangeCodeForSession(code);
    exchangeError = err;
  } else if (tokenHash && type) {
    const { error: err } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });
    exchangeError = err;
  } else {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", "Missing confirmation code. Request a new link.");
    return NextResponse.redirect(loginUrl);
  }

  if (exchangeError) {
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("error", exchangeError.message);
    return NextResponse.redirect(loginUrl);
  }

  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const redirectUrl = new URL(safeNext, origin);

  if (safeNext === "/" || safeNext === "/login") {
    redirectUrl.searchParams.set("emailConfirmed", "1");
  }

  return NextResponse.redirect(redirectUrl);
}

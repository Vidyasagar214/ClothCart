export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

/** Redirect URL for Supabase email links (confirm signup, magic link, password reset). */
export function getAuthCallbackUrl(next = "/"): string {
  const url = new URL("/auth/callback", getAppUrl());
  url.searchParams.set("next", next);
  return url.toString();
}

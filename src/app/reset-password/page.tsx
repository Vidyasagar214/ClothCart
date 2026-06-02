"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthCard, AuthField } from "@/components/auth/auth-form";
import { isSupabaseConfigured } from "@/lib/env";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (!configured) {
      setReady(false);
      return;
    }
    import("@/lib/supabase/client").then(({ createClient }) => {
      createClient().auth.getSession().then(({ data }) => {
        setReady(Boolean(data.session));
      });
    });
  }, [configured]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;
    setLoading(true);
    setError("");
    const password = new FormData(e.currentTarget).get("password") as string;

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Could not update password.");
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <AuthCard title="Reset password" subtitle="Supabase is not configured">
        <p className="text-sm text-slate-400 text-center">Configure Supabase to enable password reset.</p>
      </AuthCard>
    );
  }

  if (!ready && !success) {
    return (
      <AuthCard title="Reset password" subtitle="Loading...">
        <p className="text-sm text-slate-400 text-center">
          Open the reset link from your email to set a new password.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set new password"
      subtitle={success ? "Password updated!" : "Choose a strong new password"}
      footer={
        <Link href="/login" className="text-violet-400 hover:text-violet-300">
          Back to sign in
        </Link>
      }
    >
      {success ? (
        <p className="text-emerald-400 text-sm text-center">Redirecting to sign in...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthField
            label="New Password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}

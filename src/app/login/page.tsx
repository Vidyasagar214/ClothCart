"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { AuthCard, AuthField, AuthLink } from "@/components/auth/auth-form";
import { cn } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const authError = searchParams.get("error");
  const emailConfirmed = searchParams.get("emailConfirmed") === "1";
  const setUser = useAuthStore((s) => s.setUser);
  const loginMock = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<"login" | "otp">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(
    emailConfirmed
      ? "Email confirmed! You can sign in now."
      : authError ?? ""
  );

  useEffect(() => {
    if (user) router.replace(redirect);
  }, [user, router, redirect]);

  if (user) return null;

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 503) {
        loginMock(email, password);
        router.push(redirect);
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "Login failed");
        setNotice("");
        return;
      }

      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.fullName,
        role: data.user.role,
        joined: new Date().toISOString(),
      });
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to track orders and save favorites"
      footer={
        <>
          Don&apos;t have an account? <AuthLink href="/register">Create one</AuthLink>
        </>
      }
    >
      <div className="flex rounded-xl bg-white/5 p-1 mb-6">
        {(["login", "otp"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-colors",
              tab === t ? "bg-violet-600 text-white" : "text-slate-400"
            )}
          >
            {t === "otp" ? "OTP (soon)" : "Sign In"}
          </button>
        ))}
      </div>

      {tab === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <AuthField label="Email" name="email" type="email" required autoComplete="email" />
          <AuthField label="Password" name="password" type="password" required minLength={8} autoComplete="current-password" />
          <div className="text-right">
            <AuthLink href="/forgot-password">Forgot password?</AuthLink>
          </div>
          {notice && !error && (
            <p className={cn("text-sm", emailConfirmed ? "text-emerald-400" : "text-amber-400")}>
              {notice}
            </p>
          )}
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-slate-400 text-center py-4">
          Mobile OTP login will be available in a future update.
        </p>
      )}
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="pt-24 text-center text-slate-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { AuthCard, AuthField } from "@/components/auth/auth-form";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);

    const body = {
      email: fd.get("email") as string,
      password: fd.get("password") as string,
      fullName: fd.get("name") as string,
    };

    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message ?? "Registration failed");
        return;
      }

      if (data.emailConfirmationRequired || !data.session) {
        setPendingEmail(data.user.email);
        return;
      }

      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.fullName,
        role: data.user.role,
        joined: new Date().toISOString(),
      });

      router.push("/");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (pendingEmail) {
    return (
      <AuthCard
        title="Check your email"
        subtitle="One last step to activate your account"
        footer={
          <Link href="/login" className="text-violet-400 hover:text-violet-300">
            Back to sign in
          </Link>
        }
      >
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-violet-500/20 flex items-center justify-center text-2xl">
            ✉️
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            We sent a confirmation link to{" "}
            <strong className="text-white">{pendingEmail}</strong>. Open it to verify your email,
            then sign in.
          </p>
          <p className="text-xs text-slate-500">
            The link opens ClothCart and signs you in automatically after confirmation.
          </p>
          <Button variant="outline" className="w-full" onClick={() => setPendingEmail(null)}>
            Use a different email
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Join ClothCart for a premium shopping experience"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField label="Full Name" name="name" required autoComplete="name" />
        <AuthField label="Email" name="email" type="email" required autoComplete="email" />
        <AuthField
          label="Password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Min 8 chars, 1 uppercase, 1 number"
        />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </AuthCard>
  );
}

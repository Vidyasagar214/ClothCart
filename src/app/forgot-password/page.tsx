"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthCard, AuthField } from "@/components/auth/auth-form";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const email = new FormData(e.currentTarget).get("email") as string;

    try {
      const res = await fetch("/api/v1/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message ?? "Request failed");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle="We'll send a reset link to your email"
      footer={
        <Link href="/login" className="text-violet-400 hover:text-violet-300">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <p className="text-slate-300 text-sm text-center">
          If an account exists for that email, a reset link has been sent. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthField label="Email" name="email" type="email" required autoComplete="email" />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}

"use client";

import Link from "next/link";
import { AccountSidebar } from "@/components/layout/account-sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReturnsPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace("/login?redirect=/returns");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <AccountSidebar />
        <div className="md:col-span-3 glass rounded-2xl p-8 text-center">
          <h1 className="font-display text-2xl font-bold mb-3">Returns & Refunds</h1>
          <p className="text-slate-400 mb-6">Request returns within 7 days of delivery from your order history.</p>
          <Link href="/orders" className="btn-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm inline-block">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AccountSidebar } from "@/components/layout/account-sidebar";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) router.replace("/login?redirect=/profile");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <AccountSidebar />
        <div className="md:col-span-3">
          <div className="glass rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-3xl font-bold">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">{user.name}</h1>
                <p className="text-slate-400">{user.email}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Member since {new Date(user.joined).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <h2 className="font-display text-lg font-bold mb-4">Edit Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Full Name</label>
                  <input defaultValue={user.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-violet-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <input defaultValue={user.email} readOnly className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed" />
                </div>
              </div>
              <button type="submit" className="btn-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-6 sm:p-8">{children}</main>
    </div>
  );
}

import { getCurrentUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Strict Server-Side Role Check
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Dedicated Admin Sidebar / Header */}
      <aside className="w-full md:w-64 bg-[#1a1a2e] text-white flex-shrink-0 flex flex-col border-r border-white/10">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              Skill<span className="text-accent">It</span>Admin
            </span>
          </Link>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/20 text-accent uppercase">
            {user.role}
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>👥</span> Users
          </Link>
          <Link
            href="/admin/careers"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>📚</span> Careers & Paths
          </Link>
          <Link
            href="/admin/certificates"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span>🎓</span> Certificate Templates
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <span className="truncate">{user.fullName}</span>
          <Link href="/" className="text-accent hover:underline">
            Exit Admin →
          </Link>
        </div>
      </aside>

      {/* Main Admin Body */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

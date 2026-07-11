import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminCareersClient } from "./careers-client";

export default async function AdminCareersPage() {
  const user = await requireRole(["admin", "super_admin"]).catch(() => null);
  if (!user) redirect("/login");

  const careers = await prisma.career.findMany({
    orderBy: { createdAt: "asc" },
    include: { paths: { select: { id: true } } },
  });

  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 bg-green-50 dark:bg-[#1a1a2e] shadow-lg">
        <div className="container-page flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold text-white">Skill<span className="text-accent">It</span>Learn</Link>
            <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold uppercase">Admin</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-white/75">
            <Link href="/admin" className="hover:text-accent transition-colors">Users</Link>
            <Link href="/admin/careers" className="text-accent font-semibold">Content</Link>
          </div>
        </div>
      </header>

      <div className="container-page py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Manage Careers</h1>
            <p className="text-sm text-text-secondary">{careers.length} careers · Click to manage paths</p>
          </div>
        </div>

        <AdminCareersClient
          careers={careers.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            pathCount: c.paths.length,
          }))}
        />
      </div>
    </main>
  );
}

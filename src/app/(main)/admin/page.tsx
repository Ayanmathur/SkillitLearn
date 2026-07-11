import { getCurrentUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminUserTable } from "./user-table";

/**
 * Admin layout - server-side role check.
 *
 * CRITICAL: The middleware already redirects unauthenticated users.
 * This page re-checks the role from the DATABASE (not JWT/session).
 * Only super_admin and admin roles are allowed.
 */
export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    redirect("/");
  }

  // Fetch all users for the admin table
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-navy-header">
        <div className="container-page flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-bold text-white tracking-tight">
              Skill<span className="text-accent">It</span>Learn
            </a>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/80">
            <span>{user.fullName}</span>
            <span className="text-accent text-xs font-semibold uppercase">
              {user.role}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-page py-8">
        {/* Quick Nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a href="/admin/careers" className="card compact text-center hover:shadow-card-hover transition-all group">
            <div className="text-2xl mb-1">📚</div>
            <div className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">Manage Careers</div>
          </a>
          <a href="/admin/certificates" className="card compact text-center hover:shadow-card-hover transition-all group">
            <div className="text-2xl mb-1">🎓</div>
            <div className="text-sm font-semibold text-text-primary group-hover:text-accent transition-colors">Certificate Templates</div>
          </a>
        </div>

        <div className="mb-8">
          <h2 className="mb-1">User Management</h2>
          <p className="text-text-secondary">
            Promote users to instructor or admin roles. Changes take effect immediately.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: users.length,
              color: "text-text-primary",
            },
            {
              label: "Learners",
              value: users.filter((u) => u.role === "learner").length,
              color: "text-accent",
            },
            {
              label: "Instructors",
              value: users.filter((u) => u.role === "instructor").length,
              color: "text-blue-500",
            },
            {
              label: "Admins",
              value: users.filter(
                (u) => u.role === "admin" || u.role === "super_admin"
              ).length,
              color: "text-red-500",
            },
          ].map((stat) => (
            <div key={stat.label} className="card compact text-center">
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-text-muted font-semibold uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* User Table */}
        <AdminUserTable users={users} currentUserId={user.id} />
      </div>
    </main>
  );
}

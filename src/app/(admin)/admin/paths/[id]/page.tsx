import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { PathDetailClient } from "./path-detail-client";

interface Props { params: Promise<{ id: string }> }

export default async function AdminPathPage({ params }: Props) {
  const user = await requireRole(["admin", "super_admin"]).catch(() => null);
  if (!user) redirect("/login");
  const { id } = await params;

  const path = await prisma.path.findUnique({
    where: { id },
    include: {
      career: { select: { id: true, name: true } },
      skills: {
        orderBy: { orderIndex: "asc" },
        include: { tracks: { select: { id: true } } },
      },
    },
  });
  if (!path) notFound();

  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 bg-green-50 dark:bg-[#1a1a2e] shadow-lg">
        <div className="container-page flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold text-white">Skill<span className="text-accent">It</span>Learn</Link>
            <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold uppercase">Admin</span>
          </div>
          <nav className="flex items-center gap-2 text-xs text-white/60">
            <Link href="/admin/careers" className="hover:text-accent">Careers</Link>
            <span>/</span>
            <Link href={`/admin/careers/${path.career.id}`} className="hover:text-accent">{path.career.name}</Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-white/80">{path.name}</span>
          </nav>
        </div>
      </header>

      <div className="container-page py-8">
        <PathDetailClient
          path={{ id: path.id, name: path.name, slug: path.slug, description: path.description, careerId: path.career.id }}
          skills={path.skills.map((s) => ({
            id: s.id, name: s.name, slug: s.slug, description: s.description,
            estimatedHours: s.estimatedHours, moduleCount: s.tracks.length,
          }))}
        />
      </div>
    </main>
  );
}

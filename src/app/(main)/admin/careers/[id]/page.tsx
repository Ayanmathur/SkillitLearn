import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CareerDetailClient } from "./career-detail-client";

interface Props { params: Promise<{ id: string }> }

export default async function AdminCareerDetailPage({ params }: Props) {
  const user = await requireRole(["admin", "super_admin"]).catch(() => null);
  if (!user) redirect("/login");
  const { id } = await params;

  const career = await prisma.career.findUnique({
    where: { id },
    include: {
      paths: {
        orderBy: { orderIndex: "asc" },
        include: { skills: { select: { id: true } } },
      },
    },
  });

  if (!career) notFound();

  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 bg-green-50 shadow-lg">
        <div className="container-page flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold text-white">Skill<span className="text-accent">It</span>Learn</Link>
            <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold uppercase">Admin</span>
          </div>
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/admin/careers" className="hover:text-accent transition-colors">← Careers</Link>
          </nav>
        </div>
      </header>

      <div className="container-page py-8">
        <CareerDetailClient
          career={{ id: career.id, name: career.name, slug: career.slug, description: career.description }}
          paths={career.paths.map((p) => ({
            id: p.id, name: p.name, slug: p.slug, description: p.description,
            skillCount: p.skills.length,
          }))}
        />
      </div>
    </main>
  );
}

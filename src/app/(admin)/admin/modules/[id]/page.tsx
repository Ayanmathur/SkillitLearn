import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { TrackDetailClient } from "./module-detail-client";

interface Props { params: Promise<{ id: string }> }

export default async function AdminTrackPage({ params }: Props) {
  const user = await requireRole(["admin", "super_admin"]).catch(() => null);
  if (!user) redirect("/login");
  const { id } = await params;

  const mod = await prisma.track.findUnique({
    where: { id },
    include: {
      skill: {
        include: { path: { include: { career: { select: { id: true, name: true } } } } },
      },
      steps: { orderBy: { orderIndex: "asc" } },
    },
  });
  if (!mod) notFound();

  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 bg-green-50 dark:bg-[#1a1a2e] shadow-lg">
        <div className="container-page flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold text-white">Skill<span className="text-accent">It</span>Learn</Link>
            <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold uppercase">Admin</span>
          </div>
          <nav className="flex items-center gap-2 text-xs text-white/60 flex-wrap">
            <Link href={`/admin/skills/${mod.skill.id}`} className="hover:text-accent">{mod.skill.name}</Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-white/80">{mod.title}</span>
          </nav>
        </div>
      </header>
      <div className="container-page py-8">
        <TrackDetailClient
          track={{ id: mod.id, title: mod.title, skillId: mod.skill.id }}
          steps={mod.steps.map((s) => ({ id: s.id, title: s.title, content: s.content }))}
        />
      </div>
    </main>
  );
}

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { SkillDetailClient } from "./skill-detail-client";

interface Props { params: Promise<{ id: string }> }

export default async function AdminSkillPage({ params }: Props) {
  const user = await requireRole(["admin", "super_admin"]).catch(() => null);
  if (!user) redirect("/login");
  const { id } = await params;

  const skill = await prisma.skill.findUnique({
    where: { id },
    include: {
      path: { include: { career: { select: { id: true, name: true } } } },
      modules: {
        orderBy: { orderIndex: "asc" },
        include: { steps: { select: { id: true } } },
      },
      quizQuestions: {
        orderBy: { orderIndex: "asc" },
        select: { id: true, questionText: true, choicesJson: true, correctChoiceId: true, explanation: true, orderIndex: true },
      },
    },
  });
  if (!skill) notFound();

  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 bg-green-50 shadow-lg">
        <div className="container-page flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold text-white">Skill<span className="text-accent">It</span>Learn</Link>
            <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-accent font-semibold uppercase">Admin</span>
          </div>
          <nav className="flex items-center gap-2 text-xs text-white/60 flex-wrap">
            <Link href="/admin/careers" className="hover:text-accent">Careers</Link><span>/</span>
            <Link href={`/admin/careers/${skill.path.career.id}`} className="hover:text-accent">{skill.path.career.name}</Link><span>/</span>
            <Link href={`/admin/paths/${skill.path.id}`} className="hover:text-accent">{skill.path.name}</Link><span>/</span>
            <span className="text-gray-700">{skill.name}</span>
          </nav>
        </div>
      </header>
      <div className="container-page py-8">
        <SkillDetailClient
          skill={{ id: skill.id, name: skill.name, slug: skill.slug, description: skill.description, estimatedHours: skill.estimatedHours, pathId: skill.path.id }}
          modules={skill.modules.map((m) => ({ id: m.id, title: m.title, stepCount: m.steps.length }))}
          questions={skill.quizQuestions.map((q) => ({
            id: q.id, questionText: q.questionText,
            choicesJson: q.choicesJson as Array<{id: string; text: string}>,
            correctChoiceId: q.correctChoiceId, explanation: q.explanation,
          }))}
        />
      </div>
    </main>
  );
}

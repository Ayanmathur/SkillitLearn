import { prisma } from "@/lib/prisma";
import { getPathBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/app/auth/actions";
import { AuthPrompt } from "@/components/auth-prompt";
import { CertificateButton } from "./certificate-button";
import type { Metadata } from "next";
import { Prefetcher } from "@/components/prefetcher";

interface Props {
  params: Promise<{ slug: string; pathSlug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pathSlug } = await params;
  const path = await getPathBySlug(pathSlug);
  if (!path) return { title: "Path Not Found" };
  return {
    title: `${path.name} - SkillItLearn`,
    description: path.description,
  };
}

export default async function PathDetailPage({ params }: Props) {
  const { slug: careerSlug, pathSlug } = await params;

  const path = await getPathBySlug(pathSlug);

  if (!path) notFound();

  const user = await getCurrentUser();
  const totalHours = path.skills.reduce((s, sk) => s + sk.estimatedHours, 0);
  const totalSkills = path.skills.length;

  // ── Progress tracking ──────────────────────────────────
  type SkillStatus = "not_started" | "in_progress" | "complete";

  interface SkillProgressInfo {
    skillId: string;
    status: SkillStatus;
    stepsCompleted: number;
    stepsTotal: number;
    quizPassed: boolean;
  }

  const skillProgress: Map<string, SkillProgressInfo> = new Map();
  let completedSkills = 0;
  let allComplete = false;
  let hasCertificate = false;
  let certId: string | null = null;
  let hasTemplate = false;

  if (user) {
    try {
      // Batch queries for all skills
      const allStepIds = path.skills.flatMap((sk: any) =>
        sk.modules.flatMap((m: any) => m.steps.map((s: any) => s.id))
      );

      const [completedSteps, completions, existingCert, template] = await Promise.all([
        prisma.learnerProgress.findMany({
          where: { userId: user.id, stepId: { in: allStepIds } },
          select: { stepId: true },
        }).catch(() => []),
        prisma.skillCompletion.findMany({
          where: {
            userId: user.id,
            skillId: { in: path.skills.map((s) => s.id) },
          },
          select: { skillId: true, quizPassed: true, stepsCompleted: true },
        }).catch(() => []),
        prisma.certificate.findFirst({
          where: { userId: user.id, pathId: path.id, revoked: false },
          select: { uniqueCertificateId: true },
        }).catch(() => null),
        prisma.pathCertificateTemplate.findFirst({
          where: { pathId: path.id },
          select: { id: true },
        }).catch(() => null),
      ]);

      const completedStepSet = new Set(completedSteps.map((s) => s.stepId));
      const completionMap = new Map(completions.map((c) => [c.skillId, c]));

      hasCertificate = !!existingCert;
      certId = existingCert?.uniqueCertificateId || null;
      hasTemplate = !!template;

      for (const skill of path.skills) {
        const stepIds = skill.modules.flatMap((m: any) => m.steps.map((s: any) => s.id));
        const doneCount = stepIds.filter((id: any) => completedStepSet.has(id)).length;
        const totalSteps = stepIds.length;
        const comp = completionMap.get(skill.id);
        const quizPassed = comp?.quizPassed || false;
        const isComplete = comp?.quizPassed && comp?.stepsCompleted;

        let status: SkillStatus = "not_started";
        if (isComplete) {
          status = "complete";
          completedSkills++;
        } else if (doneCount > 0 || quizPassed) {
          status = "in_progress";
        }

        skillProgress.set(skill.id, {
          skillId: skill.id,
          status,
          stepsCompleted: doneCount,
          stepsTotal: totalSteps,
          quizPassed,
        });
      }

      allComplete = completedSkills === totalSkills && totalSkills > 0;
    } catch (e) {
      console.error("Progress tracking calculation error:", e);
    }
  }

  const progressPercent =
    totalSkills > 0 ? Math.round((completedSkills / totalSkills) * 100) : 0;

  // Find next incomplete skill for "Resume" link
  const nextSkill = user
    ? path.skills.find((sk) => {
        const p = skillProgress.get(sk.id);
        return p?.status !== "complete";
      })
    : path.skills[0];

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-green-50 dark:bg-[#1a1a2e] py-12 md:py-20">
        <div className="container-page">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 mb-6 flex-wrap">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/careers/${careerSlug}`} className="hover:text-accent transition-colors">
              {path.career?.name}
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-white/80">{path.name}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {path.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-white/75 max-w-2xl leading-relaxed mb-6">
            {path.description}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="bg-white/80 dark:bg-white/10 rounded-full px-5 py-2 text-sm text-gray-800 dark:text-white/90 font-medium">
              ⚡ {totalSkills} Skills
            </div>
            <div className="bg-white/80 dark:bg-white/10 rounded-full px-5 py-2 text-sm text-gray-800 dark:text-white/90 font-medium">
              ⏱️ ~{totalHours} hours
            </div>
            {user && (
              <div className="bg-accent/20 rounded-full px-5 py-2 text-sm text-accent font-medium">
                ✅ {completedSkills}/{totalSkills} completed
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="max-w-md">
            <div className="flex items-center justify-between text-sm text-gray-700 dark:text-white/60 mb-2 font-medium">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/80 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── My Progress Strip (logged in only) ──────────────── */}
      {user && totalSkills > 0 && (
        <section className="bg-surface-raised border-b border-[var(--border-color)]">
          <div className="container-page py-5">
            <h2 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">
              My Progress
            </h2>
            <div className="flex gap-1 items-center flex-wrap">
              {path.skills.map((skill) => {
                const p = skillProgress.get(skill.id);
                const status = p?.status || "not_started";
                return (
                  <Link
                    key={skill.id}
                    href={`/careers/${careerSlug}/${pathSlug}/${skill.slug}`}
                    title={`${skill.name} - ${
                      status === "complete" ? "Complete" : status === "in_progress" ? "In progress" : "Not started"
                    }`}
                    className={`group relative flex-shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center
                               text-xs font-bold transition-all hover:scale-110
                               ${
                                 status === "complete"
                                   ? "bg-green-500 dark:bg-green-600 text-white"
                                   : status === "in_progress"
                                   ? "bg-accent/20 text-accent border-2 border-accent/40"
                                   : "bg-surface border-2 border-[var(--border-color)] text-text-muted"
                               }`}
                  >
                    {status === "complete" ? "✓" : skill.orderIndex + 1}
                    {/* Tooltip */}
                    <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100
                                     text-[10px] bg-gray-900 dark:bg-[#1a1a2e] text-white rounded px-2 py-1 whitespace-nowrap pointer-events-none
                                     transition-opacity z-10">
                      {skill.name}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-[10px] text-text-muted">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-500 dark:bg-green-600" /> Complete
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-accent/20 border border-accent/40" /> In progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-surface border border-[var(--border-color)]" /> Not started
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Skills list */}
      <section className="py-12 md:py-20">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8">
            Skills in this Path
          </h2>

          {/* Auth prompt for anonymous users */}
          {!user && (
            <div className="mb-8">
              <AuthPrompt
                action="track progress"
                redirectTo={`/careers/${careerSlug}/${pathSlug}`}
              />
            </div>
          )}

          <div className="space-y-4">
            {path.skills.map((skill, i) => {
              const prog = skillProgress.get(skill.id);
              const status = prog?.status || "not_started";
              const stepsText = prog
                ? `${prog.stepsCompleted}/${prog.stepsTotal} steps`
                : "";

              return (
                <Link
                  key={skill.id}
                  href={`/careers/${careerSlug}/${pathSlug}/${skill.slug}`}
                  className={`group flex items-center gap-4 md:gap-6 bg-surface-raised rounded-2xl p-5 md:p-6
                             border shadow-sm hover:shadow-card
                             transition-all duration-300 hover:-translate-y-0.5
                             ${
                               status === "complete"
                                 ? "border-green-200 dark:border-green-800"
                                 : "border-[var(--border-color)]"
                             }`}
                >
                  {/* Order number / check */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full
                               flex items-center justify-center text-sm md:text-base font-bold
                               ${
                                 status === "complete"
                                   ? "bg-green-500 dark:bg-green-600 text-white"
                                   : status === "in_progress"
                                   ? "bg-accent/20 text-accent"
                                   : "bg-accent/10 text-accent"
                               }`}
                  >
                    {status === "complete" ? "✓" : i + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-primary group-hover:text-accent transition-colors text-base md:text-lg">
                      {skill.name}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-1 mt-0.5">
                      {skill.description}
                    </p>

                    {/* Status strip */}
                    {user && prog && (
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            status === "complete"
                              ? "bg-green-100 dark:bg-[#1a1a2e] text-green-700 dark:text-green-400"
                              : status === "in_progress"
                              ? "bg-accent/10 text-accent"
                              : "bg-gray-100 dark:bg-gray-800 text-text-muted"
                          }`}
                        >
                          {status === "complete"
                            ? "Complete"
                            : status === "in_progress"
                            ? "In Progress"
                            : "Not Started"}
                        </span>
                        {status !== "not_started" && (
                          <span className="text-xs text-text-muted">
                            {stepsText} · Quiz: {prog.quizPassed ? "✓" : "-"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hours */}
                  <div className="hidden sm:flex flex-shrink-0 items-center gap-1 text-sm text-text-muted">
                    <span>~{skill.estimatedHours}h</span>
                  </div>

                  {/* Arrow / Resume */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/0 group-hover:bg-accent/10 flex items-center justify-center transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted group-hover:text-accent transition-colors">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── Bottom CTA ─────────────────────────────────── */}
          <div className="mt-10 text-center">
            {user ? (
              allComplete ? (
                /* All skills complete - show Certificate CTA */
                hasCertificate ? (
                  <Link
                    href={`/certificates/${certId}`}
                    className="inline-flex items-center gap-2 bg-green-50 dark:bg-[#1a1a2e]0 hover:bg-green-600 text-white
                               font-semibold rounded-full px-8 py-3.5
                               transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30"
                  >
                    🎓 View Your Certificate
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <CertificateButton
                    pathId={path.id}
                    hasTemplate={hasTemplate}
                  />
                )
              ) : nextSkill ? (
                /* In progress - Resume or Start */
                <Link
                  href={`/careers/${careerSlug}/${pathSlug}/${nextSkill.slug}`}
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                             font-semibold rounded-full px-8 py-3.5
                             transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
                >
                  {completedSkills > 0 ? "Resume Learning" : "Start this Path"}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              ) : null
            ) : (
              <AuthPrompt action="start learning" redirectTo={`/careers/${careerSlug}/${pathSlug}`} />
            )}
          </div>
        </div>
      </section>

      {/* 2 ahead, 2 back prefetch strategy */}
      <Prefetcher 
        urls={(() => {
          const currentIndex = nextSkill ? path.skills.findIndex(s => s.id === nextSkill.id) : 0;
          const start = Math.max(0, currentIndex - 2);
          const end = Math.min(path.skills.length, currentIndex + 3); // current + 2 ahead
          return path.skills.slice(start, end).map((s) => `/careers/${careerSlug}/${pathSlug}/${s.slug}`);
        })()} 
      />
    </main>
  );
}

import { prisma } from "@/lib/prisma";
import { getSkillBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/app/auth/actions";
import { AuthPrompt } from "@/components/auth-prompt";
import { SkillBookletContent } from "./booklet-content";
import type { Metadata } from "next";
import { Prefetcher } from "@/components/prefetcher";

interface Props {
  params: Promise<{ slug: string; pathSlug: string; skillSlug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { skillSlug } = await params;
    const skill = await getSkillBySlug(skillSlug);
    if (!skill) return { title: "Skill Not Found - SkillItLearn" };
    return {
      title: `${skill.name} - SkillItLearn`,
      description: skill.description || "Learn skills step-by-step with guided learning tracks.",
    };
  } catch {
    return { title: "SkillItLearn" };
  }
}

export default async function SkillBookletPage({ params }: Props) {
  const { slug: careerSlug, pathSlug, skillSlug } = await params;

  const skill = await getSkillBySlug(skillSlug);

  if (!skill) notFound();

  const user = await getCurrentUser().catch(() => null);
  const modulesList = skill.modules || [];
  const allStepIds = modulesList.flatMap((m: any) =>
    (m.steps || []).map((s: any) => s.id)
  );
  const totalSteps = allStepIds.length;

  // Fetch user's progress for this skill
  let completedStepIds: Set<string> = new Set();
  let hasPassedQuiz = false;
  let skillComplete = false;

  if (user) {
    try {
      const [completedSteps, quizAttempt, completion] = await Promise.all([
        prisma.learnerProgress.findMany({
          where: { userId: user.id, stepId: { in: allStepIds } },
          select: { stepId: true },
        }).catch(() => []),
        prisma.quizAttempt.findFirst({
          where: { userId: user.id, skillId: skill.id, passed: true },
          select: { id: true },
        }).catch(() => null),
        prisma.skillCompletion.findFirst({
          where: { userId: user.id, skillId: skill.id, quizPassed: true, stepsCompleted: true },
          select: { id: true },
        }).catch(() => null),
      ]);

      completedStepIds = new Set(completedSteps.map((s) => s.stepId));
      hasPassedQuiz = !!quizAttempt;
      skillComplete = !!completion;
    } catch (e) {
      console.error("Skill progress query error:", e);
    }
  }

  const completedStepCount = completedStepIds.size;
  // Progress: steps count for 70%, quiz for 30%
  const stepsPercent = totalSteps > 0 ? (completedStepCount / totalSteps) * 70 : 70;
  const quizPercent = hasPassedQuiz ? 30 : 0;
  const overallPercent = Math.round(stepsPercent + quizPercent);
  const allStepsComplete = totalSteps > 0 ? completedStepCount >= totalSteps : true;

  return (
    <main className="min-h-screen bg-surface">
      {/* Compact header */}
      <section className="bg-green-50 dark:bg-[#1a1a2e] py-8 md:py-12">
        <div className="container-page max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/60 mb-4 flex-wrap">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/careers/${careerSlug}`} className="hover:text-accent transition-colors">
              {skill.path?.career?.name || "Career"}
            </Link>
            <span>/</span>
            <Link href={`/careers/${careerSlug}/${pathSlug}`} className="hover:text-accent transition-colors">
              {skill.path?.name || "Path"}
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-white/80">{skill.name}</span>
          </nav>

          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {skill.name}
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-white/60 leading-relaxed mb-4 max-w-2xl">
            {skill.description}
          </p>

          <div className="flex flex-wrap gap-3 text-xs mb-5">
            <span className="bg-white/80 dark:bg-white/10 rounded-full px-4 py-1.5 text-gray-700 dark:text-white/80 font-medium">
              📖 {modulesList.length} track{modulesList.length !== 1 ? "s" : ""}
            </span>
            <span className="bg-white/80 dark:bg-white/10 rounded-full px-4 py-1.5 text-gray-700 dark:text-white/80 font-medium">
              📄 {totalSteps} step{totalSteps !== 1 ? "s" : ""}
            </span>
            {skillComplete && (
              <span className="bg-accent/20 rounded-full px-4 py-1.5 text-accent font-medium">
                ✅ Complete
              </span>
            )}
          </div>

          {/* Progress bar (logged in only) */}
          {user && (
            <div className="max-w-md">
              <div className="flex items-center justify-between text-xs text-gray-700 dark:text-white/60 mb-1.5 font-medium">
                <span>Progress</span>
                <span>{overallPercent}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/80 dark:bg-white/10 overflow-hidden flex">
                {/* Steps portion (green) */}
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${stepsPercent}%` }}
                />
                {/* Quiz portion (brighter green) */}
                <div
                  className="h-full bg-green-400 transition-all duration-500"
                  style={{ width: `${quizPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-500 dark:text-white/40">
                  Steps: {completedStepCount}/{totalSteps}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-white/40">
                  Quiz: {hasPassedQuiz ? "Passed ✓" : "Not taken"}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Booklet content */}
      <section className="py-8 md:py-14">
        <div className="container-page max-w-4xl">
          <SkillBookletContent
            tracks={modulesList.map((m: any) => ({
              ...m,
              orderIndex: m.order_index ?? 0,
              steps: (m.steps || []).map((s: any) => ({ ...s, orderIndex: s.order_index ?? 0 })),
            }))}
            completedStepIds={Array.from(completedStepIds)}
            isLoggedIn={!!user}
            skillId={skill.id}
          />

          {/* End CTA: Take the Quiz */}
          <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
            <div className="text-center">
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Ready to prove your knowledge?
              </h3>

              {!allStepsComplete && user && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
                  ⚠️ Complete all {totalSteps} steps first to unlock the quiz.
                  ({completedStepCount}/{totalSteps} done)
                </p>
              )}

              <p className="text-text-secondary text-sm mb-6">
                Take a 15-question quiz to complete this skill and earn progress
                toward your certificate.
              </p>

              {user ? (
                hasPassedQuiz ? (
                  <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-[#1a1a2e] text-green-700 dark:text-green-400 font-semibold rounded-full px-8 py-3.5">
                    ✅ Quiz Already Passed
                  </div>
                ) : (
                  <Link
                    href={`/careers/${careerSlug}/${pathSlug}/${skillSlug}/quiz`}
                    className={`inline-flex items-center gap-2 font-semibold rounded-full px-8 py-3.5
                               transition-all duration-300 ${
                                 allStepsComplete
                                   ? "bg-accent hover:bg-accent-hover text-white hover:shadow-lg hover:shadow-accent/30"
                                   : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-white/60 dark:text-gray-400 cursor-not-allowed pointer-events-none"
                               }`}
                  >
                    Take the Quiz
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                )
              ) : (
                <AuthPrompt
                  action="take this quiz"
                  redirectTo={`/careers/${careerSlug}/${pathSlug}/${skillSlug}`}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Prefetch the quiz page */}
      <Prefetcher urls={[`/careers/${careerSlug}/${pathSlug}/${skillSlug}/quiz`]} />
    </main>
  );
}

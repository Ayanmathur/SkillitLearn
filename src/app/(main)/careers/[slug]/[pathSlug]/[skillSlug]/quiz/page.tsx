import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import { QuizClient } from "./quiz-client";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; pathSlug: string; skillSlug: string }>;
}

export const metadata: Metadata = {
  title: "Quiz - SkillItLearn",
};

export default async function QuizPage({ params }: Props) {
  const { slug, pathSlug, skillSlug } = await params;

  // Require login
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=/careers/${slug}/${pathSlug}/${skillSlug}/quiz`);
  }

  // Fetch skill info
  const skill = await prisma.skill.findUnique({
    where: { slug: skillSlug },
    select: {
      id: true,
      name: true,
      slug: true,
      path: {
        select: {
          name: true,
          slug: true,
          career: { select: { name: true, slug: true } },
        },
      },
    },
  });

  if (!skill) redirect(`/careers/${slug}/${pathSlug}`);

  // Check if already passed
  const existingPass = await prisma.quizAttempt.findFirst({
    where: { userId: user.id, skillId: skill.id, passed: true },
    select: { score: true },
  });

  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <section className="bg-[#1a1a2e] py-8">
        <div className="container-page max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-3 flex-wrap">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <a href={`/careers/${slug}`} className="hover:text-white transition-colors">
              {skill.path.career.name}
            </a>
            <span>/</span>
            <a href={`/careers/${slug}/${pathSlug}`} className="hover:text-white transition-colors">
              {skill.path.name}
            </a>
            <span>/</span>
            <a href={`/careers/${slug}/${pathSlug}/${skillSlug}`} className="hover:text-white transition-colors">
              {skill.name}
            </a>
            <span>/</span>
            <span className="text-white/80">Quiz</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {skill.name} - Quiz
          </h1>
          <p className="text-sm text-white/60">
            Answer 5 questions. You need 4/5 (80%) to pass. Take your time.
          </p>
        </div>
      </section>

      {/* Quiz body */}
      <section className="py-8 md:py-12">
        <div className="container-page max-w-3xl">
          {existingPass ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                You&apos;ve already passed!
              </h2>
              <p className="text-text-secondary mb-6">
                You scored {existingPass.score}/5 on this quiz.
              </p>
              <a
                href={`/careers/${slug}/${pathSlug}`}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                           font-semibold rounded-full px-8 py-3
                           transition-all duration-300"
              >
                Back to Path
              </a>
            </div>
          ) : (
            <QuizClient
              skillId={skill.id}
              skillName={skill.name}
              backUrl={`/careers/${slug}/${pathSlug}/${skillSlug}`}
              pathUrl={`/careers/${slug}/${pathSlug}`}
            />
          )}
        </div>
      </section>
    </main>
  );
}

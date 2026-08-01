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
  const {  slug, pathSlug, skillSlug  } = await Promise.resolve(params);

  // Require authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=/careers/${slug}/${pathSlug}/${skillSlug}/quiz`);
  }

  const { getSkillBySlug } = await import("@/lib/data");
  const skill = await getSkillBySlug(skillSlug).catch(() => null);

  // Format readable skill name from skill object or fallback to slug
  const skillName = skill?.name || skillSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <section className="bg-green-50/80 dark:bg-[#1a1a2e] py-8 border-b border-border-color">
        <div className="container-page max-w-3xl">
          <nav className="flex items-center gap-2 text-xs text-text-secondary mb-3 flex-wrap">
            <a href="/" className="hover:text-accent transition-colors">Home</a>
            <span>/</span>
            <a href={`/careers/${slug}`} className="hover:text-accent transition-colors">
              Career
            </a>
            <span>/</span>
            <a href={`/careers/${slug}/${pathSlug}`} className="hover:text-accent transition-colors">
              Learning Path
            </a>
            <span>/</span>
            <a href={`/careers/${slug}/${pathSlug}/${skillSlug}`} className="hover:text-accent transition-colors">
              {skillName}
            </a>
            <span>/</span>
            <span className="text-text-primary font-medium">Quiz</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            {skillName} - Quiz Evaluation
          </h1>
          <p className="text-sm text-text-secondary">
            15 Randomized Questions (5 Easy, 5 Moderate, 5 Difficult). Answer 10 out of 15 correctly (66%) to pass and unlock your certificate.
          </p>
        </div>
      </section>

      {/* Quiz body */}
      <section className="py-8 md:py-12">
        <div className="container-page max-w-3xl">
          <QuizClient
            skillSlug={skillSlug}
            skillName={skillName}
            backUrl={`/careers/${slug}/${pathSlug}/${skillSlug}`}
            pathUrl={`/careers/${slug}/${pathSlug}`}
          />
        </div>
      </section>
    </main>
  );
}

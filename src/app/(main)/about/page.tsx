import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - SkillItLearn",
  description: "Learn how SkillItLearn organizes career development into structured paths with verifiable certificates.",
};

export default async function AboutPage() {
  const [careerCount, pathCount, skillCount, certCount] = await Promise.all([
    prisma.career.count(),
    prisma.path.count(),
    prisma.skill.count(),
    prisma.certificate.count(),
  ]);

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-green-50 py-16 md:py-24">
        <div className="container-page max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Skill<span className="text-accent">It</span>Learn
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We organize professional knowledge into clear career paths so
            you can build real skills, prove your competency, and earn
            verifiable certificates - all at your own pace.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 md:py-20">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Our Mission
          </h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            The modern job market demands specific, demonstrable skills - not just
            degrees. SkillItLearn bridges the gap between &ldquo;I want to learn&rdquo; and
            &ldquo;I can prove I know it&rdquo; by providing structured, step-by-step learning
            paths with built-in assessment and certification.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Whether you&apos;re a fresh graduate exploring careers, a professional
            looking to upskill, or someone switching fields entirely - we provide
            the roadmap, the curriculum, and the credentials you need.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 md:py-20 bg-surface-raised">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8">
            How It Works
          </h2>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Choose a Career Path",
                desc: "Browse 50+ career categories spanning technology, business, healthcare, creative arts, and more. Each career contains multiple learning paths.",
                icon: "🎯",
              },
              {
                step: "2",
                title: "Learn Through Structured Modules",
                desc: "Each skill is taught through step-by-step booklets organized into modules. Content covers theory, practice exercises, tools, common mistakes, and self-assessment.",
                icon: "📖",
              },
              {
                step: "3",
                title: "Pass the Quiz",
                desc: "After studying a skill, take a 5-question quiz (randomly selected from a pool of 20). You need 80% to pass. Questions test genuine understanding, not memorization.",
                icon: "✅",
              },
              {
                step: "4",
                title: "Earn Your Certificate",
                desc: "Complete all skills in a path and receive a verifiable certificate with a unique ID. Employers can verify your certificate on our platform.",
                icon: "🎓",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 md:gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">
                    Step {item.step}: {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 md:py-20 bg-green-50">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Platform at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: careerCount, label: "Career Paths" },
              { n: pathCount, label: "Learning Paths" },
              { n: skillCount, label: "Skills" },
              { n: certCount, label: "Certificates Issued" },
            ].map((s) => (
              <div key={s.label} className="bg-white/60 rounded-2xl p-5 text-center border border-gray-200">
                <div className="text-3xl font-bold text-accent">{s.n}</div>
                <div className="text-sm text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="container-page max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-text-secondary mb-6">
            Explore our career paths and begin building skills today.
          </p>
          <Link
            href="/#careers"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                       font-semibold rounded-full px-8 py-3.5
                       transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
          >
            Explore Careers
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { CareerExplorer } from "@/components/career-explorer";

// ── Testimonial data ─────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Jayant Kumar",
    path: "Frontend Development",
    quote:
      "SkillItLearn helped me discover the exact skills I needed to become job-ready. The structured paths made learning feel focused and achievable, not overwhelming.",
    image: "/testimonials/jayant-kumar.png",
  },
  {
    name: "Avni Singh",
    path: "Data Analytics",
    quote:
      "I was switching careers and had no idea where to start. The career exploration on this platform gave me clarity - I found my path in data analytics and completed it in weeks.",
    image: "/testimonials/avni-singh.png",
  },
  {
    name: "Arnav Sable",
    path: "Cloud Architecture",
    quote:
      "The quiz system genuinely tested my understanding, not just memorization. Getting my certificate felt earned, and it gave me confidence during interviews.",
    image: "/testimonials/arnav-sable.png",
  },
  {
    name: "Geet Katore",
    path: "UX Research & Strategy",
    quote:
      "What I love is how each skill builds on the previous one. By the time I finished the UX path, I had a complete mental model of the entire field. It made me truly job-ready.",
    image: "/testimonials/geet-katore.png",
  },
  {
    name: "Yashpal Rahane",
    path: "Machine Learning Engineering",
    quote:
      "The step-by-step booklet format is brilliant. It's like having a mentor walk you through each concept. I went from zero to competent in ML fundamentals in just a few weeks.",
    image: "/testimonials/yashpal-rahane.png",
  },
];

// ============================================================
// HOME PAGE - Server Component
// ============================================================
export default async function HomePage() {
  const [careers, stats] = await Promise.all([
    prisma.career.findMany({
      include: {
        paths: {
          include: {
            skills: { select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    Promise.all([
      prisma.career.count(),
      prisma.path.count(),
      prisma.skill.count(),
      prisma.certificate.count(),
    ]),
  ]);

  const [careerCount, pathCount, skillCount, certCount] = stats;

  // Prepare career data for client component
  const careerData = careers.map((career) => ({
    id: career.id,
    name: career.name,
    slug: career.slug,
    description: career.description,
    pathCount: career.paths.length,
    skillCount: career.paths.reduce((sum, p) => sum + p.skills.length, 0),
  }));

  return (
    <main>
      {/* ── 1. Hero Banner ───────────────────────────────── */}
      <section className="relative bg-green-50 dark:bg-[#1a1a2e] overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="container-page relative z-10 py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Build Real Skills.{" "}
              <span className="text-accent">Earn Certificates.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-white/80 mb-8 leading-relaxed max-w-xl">
              Explore 50+ career paths with structured, step-by-step learning.
              Master skills at your own pace, prove your competency with quizzes,
              and earn verifiable certificates.
            </p>
            <Link
              href="#careers"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                         font-semibold rounded-full px-8 py-3.5 text-base
                         transition-all duration-300 hover:shadow-lg hover:shadow-accent/30
                         hover:-translate-y-0.5"
            >
              Explore Careers
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Intro / About Band ────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: visual */}
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-accent/20 to-[#1a1a2e]/20 flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <img src="/logo.jpg" alt="SkillItLearn" className="w-32 h-32 mx-auto rounded-2xl mb-4 object-cover" />
                  <div className="text-5xl font-bold text-accent">{careerCount}+</div>
                  <div className="text-lg text-text-secondary font-medium mt-1">Career Paths</div>
                </div>
              </div>
            </div>

            {/* Right: text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
                Your career journey,{" "}
                <span className="text-accent">structured and clear.</span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-4">
                SkillItLearn organizes professional knowledge into clear career
                paths. Each path breaks down into skills, and each skill is taught
                through structured modules with step-by-step booklets - no
                guesswork, no jumping around.
              </p>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Complete the steps, pass the quiz, and earn a verifiable
                certificate that proves your competency to employers.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-accent font-semibold hover:text-accent-hover transition-colors"
              >
                Learn more about our approach
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Career Explorer (Search + Topics + Grid) ─── */}
      <section id="careers" className="py-16 md:py-24 bg-surface-raised">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Explore Courses
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Browse {careerCount} career paths across technology, business,
              creative arts, healthcare, and more.
            </p>
          </div>

          <CareerExplorer careers={careerData} />
        </div>
      </section>

      {/* ── 4. Stats Band ─────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-green-50 dark:bg-[#1a1a2e]">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Our Impact
            </h2>
            <p className="text-gray-600 dark:text-white/75 text-lg">
              Real numbers from the SkillItLearn platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { value: careerCount, label: "Careers Available", icon: "🎯" },
              { value: pathCount, label: "Learning Paths", icon: "🛤️" },
              { value: skillCount, label: "Skills to Master", icon: "⚡" },
              { value: certCount, label: "Certificates Issued", icon: "🏆" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center
                           border border-gray-200 dark:border-white/10 hover:border-accent/30
                           transition-all duration-300"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-1">
                  {stat.value.toLocaleString()}
                  {stat.label === "Skills to Master" ? "+" : ""}
                </div>
                <div className="text-sm text-gray-600 dark:text-white/75 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Testimonials ─────────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
              What Our Learners Say
            </h2>
            <p className="text-text-secondary text-lg">
              Real feedback from people who built skills on our platform
            </p>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory
                          md:grid md:grid-cols-3 md:overflow-visible md:pb-0
                          scrollbar-thin">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex-shrink-0 w-80 md:w-auto snap-center
                           bg-surface-raised rounded-2xl p-6
                           border border-[var(--border-color)]
                           shadow-sm hover:shadow-card
                           transition-all duration-300"
              >
                <div className="mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-accent/30 mb-2">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                  </svg>
                  <p className="text-text-secondary text-sm leading-relaxed italic">
                    &quot;{t.quote}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-accent/10 flex-shrink-0">
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-text-primary">{t.name}</div>
                    <div className="text-xs text-accent font-medium">{t.path}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

import { getAllCareers, getStats } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { CareerExplorer } from "@/components/career-explorer";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { Prefetcher } from "@/components/prefetcher";

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
export const revalidate = 3600;

export default async function HomePage() {
  const [careers, stats] = await Promise.all([
    getAllCareers(),
    getStats(),
  ]);

  const { careerCount, pathCount, skillCount, certCount } = stats;

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
      {/* ── 1. Hero Banner (Be10X-inspired high-impact layout) ─── */}
      <section className="relative bg-gradient-to-b from-[#1a1a2e] via-[#1a1a2e] to-[#141627] text-white overflow-hidden py-20 md:py-28 lg:py-32">
        {/* Glowing background circles */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="container-page relative z-10">
          <div className="max-w-3xl">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-semibold text-xs tracking-wider uppercase mb-6">
              <span>🚀</span> Become a 10X Version of Yourself
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Build Real Skills. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5bbd72] via-[#92fde7] to-[#45bdff]">
                Become 10X More Productive.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-2xl">
              Explore 50+ structured career paths with step-by-step booklets, hands-on module steps,
              competency quizzes, and verifiable industry certificates.
            </p>

            {/* Be10X Bullet Feature List */}
            <ul className="grid sm:grid-cols-2 gap-3 mb-10 text-sm font-medium text-white/90">
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                10X your productivity with structured booklets
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                Instant self-paced step progress tracking
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                Competency quizzes & verifiable certificates
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold">✓</span>
                Zero cold-start instant edge performance
              </li>
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#careers"
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                           font-semibold rounded-full px-8 py-4 text-base shadow-lg shadow-accent/25
                           transition-all duration-300 hover:scale-105"
              >
                Explore Courses & Careers
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20
                           font-semibold rounded-full px-8 py-4 text-base transition-all duration-300"
              >
                Verify Certificate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Intro / About Band ────────────────────────── */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: visual */}
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                <Image 
                  src="/images/hero-learning.jpg" 
                  alt="Students learning" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/90 via-[#1a1a2e]/40 to-transparent flex items-center justify-center">
                  <div className="text-center p-8 w-full mt-auto mb-10">
                    <div className="text-7xl font-extrabold text-white drop-shadow-md">{careerCount}+</div>
                    <div className="text-xl text-accent font-semibold mt-2 tracking-wide uppercase drop-shadow-md">Career Paths</div>
                  </div>
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
              { value: careerCount, label: "Careers Available", bgImage: "/images/careers/project.jpg" },
              { value: pathCount, label: "Learning Paths", bgImage: "/images/careers/teaching.jpg" },
              { value: `${skillCount}+`, label: "Skills to Master", bgImage: "/images/careers/it-and.jpg" },
              { value: "1200+", label: "Certificates Issued", bgImage: "/images/careers/digital-marketing.jpg" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative aspect-square overflow-hidden rounded-3xl shadow-xl border border-white/10 group hover:-translate-y-1 transition-all duration-300"
              >
                <Image
                  src={stat.bgImage}
                  alt={stat.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/90 via-[#1a1a2e]/40 to-transparent flex items-center justify-center">
                  <div className="text-center p-4 w-full mt-auto mb-6">
                    <div className="text-4xl lg:text-5xl font-extrabold text-white drop-shadow-md">
                      {stat.value}
                    </div>
                    <div className="text-xs lg:text-sm text-accent font-semibold mt-2 tracking-wide uppercase drop-shadow-md">
                      {stat.label}
                    </div>
                  </div>
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

          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      {/* Prefetch all career detail pages in the background */}
      <Prefetcher urls={careers.map((c) => `/careers/${c.slug}`)} />
    </main>
  );
}

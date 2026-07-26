import { getCareerBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Prefetcher } from "@/components/prefetcher";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareerBySlug(slug);

  if (!career) return { title: "Career Not Found" };

  return {
    title: `${career.name} - SkillItLearn`,
    description: career.description,
  };
}

export default async function CareerDetailPage({ params }: Props) {
  const { slug } = await params;
  const career = await getCareerBySlug(slug);

  if (!career) notFound();

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-green-50 dark:bg-[#1a1a2e] py-12 md:py-20">
        <div className="container-page">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 mb-6">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/#careers" className="hover:text-accent transition-colors">
              Careers
            </Link>
            <span>/</span>
            <span className="text-gray-700 dark:text-white/80">{career.name}</span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {career.name}
          </h1>
          <p className="text-lg text-gray-600 dark:text-white/75 max-w-2xl leading-relaxed mb-6">
            {career.description}
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 text-sm text-gray-800 dark:text-white/90 font-medium">
              🛤️ {career.paths.length} Learning Path{career.paths.length !== 1 ? "s" : ""}
            </div>
            <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 text-sm text-gray-800 dark:text-white/90 font-medium">
              ⚡{" "}
              {career.paths.reduce((s, p) => s + p.skills.length, 0)} Skills
            </div>
            <div className="bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 text-sm text-gray-800 dark:text-white/90 font-medium">
              ⏱️{" "}
              {career.paths.reduce(
                (s: number, p: any) =>
                  s + p.skills.reduce((ss: number, sk: any) => ss + sk.estimatedHours, 0),
                0
              )}{" "}
              hours total
            </div>
          </div>
        </div>
      </section>

      {/* Paths Grid */}
      <section className="py-12 md:py-20">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-8">
            Learning Paths
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {career.paths.map((path, i) => {
              const totalHours = path.skills.reduce(
                (s: number, sk: any) => s + sk.estimatedHours,
                0
              );
              return (
                <Link
                  key={path.id}
                  href={`/careers/${career.slug}/${path.slug}`}
                  className={`group relative bg-surface-raised rounded-2xl p-6
                             border border-[var(--border-color)]
                             shadow-sm hover:shadow-card
                             transition-all duration-300 hover:-translate-y-1`}
                >
                  {/* Order badge */}
                  <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>

                  <div className="pt-6">
                    <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                      {path.name}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                      {path.description}
                    </p>

                    {/* Stats strip */}
                    <div className="flex items-center gap-3 text-xs text-text-muted font-medium">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {path.skills.length} skill{path.skills.length !== 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-50 dark:bg-[#1a1a2e]" />
                        ~{totalHours}h
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent/0 group-hover:bg-accent/10 flex items-center justify-center transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted group-hover:text-accent transition-colors">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Predict next click: Prefetch only the paths (avoid DDOSing serverless functions) */}
      <Prefetcher
        urls={career.paths.map((p) => `/careers/${slug}/${p.slug}`)}
        maxPrefetch={5}
      />
    </main>
  );
}

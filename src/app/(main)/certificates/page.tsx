import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/auth/actions";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Certificates - SkillItLearn",
  description: "View and download your earned SkillItLearn certificates.",
};

export default async function CertificatesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-surface">
        <section className="bg-green-50 py-16">
          <div className="container-page text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Certificates</h1>
            <p className="text-white/60 mb-6">Log in to view your earned certificates.</p>
            <Link href="/login?redirect=/certificates" className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-8 py-3 transition-all">
              Log in
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const certificates = await prisma.certificate.findMany({
    where: { userId: user.id, revoked: false },
    include: {
      path: {
        select: { name: true, career: { select: { name: true } } },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  // Also get paths where user has made progress but no certificate yet
  const completedPaths = await prisma.path.findMany({
    where: {
      skills: {
        some: {
          skillCompletions: {
            some: { userId: user.id, quizPassed: true },
          },
        },
      },
    },
    include: {
      career: { select: { name: true, slug: true } },
      skills: {
        select: {
          id: true,
          skillCompletions: {
            where: { userId: user.id, quizPassed: true },
            select: { id: true },
          },
        },
      },
      certificates: {
        where: { userId: user.id, revoked: false },
        select: { id: true },
      },
    },
  });

  const inProgressPaths = completedPaths.filter(
    (p) => p.certificates.length === 0 && p.skills.some((s) => s.skillCompletions.length > 0)
  );

  return (
    <main className="min-h-screen bg-surface">
      <section className="bg-green-50 py-12 md:py-16">
        <div className="container-page">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Certificates</h1>
          <p className="text-white/60">Your earned credentials and path progress.</p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-page">
          {/* Issued certificates */}
          {certificates.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                🏆 Earned Certificates ({certificates.length})
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-surface-raised rounded-2xl p-5 border border-[var(--border-color)] shadow-sm
                               hover:shadow-card transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-2xl">
                        🎓
                      </div>
                      <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded-lg">
                        {cert.uniqueCertificateId}
                      </span>
                    </div>
                    <h3 className="font-bold text-text-primary mb-1">{cert.path.name}</h3>
                    <p className="text-xs text-text-muted mb-3">{cert.path.career.name}</p>
                    <p className="text-xs text-text-muted">
                      Issued: {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                    <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                      <Link
                        href={`/verify?id=${cert.uniqueCertificateId}`}
                        className="text-xs text-accent hover:text-accent-hover font-semibold transition-colors"
                      >
                        Verify →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* In-progress paths */}
          {inProgressPaths.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-text-primary mb-4">
                📈 Paths in Progress
              </h2>
              <div className="space-y-3">
                {inProgressPaths.map((p) => {
                  const done = p.skills.filter((s) => s.skillCompletions.length > 0).length;
                  const total = p.skills.length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <Link
                      key={p.id}
                      href={`/careers/${p.career.slug}/${p.slug}`}
                      className="flex items-center gap-4 bg-surface-raised rounded-2xl p-4 border border-[var(--border-color)]
                                 shadow-sm hover:shadow-card transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-text-primary text-sm">{p.name}</div>
                        <div className="text-xs text-text-muted">{p.career.name} · {done}/{total} skills</div>
                      </div>
                      <div className="w-24">
                        <div className="h-2 rounded-full bg-accent/10 overflow-hidden">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="text-[10px] text-text-muted text-right mt-0.5">{pct}%</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {certificates.length === 0 && inProgressPaths.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📚</div>
              <h2 className="text-xl font-bold text-text-primary mb-2">No certificates yet</h2>
              <p className="text-text-secondary mb-6">
                Start a learning path and complete all skill quizzes to earn your first certificate.
              </p>
              <Link href="/#careers" className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-8 py-3 transition-all">
                Explore Careers
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

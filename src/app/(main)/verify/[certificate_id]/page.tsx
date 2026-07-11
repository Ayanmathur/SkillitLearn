import type { Metadata } from "next";
import { verifyCertificate } from "../../certificates/actions";

interface Props {
  params: Promise<{ certificate_id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certificate_id } = await params;
  return {
    title: `Verify ${certificate_id} - SkillItLearn`,
    description: "Verify the authenticity of a SkillItLearn certificate.",
    robots: { index: false, follow: false }, // Don't index verify pages
  };
}

export default async function VerifyCertificatePage({ params }: Props) {
  const { certificate_id } = await params;
  const result = await verifyCertificate(certificate_id);

  const hasError = "error" in result && result.error;
  const isValid = !hasError && result.valid && result.certificate;

  return (
    <main className="min-h-screen bg-surface">
      {/* Header band */}
      <section className="bg-green-50 dark:bg-[#1a1a2e] py-10 md:py-14">
        <div className="container-page text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Certificate Verification
          </h1>
          <p className="text-gray-500 dark:text-white/60 text-sm">
            ID: <span className="font-mono text-gray-600 dark:text-white/75">{certificate_id.toUpperCase()}</span>
          </p>
        </div>
      </section>

      <section className="py-8 md:py-14">
        <div className="container-page max-w-lg">
          {/* Error state */}
          {hasError && (
            <div className={`rounded-2xl border-2 p-8 text-center
              ${"revoked" in result && result.revoked
                ? "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
                : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                  <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Verification Failed
              </h2>
              <p className="text-text-secondary text-sm">
                {result.error}
              </p>
            </div>
          )}

          {/* Valid certificate */}
          {isValid && result.certificate && (
            <div className="rounded-2xl border-2 border-green-300 dark:border-green-700 overflow-hidden shadow-card">
              {/* Verified badge header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-white backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Verified</h2>
                <p className="text-gray-700 dark:text-white/80 text-sm mt-0.5">This certificate is authentic and valid.</p>
              </div>

              {/* Certificate details - ONLY name, path, date */}
              <div className="p-6 space-y-5 bg-surface">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Learner
                  </label>
                  <p className="text-lg font-bold text-text-primary mt-0.5">
                    {result.certificate.learnerName}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Path Completed
                  </label>
                  <p className="font-semibold text-text-primary mt-0.5">
                    {result.certificate.pathName}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Issued On
                  </label>
                  <p className="font-medium text-text-primary mt-0.5">
                    {new Date(result.certificate.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-color)]">
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Certificate ID
                  </label>
                  <p className="font-mono text-sm font-bold text-accent mt-0.5">
                    {result.certificate.id}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Back link */}
          <div className="text-center mt-8">
            <a
              href="/verify"
              className="text-sm text-text-muted hover:text-accent transition-colors"
            >
              Verify another certificate
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

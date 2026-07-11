import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import { CertificateDownload } from "./download-client";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ certId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { certId } = await params;
  return {
    title: `Certificate ${certId} - SkillItLearn`,
    description: "View and download your SkillItLearn certificate.",
  };
}

export default async function CertificateViewPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { certId } = await params;

  const cert = await prisma.certificate.findUnique({
    where: { uniqueCertificateId: certId.toUpperCase() },
    include: {
      path: {
        select: {
          name: true,
          career: { select: { name: true } },
          certificateTemplate: {
            select: { signatoryName: true, signatoryTitle: true },
          },
        },
      },
    },
  });

  if (!cert || cert.userId !== user.id) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="container-page py-20 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Certificate Not Found</h1>
          <p className="text-text-secondary">
            This certificate does not exist or you do not have permission to view it.
          </p>
        </div>
      </main>
    );
  }

  if (cert.revoked) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="container-page py-20 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Certificate Revoked</h1>
          <p className="text-text-secondary">This certificate has been revoked and is no longer valid.</p>
        </div>
      </main>
    );
  }

  const issueDate = cert.issuedAt.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <section className="bg-green-50 dark:bg-[#1a1a2e] py-10 md:py-14">
        <div className="container-page text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Congratulations, {user.fullName}!
          </h1>
          <p className="text-white/60">
            Your certificate has been issued.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-14">
        <div className="container-page max-w-2xl">
          {/* Certificate card */}
          <div className="rounded-2xl border border-[var(--border-color)] shadow-card overflow-hidden mb-8">
            {/* Preview banner */}
            <div className="bg-gradient-to-r from-accent/10 to-green-100 dark:from-accent/5 dark:to-green-900/10 p-8 text-center border-b border-[var(--border-color)]">
              <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-[#1a1a2e]0/10 text-green-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
                </svg>
                Verified
              </div>
              <h2 className="text-xl font-bold text-text-primary">
                {cert.path.name}
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                {cert.path.career.name}
              </p>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Certificate ID
                  </label>
                  <p className="font-mono text-base font-bold text-accent mt-0.5">
                    {cert.uniqueCertificateId}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Issued On
                  </label>
                  <p className="font-medium text-text-primary mt-0.5">
                    {issueDate}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Learner
                  </label>
                  <p className="font-semibold text-text-primary mt-0.5">
                    {user.fullName}
                  </p>
                </div>
                {cert.path.certificateTemplate && (
                  <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                      Signed By
                    </label>
                    <p className="font-medium text-text-primary mt-0.5">
                      {cert.path.certificateTemplate.signatoryName}
                    </p>
                    <p className="text-xs text-text-muted">
                      {cert.path.certificateTemplate.signatoryTitle}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Download + Share actions */}
          <CertificateDownload certId={cert.uniqueCertificateId} />

          {/* Verification link */}
          <div className="text-center mt-6 p-4 rounded-xl bg-surface-raised border border-[var(--border-color)]">
            <p className="text-xs text-text-muted mb-1">Verification URL (shareable)</p>
            <p className="font-mono text-sm text-accent break-all">
              {`${process.env.NEXT_PUBLIC_SITE_URL || "https://skillitlearn.com"}/verify/${cert.uniqueCertificateId}`}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

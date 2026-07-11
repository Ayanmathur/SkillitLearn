import { getCurrentUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPathsWithTemplates } from "./actions";

export default async function CertificateTemplatesPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    redirect("/");
  }

  const paths = await getPathsWithTemplates();

  // Group by career
  const grouped: Record<string, typeof paths> = {};
  for (const p of paths) {
    if (!grouped[p.careerName]) grouped[p.careerName] = [];
    grouped[p.careerName].push(p);
  }

  const totalPaths = paths.length;
  const withTemplate = paths.filter((p) => p.hasTemplate).length;

  return (
    <main className="min-h-screen bg-surface">
      <div className="container-page py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link href="/admin" className="hover:text-accent transition-colors">Admin</Link>
          <span>/</span>
          <span className="text-text-primary font-medium">Certificate Templates</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Certificate Templates</h1>
            <p className="text-text-secondary mt-1">
              Configure certificate details for each path. A template must be set up before certificates can be issued.
            </p>
          </div>
          <div className="bg-accent/10 text-accent font-bold text-lg rounded-xl px-4 py-2">
            {withTemplate}/{totalPaths}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 rounded-full bg-surface-raised overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${totalPaths > 0 ? (withTemplate / totalPaths) * 100 : 0}%` }}
            />
          </div>
          <p className="text-xs text-text-muted mt-1">
            {withTemplate} of {totalPaths} paths have certificate templates configured
          </p>
        </div>

        {/* Career groups */}
        <div className="space-y-8">
          {Object.entries(grouped).map(([career, careerPaths]) => (
            <div key={career}>
              <h2 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                {career}
                <span className="text-xs font-normal text-text-muted bg-surface-raised rounded-full px-2 py-0.5">
                  {careerPaths.filter((p) => p.hasTemplate).length}/{careerPaths.length}
                </span>
              </h2>
              <div className="grid gap-3">
                {careerPaths.map((p) => (
                  <Link
                    key={p.id}
                    href={`/admin/certificates/${p.id}`}
                    className="flex items-center justify-between bg-surface-raised rounded-xl p-4
                               border border-[var(--border-color)] hover:shadow-card transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                   ${p.hasTemplate
                                     ? "bg-green-50 dark:bg-[#1a1a2e]0/10 text-green-600"
                                     : "bg-red-500/10 text-red-500"
                                   }`}
                      >
                        {p.hasTemplate ? "✓" : "✕"}
                      </div>
                      <div>
                        <span className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                          {p.name}
                        </span>
                        {p.template?.signatoryName && (
                          <span className="text-xs text-text-muted ml-2">
                            Signed by: {p.template.signatoryName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        p.hasTemplate
                          ? "bg-green-50 dark:bg-[#1a1a2e]0/10 text-green-600"
                          : "bg-orange-500/10 text-orange-600"
                      }`}>
                        {p.hasTemplate ? "Configured" : "Not Set"}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted group-hover:text-accent transition-colors">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

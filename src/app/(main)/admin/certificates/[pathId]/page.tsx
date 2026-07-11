import { getCurrentUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import { getPathTemplate } from "../actions";
import { CertTemplateForm } from "./form";
import Link from "next/link";

interface Props {
  params: Promise<{ pathId: string }>;
}

export default async function EditCertTemplatePage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    redirect("/");
  }

  const { pathId } = await params;
  const result = await getPathTemplate(pathId);

  if ("error" in result && result.error) {
    return (
      <main className="min-h-screen bg-surface">
        <div className="container-page py-8">
          <p className="text-red-500">{result.error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface">
      <div className="container-page py-8 max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6 flex-wrap">
          <Link href="/admin" className="hover:text-accent transition-colors">Admin</Link>
          <span>/</span>
          <Link href="/admin/certificates" className="hover:text-accent transition-colors">Certificate Templates</Link>
          <span>/</span>
          <span className="text-text-primary font-medium">{result.path!.name}</span>
        </nav>

        <h1 className="text-2xl font-bold text-text-primary mb-1">
          Certificate Template
        </h1>
        <p className="text-text-secondary mb-8">
          {result.path!.careerName} → {result.path!.name}
        </p>

        <CertTemplateForm
          pathId={pathId}
          pathName={result.path!.name}
          existing={result.template ?? null}
        />
      </div>
    </main>
  );
}

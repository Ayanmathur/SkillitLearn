"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const ALLOWED_IMAGE_MIMES = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Get all paths with their certificate template status.
 */
export async function getPathsWithTemplates() {
  await requireRole(["admin", "super_admin"]);

  const paths = await prisma.path.findMany({
    include: {
      career: { select: { name: true } },
      certificateTemplate: true,
    },
    orderBy: [{ career: { name: "asc" } }, { orderIndex: "asc" }],
  });

  return paths.map((p) => ({
    id: p.id,
    name: p.name,
    careerName: p.career.name,
    hasTemplate: !!p.certificateTemplate,
    template: p.certificateTemplate
      ? {
          id: p.certificateTemplate.id,
          signatoryName: p.certificateTemplate.signatoryName,
          signatoryTitle: p.certificateTemplate.signatoryTitle,
          logoUrl: p.certificateTemplate.logoUrl,
          signatureUrl: p.certificateTemplate.signatureUrl,
          certificateTitle: p.certificateTemplate.templateLayoutJson
            ? (p.certificateTemplate.templateLayoutJson as Record<string, string>).certificateTitle
            : null,
        }
      : null,
  }));
}

/**
 * Get a single path's template for editing.
 */
export async function getPathTemplate(pathId: string) {
  await requireRole(["admin", "super_admin"]);

  const path = await prisma.path.findUnique({
    where: { id: pathId },
    include: {
      career: { select: { name: true } },
      certificateTemplate: true,
    },
  });

  if (!path) return { error: "Path not found" };

  return {
    path: {
      id: path.id,
      name: path.name,
      careerName: path.career.name,
    },
    template: path.certificateTemplate
      ? {
          id: path.certificateTemplate.id,
          signatoryName: path.certificateTemplate.signatoryName || "",
          signatoryTitle: path.certificateTemplate.signatoryTitle || "",
          logoUrl: path.certificateTemplate.logoUrl || "",
          signatureUrl: path.certificateTemplate.signatureUrl || "",
          certificateTitle: path.certificateTemplate.templateLayoutJson
            ? (path.certificateTemplate.templateLayoutJson as Record<string, string>).certificateTitle || ""
            : "",
        }
      : null,
  };
}

/**
 * Upload a file to a Supabase storage bucket.
 */
async function uploadToBucket(bucket: string, file: File, prefix: string): Promise<{ url?: string; error?: string }> {
  if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
    return { error: `Invalid file type: ${file.type}. Allowed: PNG, JPEG, SVG, WebP.` };
  }
  if (file.size > MAX_SIZE) {
    return { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max: 5MB.` };
  }

  const ext = file.name.split(".").pop() || "png";
  const filename = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const supabase = await createServerSupabaseClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) return { error: `Upload failed: ${error.message}` };

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return { url: data.publicUrl };
}

/**
 * Upsert a certificate template for a path.
 */
export async function upsertCertificateTemplate(formData: FormData) {
  await requireRole(["admin", "super_admin"]);

  const pathId = formData.get("pathId") as string;
  const certificateTitle = formData.get("certificateTitle") as string;
  const signatoryName = formData.get("signatoryName") as string;
  const signatoryTitle = formData.get("signatoryTitle") as string;
  const logoFile = formData.get("logo") as File | null;
  const signatureFile = formData.get("signature") as File | null;

  if (!pathId) return { error: "Path ID is required." };
  if (!certificateTitle?.trim()) return { error: "Certificate title is required." };
  if (!signatoryName?.trim()) return { error: "Signatory name is required." };
  if (!signatoryTitle?.trim()) return { error: "Signatory title is required." };

  // Upload files if provided
  let logoUrl: string | undefined;
  let signatureUrl: string | undefined;

  if (logoFile && logoFile.size > 0) {
    const result = await uploadToBucket("content-assets", logoFile, "logos");
    if (result.error) return { error: result.error };
    logoUrl = result.url;
  }

  if (signatureFile && signatureFile.size > 0) {
    const result = await uploadToBucket("content-assets", signatureFile, "signatures");
    if (result.error) return { error: result.error };
    signatureUrl = result.url;
  }

  // Build update data
  const updateData: Record<string, unknown> = {
    signatoryName: signatoryName.trim(),
    signatoryTitle: signatoryTitle.trim(),
    templateLayoutJson: { certificateTitle: certificateTitle.trim() },
  };
  if (logoUrl) updateData.logoUrl = logoUrl;
  if (signatureUrl) updateData.signatureUrl = signatureUrl;

  const template = await prisma.pathCertificateTemplate.upsert({
    where: { pathId },
    update: updateData,
    create: {
      pathId,
      ...updateData,
    } as {
      pathId: string;
      signatoryName: string;
      signatoryTitle: string;
      templateLayoutJson: { certificateTitle: string };
      logoUrl?: string;
      signatureUrl?: string;
    },
  });

  return { success: true, templateId: template.id };
}

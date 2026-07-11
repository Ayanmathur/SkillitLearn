"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/app/auth/actions";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { verifyLimiter, certIssueLimiter } from "@/lib/rate-limit";
import crypto from "crypto";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";


/**
 * CERTIFICATE_SECRET - HMAC signing secret for certificate verification.
 * CRITICAL: This must NEVER be rotated without re-issuing ALL existing
 * certificates, since verification depends on reproducing the same hash.
 */
const CERT_SECRET = process.env.CERTIFICATE_SECRET || "skillitlearn-cert-secret-2025";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://skillitlearn.com";

// ---- Helpers ----

function generateCertId(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I confusion
  let code = "";
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return `SIL-${year}-${code}`;
}

function generateVerificationHash(certId: string, userId: string, pathId: string): string {
  return crypto
    .createHmac("sha256", CERT_SECRET)
    .update(`${certId}:${userId}:${pathId}`)
    .digest("hex")
    .substring(0, 16);
}

async function ensureUniqueCertId(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const id = generateCertId();
    const existing = await prisma.certificate.findUnique({
      where: { uniqueCertificateId: id },
      select: { id: true },
    });
    if (!existing) return id;
  }
  throw new Error("Failed to generate unique certificate ID after 10 attempts");
}

async function generateQRCodeBuffer(url: string): Promise<Buffer> {
  const dataUrl = await QRCode.toDataURL(url, {
    width: 200,
    margin: 1,
    color: { dark: "#1a1a2e", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
  // Convert data URL to buffer
  const base64 = dataUrl.split(",")[1];
  return Buffer.from(base64, "base64");
}

async function generateCertificatePDF(data: {
  certId: string;
  learnerName: string;
  pathName: string;
  careerName: string;
  certificateTitle: string;
  signatoryName: string;
  signatoryTitle: string;
  issueDate: Date;
  qrBuffer: Buffer;
  logoBuffer?: Buffer;
  signatureBuffer?: Buffer;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
    });

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const width = doc.page.width;
    const height = doc.page.height;

    // -- Background Template (The fully flattened Canva image) --
    if (data.logoBuffer) {
      try {
        doc.image(data.logoBuffer, 0, 0, { width, height });
      } catch (err) {
        console.error("Failed to render background image:", err);
      }
    } else {
      // Fallback white background if no template provided
      doc.rect(0, 0, width, height).fill("#ffffff");
    }

    // -- Learner Name (Centered exactly over the main blank line) --
    // Visually, the line is at ~53% down the page. We draw text slightly above it.
    doc.font("Helvetica-Bold").fontSize(38).fillColor("#1a1a2e");
    doc.text(data.learnerName, 0, height * 0.49, { align: "center", width });

    // -- Course / Path Name --
    // The user's template has a paragraph "In recognition of outstanding knowledge...".
    // We will place the specific Course / Path name directly beneath that paragraph.
    doc.font("Helvetica-Bold").fontSize(18).fillColor("#1a1a2e");
    doc.text(`For successfully completing: ${data.pathName}`, 0, height * 0.68, { align: "center", width });
    
    // -- Career --
    doc.font("Helvetica").fontSize(12).fillColor("#555555");
    doc.text(`Career Track: ${data.careerName}`, 0, height * 0.72, { align: "center", width });

    // -- Certificate ID --
    // The template has a specific line in the bottom right corner above the text "Certificate ID".
    // X is approx 65% across, Y is approx 80% down.
    doc.font("Helvetica-Bold").fontSize(12).fillColor("#1a1a2e");
    doc.text(data.certId, width * 0.645, height * 0.81, { align: "center", width: width * 0.28 });

    // -- Date (Optional - place neatly under the ID or bottom center) --
    const dateStr = data.issueDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    doc.font("Helvetica").fontSize(10).fillColor("#555555");
    doc.text(`Issued: ${dateStr}`, width * 0.645, height * 0.88, { align: "center", width: width * 0.28 });

    // -- QR Code --
    // Place QR Code in bottom left or top right corner since bottom right is taken
    try {
      doc.image(data.qrBuffer, 40, height - 120, { width: 80, height: 80 });
      doc.font("Helvetica").fontSize(8).fillColor("#555555");
      doc.text("Scan to verify", 40, height - 35, { width: 80, align: "center" });
    } catch {
      // Skip if QR fails
    }

    doc.end();
  });
}

async function fetchImageBuffer(url: string): Promise<Buffer | undefined> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return undefined;
    const arrayBuf = await res.arrayBuffer();
    return Buffer.from(arrayBuf);
  } catch {
    return undefined;
  }
}

// ---- Main Actions ----

/**
 * Check if a user has completed all skills in a path.
 */
export async function checkPathCompletion(pathId: string) {
  const user = await requireAuth();

  const path = await prisma.path.findUnique({
    where: { id: pathId },
    include: {
      skills: { select: { id: true } },
      career: { select: { name: true } },
    },
  });

  if (!path) return { error: "Path not found" };

  const completions = await prisma.skillCompletion.findMany({
    where: {
      userId: user.id,
      skillId: { in: path.skills.map((s) => s.id) },
      quizPassed: true,
    },
  });

  const allComplete = completions.length >= path.skills.length && path.skills.length > 0;

  const existing = await prisma.certificate.findFirst({
    where: { userId: user.id, pathId, revoked: false },
  });

  return {
    pathName: path.name,
    careerName: path.career.name,
    totalSkills: path.skills.length,
    completedSkills: completions.length,
    allComplete,
    existingCertificate: existing
      ? { id: existing.uniqueCertificateId, issuedAt: existing.issuedAt }
      : null,
  };
}

/**
 * Issue a certificate with full PDF + QR code generation.
 * Only issues if ALL skills in the path have quizPassed = true
 * AND the path has a complete certificate template.
 */
export async function issueCertificate(pathId: string) {
  const user = await requireAuth();

  // Rate limit: 5 certificate issuances per minute per user
  const rate = certIssueLimiter.check(user.id);
  if (!rate.allowed) {
    return { error: "Too many requests. Please wait a moment." };
  }

  // 1. Verify all skills complete
  const path = await prisma.path.findUnique({
    where: { id: pathId },
    include: {
      skills: { select: { id: true } },
      career: { select: { name: true } },
      certificateTemplate: true,
    },
  });

  if (!path) return { error: "Path not found" };

  // Check template exists with required fields
  const tmpl = path.certificateTemplate;
  if (!tmpl || !tmpl.signatoryName || !tmpl.signatoryTitle) {
    return { error: "Certificate template is not configured for this path. Contact admin." };
  }

  const completions = await prisma.skillCompletion.count({
    where: {
      userId: user.id,
      skillId: { in: path.skills.map((s) => s.id) },
      quizPassed: true,
    },
  });

  if (completions < path.skills.length || path.skills.length === 0) {
    return { error: "Not all skills are completed. Pass all quizzes first." };
  }

  // 2. Check if already issued
  const existing = await prisma.certificate.findFirst({
    where: { userId: user.id, pathId, revoked: false },
  });
  if (existing) {
    return { certificate: { id: existing.uniqueCertificateId, issuedAt: existing.issuedAt } };
  }

  // 3. Generate unique certificate ID
  const certId = await ensureUniqueCertId();

  // 4. Generate verification hash (HMAC)
  const hash = generateVerificationHash(certId, user.id, pathId);

  // 5. Generate QR code
  const verifyUrl = `${SITE_URL}/verify/${certId}`;
  const qrBuffer = await generateQRCodeBuffer(verifyUrl);

  // 6. Fetch template assets
  const logoBuffer = tmpl.logoUrl ? await fetchImageBuffer(tmpl.logoUrl) : undefined;
  const signatureBuffer = tmpl.signatureUrl ? await fetchImageBuffer(tmpl.signatureUrl) : undefined;

  // Certificate title from template
  const certTitle = tmpl.templateLayoutJson
    ? ((tmpl.templateLayoutJson as Record<string, string>).certificateTitle || `Certificate of Completion`)
    : `Certificate of Completion`;

  // 7. Generate PDF
  const pdfBuffer = await generateCertificatePDF({
    certId,
    learnerName: user.fullName || user.email,
    pathName: path.name,
    careerName: path.career.name,
    certificateTitle: certTitle,
    signatoryName: tmpl.signatoryName,
    signatoryTitle: tmpl.signatoryTitle,
    issueDate: new Date(),
    qrBuffer,
    logoBuffer,
    signatureBuffer,
  });

  // 8. Upload to Supabase Storage (private bucket)
  const supabase = createServiceRoleClient();
  const pdfPath = `certificates/${certId}.pdf`;
  const qrPath = `certificates/${certId}-qr.png`;

  const [pdfUpload, qrUpload] = await Promise.all([
    supabase.storage.from("content-assets").upload(pdfPath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: false,
    }),
    supabase.storage.from("content-assets").upload(qrPath, qrBuffer, {
      contentType: "image/png",
      upsert: false,
    }),
  ]);

  if (pdfUpload.error) {
    console.error("PDF upload failed:", pdfUpload.error);
    return { error: "Failed to store certificate PDF." };
  }
  if (qrUpload.error) {
    console.error("QR upload failed:", qrUpload.error);
    // Non-critical - continue
  }

  // Get URLs (private - will use signed URLs for access)
  const pdfUrl = pdfPath;
  const qrUrl = qrPath;

  // 9. Insert certificate row
  const cert = await prisma.certificate.create({
    data: {
      uniqueCertificateId: certId,
      userId: user.id,
      pathId,
      verificationHash: hash,
      pdfUrl,
      qrCodeUrl: qrUrl,
    },
  });

  // 10. Audit log
  await prisma.auditLog.create({
    data: {
      actorUserId: user.id,
      action: "certificate_issued",
      targetTable: "certificates",
      targetId: cert.id,
      metadataJson: {
        certId,
        pathName: path.name,
        userName: user.fullName,
        verifyUrl,
      },
    },
  });

  return {
    certificate: { id: cert.uniqueCertificateId, issuedAt: cert.issuedAt },
  };
}

/**
 * Get a signed download URL for a certificate PDF.
 * URLs expire after 5 minutes - never permanently public.
 */
export async function getCertificateDownloadUrl(certId: string) {
  const user = await requireAuth();

  const cert = await prisma.certificate.findUnique({
    where: { uniqueCertificateId: certId },
    select: { userId: true, pdfUrl: true, revoked: true },
  });

  if (!cert) return { error: "Certificate not found." };
  if (cert.revoked) return { error: "This certificate has been revoked." };
  if (cert.userId !== user.id) return { error: "You do not own this certificate." };
  if (!cert.pdfUrl) return { error: "Certificate PDF not available." };

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.storage
    .from("content-assets")
    .createSignedUrl(cert.pdfUrl, 300); // 5 minutes

  if (error || !data?.signedUrl) {
    return { error: "Failed to generate download link." };
  }

  return { url: data.signedUrl };
}

/**
 * Verify a certificate by its public ID.
 * Public - no auth required.
 * Recomputes HMAC hash and compares to stored hash.
 */
export async function verifyCertificate(certId: string) {
  if (!certId || certId.length < 5) return { error: "Invalid certificate ID." };

  // Rate limit: 10 requests per minute per cert ID prefix
  const rateKey = certId.substring(0, 10).toUpperCase();
  const rate = verifyLimiter.check(rateKey);
  if (!rate.allowed) {
    return { error: "Too many verification requests. Please try again later." };
  }

  const cert = await prisma.certificate.findUnique({
    where: { uniqueCertificateId: certId.toUpperCase().trim() },
    include: {
      user: { select: { fullName: true } },
      path: {
        select: {
          name: true,
          career: { select: { name: true } },
        },
      },
    },
  });

  if (!cert) return { error: "Certificate not found. Please check the ID and try again." };

  // Recompute HMAC and compare
  const expectedHash = generateVerificationHash(cert.uniqueCertificateId, cert.userId, cert.pathId);
  const valid = expectedHash === cert.verificationHash;

  if (!valid) {
    return { error: "This certificate could not be verified." };
  }

  if (cert.revoked) {
    return { error: "This certificate could not be verified.", revoked: true };
  }

  // Only return: learner name, path name, issue date, verified badge
  // No email, no personal data, no skills list
  return {
    valid: true,
    certificate: {
      id: cert.uniqueCertificateId,
      learnerName: cert.user.fullName || "Learner",
      pathName: cert.path.name,
      issuedAt: cert.issuedAt,
    },
  };
}

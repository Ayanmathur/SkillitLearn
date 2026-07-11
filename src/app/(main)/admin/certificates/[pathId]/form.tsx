"use client";

import { useState, useTransition } from "react";
import { upsertCertificateTemplate } from "../actions";

interface Props {
  pathId: string;
  pathName: string;
  existing: {
    id: string;
    signatoryName: string;
    signatoryTitle: string;
    logoUrl: string;
    signatureUrl: string;
    certificateTitle: string | null;
  } | null;
}

export function CertTemplateForm({ pathId, pathName, existing }: Props) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [certTitle, setCertTitle] = useState(
    existing?.certificateTitle || `Certificate of Completion - ${pathName}`
  );
  const [sigName, setSigName] = useState(existing?.signatoryName || "Ayan Mathur");
  const [sigTitle, setSigTitle] = useState(existing?.signatoryTitle || "Founder, SkillItLearn");
  const [logoPreview, setLogoPreview] = useState<string | null>(existing?.logoUrl || null);
  const [sigPreview, setSigPreview] = useState<string | null>(existing?.signatureUrl || null);

  function handleFilePreview(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string | null) => void
  ) {
    const file = e.target.files?.[0];
    if (file) {
      setter(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("pathId", pathId);

    startTransition(async () => {
      const result = await upsertCertificateTemplate(formData);
      if ("error" in result && result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Certificate Title */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Certificate Title
        </label>
        <input
          name="certificateTitle"
          value={certTitle}
          onChange={(e) => setCertTitle(e.target.value)}
          className="w-full rounded-xl px-4 py-3 border border-[var(--border-color)]
                     bg-surface text-text-primary
                     focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50"
          placeholder="e.g., Certificate of Completion - Digital Marketing Path"
          required
        />
        <p className="text-xs text-text-muted mt-1">
          Appears at the top of the certificate document.
        </p>
      </div>

      {/* Signatory Name */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Signatory Name
          </label>
          <input
            name="signatoryName"
            value={sigName}
            onChange={(e) => setSigName(e.target.value)}
            className="w-full rounded-xl px-4 py-3 border border-[var(--border-color)]
                       bg-surface text-text-primary
                       focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="Ayan Mathur"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text-primary mb-2">
            Signatory Title
          </label>
          <input
            name="signatoryTitle"
            value={sigTitle}
            onChange={(e) => setSigTitle(e.target.value)}
            className="w-full rounded-xl px-4 py-3 border border-[var(--border-color)]
                       bg-surface text-text-primary
                       focus:outline-none focus:ring-2 focus:ring-accent/50"
            placeholder="Founder, SkillItLearn"
            required
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Company Logo
        </label>
        <div className="flex items-start gap-4">
          {logoPreview && (
            <div className="w-20 h-20 rounded-xl border border-[var(--border-color)] overflow-hidden flex-shrink-0 bg-white">
              <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-1" />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              name="logo"
              accept="image/png,image/svg+xml,image/jpeg,image/webp"
              onChange={(e) => handleFilePreview(e, setLogoPreview)}
              className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0 file:text-sm file:font-semibold
                         file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
            />
            <p className="text-xs text-text-muted mt-1">
              PNG or SVG, max 5MB. Appears on the certificate.
              {existing?.logoUrl && !logoPreview?.startsWith("blob:") && " Current logo is saved."}
            </p>
          </div>
        </div>
      </div>

      {/* Signature Upload */}
      <div>
        <label className="block text-sm font-semibold text-text-primary mb-2">
          Signatory Signature
        </label>
        <div className="flex items-start gap-4">
          {sigPreview && (
            <div className="w-32 h-16 rounded-xl border border-[var(--border-color)] overflow-hidden flex-shrink-0 bg-white">
              <img src={sigPreview} alt="Signature preview" className="w-full h-full object-contain p-1" />
            </div>
          )}
          <div className="flex-1">
            <input
              type="file"
              name="signature"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => handleFilePreview(e, setSigPreview)}
              className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0 file:text-sm file:font-semibold
                         file:bg-accent/10 file:text-accent hover:file:bg-accent/20"
            />
            <p className="text-xs text-text-muted mt-1">
              PNG with transparent background preferred, max 5MB.
              {existing?.signatureUrl && !sigPreview?.startsWith("blob:") && " Current signature is saved."}
            </p>
          </div>
        </div>
      </div>

      {/* Certificate Preview */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">Preview</h3>
        <div className="border border-[var(--border-color)] rounded-2xl p-8 bg-white text-center">
          <div className="border-2 border-accent/20 rounded-xl p-8">
            {logoPreview && (
              <div className="mb-4">
                <img src={logoPreview} alt="Logo" className="h-16 mx-auto object-contain" />
              </div>
            )}
            <h4 className="text-xl font-bold text-gray-900 mb-2">{certTitle || "Certificate Title"}</h4>
            <p className="text-sm text-gray-500 mb-4">This is to certify that</p>
            <p className="text-2xl font-bold text-accent mb-1">Learner Name</p>
            <p className="text-sm text-gray-500 mb-6">
              has successfully completed all requirements
            </p>
            <div className="border-t border-gray-200 pt-4 inline-block">
              {sigPreview && (
                <img src={sigPreview} alt="Signature" className="h-12 mx-auto object-contain mb-1" />
              )}
              <p className="font-bold text-gray-900 text-sm">{sigName || "Signatory Name"}</p>
              <p className="text-xs text-gray-500">{sigTitle || "Title"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                     font-semibold rounded-full px-8 py-3
                     transition-all duration-300 hover:shadow-lg hover:shadow-accent/30
                     disabled:opacity-50"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            existing ? "Update Template" : "Create Template"
          )}
        </button>

        {success && (
          <span className="text-sm text-green-600 font-medium animate-fade-in">
            ✓ Template saved successfully!
          </span>
        )}
        {error && (
          <span className="text-sm text-red-500 font-medium">
            {error}
          </span>
        )}
      </div>
    </form>
  );
}

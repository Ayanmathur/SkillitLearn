"use client";

import { useState, useTransition } from "react";
import { getCertificateDownloadUrl } from "../actions";

interface Props {
  certId: string;
}

export function CertificateDownload({ certId }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDownload() {
    startTransition(async () => {
      setError(null);
      const result = await getCertificateDownloadUrl(certId);
      if ("error" in result && result.error) {
        setError(result.error);
      } else if (result.url) {
        // Open signed URL in new tab - triggers download
        window.open(result.url, "_blank");
      }
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      {/* Download PDF */}
      <button
        onClick={handleDownload}
        disabled={isPending}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                   bg-accent hover:bg-accent-hover text-white
                   font-semibold rounded-full px-8 py-3.5
                   transition-all duration-300 hover:shadow-lg hover:shadow-accent/30
                   disabled:opacity-50"
      >
        {isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating Link...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download Certificate (PDF)
          </>
        )}
      </button>

      {/* Verify link */}
      <a
        href={`/verify/${certId}`}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2
                   border-2 border-accent text-accent
                   font-semibold rounded-full px-8 py-3
                   hover:bg-accent hover:text-white
                   transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" />
        </svg>
        Verify
      </a>

      {error && (
        <p className="text-sm text-red-500 w-full text-center sm:text-left">{error}</p>
      )}
    </div>
  );
}

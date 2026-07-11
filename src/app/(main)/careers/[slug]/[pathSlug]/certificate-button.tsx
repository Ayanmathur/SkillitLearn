"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { issueCertificate } from "../../../certificates/actions";

interface Props {
  pathId: string;
  hasTemplate: boolean;
}

export function CertificateButton({ pathId, hasTemplate }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleClaim() {
    startTransition(async () => {
      setError(null);
      const result = await issueCertificate(pathId);
      if ("error" in result && result.error) {
        setError(result.error);
      } else if (result.certificate) {
        // Redirect to certificate confirmation/download page
        router.push(`/certificates/${result.certificate.id}`);
      }
    });
  }

  if (!hasTemplate) {
    return (
      <div className="relative group inline-block">
        <button
          disabled
          className="inline-flex items-center gap-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400
                     font-semibold rounded-full px-8 py-3.5 cursor-not-allowed"
        >
          🎓 Done - Proceed to Certificate
        </button>
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100
                        bg-green-50 text-white text-xs rounded-lg px-4 py-2 whitespace-nowrap
                        pointer-events-none transition-opacity shadow-lg z-10">
          Certificate is being prepared for this path
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-green-50 rotate-45" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleClaim}
        disabled={isPending}
        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white
                   font-semibold rounded-full px-8 py-3.5
                   transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30
                   disabled:opacity-50"
      >
        {isPending ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating Certificate...
          </>
        ) : (
          <>
            🎓 Done - Proceed to Certificate
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}

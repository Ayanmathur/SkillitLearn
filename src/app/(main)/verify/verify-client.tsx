"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyCertificate } from "../certificates/actions";

interface CertInfo {
  id: string;
  learnerName: string;
  pathName: string;
  issuedAt: Date;
}

export function VerifyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [certId, setCertId] = useState(searchParams.get("id") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    valid?: boolean;
    certificate?: CertInfo;
    error?: string;
    revoked?: boolean;
  } | null>(null);

  // Auto-verify if ID in URL
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setCertId(id);
      handleVerify(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleVerify(id?: string) {
    const target = (id || certId).trim().toUpperCase();
    if (!target) return;

    // If it looks like a full cert ID, redirect to the dedicated page
    if (target.match(/^SIL-\d{4}-[A-Z0-9]{6}$/)) {
      router.push(`/verify/${target}`);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const r = await verifyCertificate(target);
      setResult(r as typeof result);
    } catch {
      setResult({ error: "Verification failed. Please try again." });
    }
    setLoading(false);
  }

  return (
    <div>
      {/* Search */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={certId}
          onChange={(e) => setCertId(e.target.value.toUpperCase())}
          placeholder="SIL-2026-XXXXXX"
          className="flex-1 rounded-xl px-4 py-3 text-base bg-surface-raised border border-[var(--border-color)]
                     text-text-primary placeholder-text-muted font-mono tracking-wider
                     focus:outline-none focus:ring-2 focus:ring-accent/50"
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
        />
        <button
          onClick={() => handleVerify()}
          disabled={loading || !certId.trim()}
          className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-8 py-3
                     transition-all disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div>
          {result.error ? (
            <div className={`rounded-2xl border-2 p-6 text-center
              ${result.revoked
                ? "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800"
                : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
              }`}>
              <div className="text-4xl mb-3">{result.revoked ? "⚠️" : "❌"}</div>
              <h2 className="text-xl font-bold text-text-primary mb-1">
                {result.revoked ? "Certificate Revoked" : "Verification Failed"}
              </h2>
              <p className="text-text-secondary text-sm">{result.error}</p>
            </div>
          ) : result.valid && result.certificate ? (
            <div className="rounded-2xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-[#1a1a2e] dark:bg-green-900/10 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
                <div className="text-4xl mb-2">✅</div>
                <h2 className="text-xl font-bold text-white mb-1">Verified</h2>
                <p className="text-white/70 text-sm">This certificate is authentic and valid.</p>
              </div>

              {/* Details - only name, path, date */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Certificate ID
                  </label>
                  <p className="font-mono text-lg font-bold text-accent mt-0.5">
                    {result.certificate.id}
                  </p>
                </div>

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
                  <p className="font-medium text-text-primary mt-0.5">
                    {result.certificate.pathName}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Issued
                  </label>
                  <p className="font-medium text-text-primary mt-0.5">
                    {new Date(result.certificate.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

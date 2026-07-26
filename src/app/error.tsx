"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Something went wrong
        </h1>
        <p className="text-text-secondary mb-6">
          We hit a temporary issue loading this page. This usually resolves
          itself in a few seconds.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-all duration-200"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 border border-[var(--border-color)] text-text-primary font-semibold rounded-full hover:bg-surface-raised transition-all duration-200"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}

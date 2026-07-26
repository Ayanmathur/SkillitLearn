import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found | SkillItLearn",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Page Not Found
        </h1>
        <p className="text-text-secondary mb-8">
          The requested career, path, or skill could not be found. Please check the link or explore our available career paths.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/careers"
            className="px-8 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full transition-all duration-200 shadow-md"
          >
            Explore Careers
          </Link>
          <Link
            href="/"
            className="px-8 py-3 border border-[var(--border-color)] text-text-primary font-semibold rounded-full hover:bg-surface-raised transition-all duration-200"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

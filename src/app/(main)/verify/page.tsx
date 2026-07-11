import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyClient } from "./verify-client";

export const metadata: Metadata = {
  title: "Verify Certificate - SkillItLearn",
  description: "Verify the authenticity of a SkillItLearn certificate using its unique ID.",
};

export default function VerifyPage() {
  return (
    <main className="min-h-screen bg-surface">
      <section className="bg-green-50 dark:bg-[#1a1a2e] py-12 md:py-16">
        <div className="container-page text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Verify a Certificate
          </h1>
          <p className="text-gray-600 dark:text-white/60 max-w-xl mx-auto">
            Enter a SkillItLearn certificate ID to verify its authenticity.
            Certificate IDs look like SIL-2026-A1B2C3.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-14">
        <div className="container-page max-w-2xl">
          <Suspense fallback={<div className="text-center py-8 text-text-secondary">Loading...</div>}>
            <VerifyClient />
          </Suspense>
        </div>
      </section>
    </main>
  );
}

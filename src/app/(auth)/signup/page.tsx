"use client";

import { useState } from "react";
import { signUp, signInWithGoogle } from "@/app/auth/actions";
import Link from "next/link";

/**
 * Signup page - email/password with OTP verification + Google OAuth.
 */
export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const result = await signUp(formData);
    if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      setSuccess(result.message || "Check your email for verification.");
    }
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold">
              Skill<span className="text-accent">It</span>Learn
            </h1>
          </Link>
          <p className="text-text-secondary mt-2">
            Create your account to start learning
          </p>
        </div>

        {/* Card */}
        <div className="card">
          {/* Google Sign In */}
          <form action={handleGoogleSignIn}>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 rounded-pill px-6 py-3
                         border-2 border-[var(--border-color)] bg-surface
                         font-semibold text-sm text-text-primary
                         transition-all duration-200
                         hover:bg-surface-raised hover:shadow-card
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 48 48"
              >
                <path fill="#FFC107" d="M43.6 20.2H42V20H24v8h11.3C33.7 33.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.8z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.8-3.5-11.4-8.3l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.2H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2C36.6 39.6 44 34 44 24c0-1.3-.1-2.6-.4-3.8z" />
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-color)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-raised px-3 text-text-muted uppercase tracking-wider">
                or create with email
              </span>
            </div>
          </div>

          {/* Success message */}
          {success && (
            <div className="rounded-lg bg-green-50 dark:bg-[#1a1a2e] dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-300 mb-4">
              ✉️ {success}
            </div>
          )}

          {/* Email/Password Form */}
          <form action={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="signup-name"
                className="block text-sm font-semibold text-text-primary mb-1.5"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                name="fullName"
                type="text"
                required
                autoComplete="name"
                className="w-full rounded-xl px-4 py-3 text-sm
                           bg-surface border border-[var(--border-color)]
                           text-text-primary placeholder-text-muted
                           focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                           transition-all duration-200"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-semibold text-text-primary mb-1.5"
              >
                Email
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-xl px-4 py-3 text-sm
                           bg-surface border border-[var(--border-color)]
                           text-text-primary placeholder-text-muted
                           focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                           transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-semibold text-text-primary mb-1.5"
              >
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-xl px-4 py-3 text-sm
                           bg-surface border border-[var(--border-color)]
                           text-text-primary placeholder-text-muted
                           focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                           transition-all duration-200"
                placeholder="Min 6 characters"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

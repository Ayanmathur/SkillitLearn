import Link from "next/link";

/**
 * Auth prompt shown inline when anonymous visitors try to
 * track progress, take quizzes, or access certificates.
 *
 * Per spec: show a clear prompt, don't hide the content.
 */

interface AuthPromptProps {
  /** What the user is trying to do */
  action: "track progress" | "take this quiz" | "view your certificate" | "start learning";
  /** Optional: where to redirect after login */
  redirectTo?: string;
}

export function AuthPrompt({ action, redirectTo }: AuthPromptProps) {
  const loginHref = redirectTo
    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
    : "/login";

  return (
    <div className="rounded-xl border-2 border-dashed border-accent/30 bg-accent/5 px-6 py-5 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span className="font-semibold text-text-primary">
          Log in to {action}
        </span>
      </div>
      <p className="text-sm text-text-secondary mb-3">
        Create a free account or sign in to {action} and earn certificates.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Link href={loginHref} className="btn-primary text-sm px-5 py-2">
          Sign in
        </Link>
        <Link href="/signup" className="btn-secondary text-sm px-5 py-2">
          Create account
        </Link>
      </div>
    </div>
  );
}

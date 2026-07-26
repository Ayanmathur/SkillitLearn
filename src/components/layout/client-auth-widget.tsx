"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { SignOutButton } from "./sign-out-button";
import { ThemeToggle } from "../theme-toggle";

interface UserInfo {
  fullName: string;
  role: string;
}

/**
 * Client-side auth widget for the header.
 *
 * PERFORMANCE: By checking auth on the client instead of the server,
 * we allow public pages to be fully cached at the edge (ISR).
 * The header renders instantly with a "Log in" button, then swaps
 * to the user's profile once the client-side check completes (~100ms).
 */
export function ClientAuthWidget() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        // Fetch role from our API
        fetch("/api/me")
          .then((r) => r.json())
          .then((data) => {
            setUser({
              fullName: data.fullName || authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
              role: data.role || "learner",
            });
            setLoading(false);
          })
          .catch(() => {
            setUser({
              fullName: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
              role: "learner",
            });
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    // Tiny shimmer placeholder while checking auth
    return (
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="w-16 h-8 rounded-full bg-white/10 animate-pulse" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1.5"
          title="Account Settings"
        >
          <span>{user.fullName}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </Link>
        {(user.role === "admin" || user.role === "super_admin") && (
          <Link
            href="/admin"
            className="text-xs px-3 py-1.5 rounded-full bg-accent/20 text-accent font-semibold hover:bg-accent/30 transition-colors"
          >
            Admin
          </Link>
        )}
        <ThemeToggle />
        <SignOutButton />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <ThemeToggle />
      <Link
        href="/login"
        className="bg-accent hover:bg-accent-hover text-white font-semibold
                   rounded-full px-6 py-2 text-sm
                   transition-all duration-200 hover:shadow-md hover:shadow-accent/20"
      >
        Log in
      </Link>
    </div>
  );
}

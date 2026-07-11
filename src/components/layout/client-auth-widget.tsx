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
        <span className="text-sm text-white/70">{user.fullName}</span>
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

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { signOut } from "@/app/auth/actions";
import { ThemeToggle } from "../theme-toggle";

const NAV_LINKS = [
  { href: "/#careers", label: "Careers" },
  { href: "/certificates", label: "Certificates" },
  { href: "/verify", label: "Verify Certificate" },
  { href: "/about", label: "About" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        setUser({
          name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
        });
      }
    });
  }, []);

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}
        />
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-green-50 dark:bg-[#1a1a2e] border-t border-gray-200 dark:border-white/10 shadow-xl z-50">
          <nav className="container-page py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-gray-700 dark:text-white/80 hover:text-accent hover:bg-white/60 dark:hover:bg-white/5 transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-between px-4 py-2 my-1 rounded-xl text-gray-700 dark:text-white/80 font-medium text-sm">
              <span>Theme</span>
              <ThemeToggle className="p-2 rounded-full bg-white/40 dark:bg-white/10 text-gray-700 dark:text-white transition-colors" />
            </div>
            <div className="border-t border-gray-200 dark:border-white/10 mt-2 pt-3">
              {user ? (
                <>
                  <span className="px-4 py-2 block text-gray-500 dark:text-white/60 text-sm">
                    {user.name}
                  </span>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="px-4 py-3 rounded-xl text-gray-700 dark:text-white/80 hover:text-accent hover:bg-white/60 dark:hover:bg-white/5 transition-colors font-medium text-sm w-full text-left"
                    >
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block mx-4 text-center bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-all duration-200"
                >
                  Log in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

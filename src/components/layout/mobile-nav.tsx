"use client";

import { useState } from "react";
import Link from "next/link";

interface MobileNavProps {
  isLoggedIn: boolean;
  userName?: string;
}

const NAV_LINKS = [
  { href: "/#careers", label: "Careers" },
  { href: "/certificates", label: "Certificates" },
  { href: "/verify", label: "Verify Certificate" },
  { href: "/about", label: "About" },
];

export function MobileNav({ isLoggedIn, userName }: MobileNavProps) {
  const [open, setOpen] = useState(false);

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
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#1a1a2e] border-t border-white/10 shadow-xl z-50">
          <nav className="container-page py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 mt-2 pt-3">
              {isLoggedIn ? (
                <>
                  <span className="px-4 py-2 block text-white/60 text-sm">
                    {userName}
                  </span>
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm w-full text-left"
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

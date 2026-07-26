import Link from "next/link";
import { ClientAuthWidget } from "./client-auth-widget";
import { MobileNav } from "./mobile-nav";

const NAV_LINKS = [
  { href: "/#careers", label: "Careers" },
  { href: "/certificates", label: "Certificates" },
  { href: "/verify", label: "Verify Certificate" },
  { href: "/about", label: "About" },
];

/**
 * Site header — renders instantly with no server-side auth check.
 *
 * PERFORMANCE: Auth state is handled by <ClientAuthWidget /> on the client,
 * so this component is a pure static render. This allows Vercel to cache
 * every public page at the edge via ISR.
 */
export function Header() {
  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#5bbd72] via-[#45bdff] to-[#5bbd72] text-[#1a1a2e] py-1.5 px-4 text-center text-xs font-bold tracking-wide">
        🚀 Upgrade your career with 50+ structured learning paths & verifiable certificates
      </div>

      <header className="sticky top-0 z-50 bg-[#1a1a2e] shadow-lg border-b border-white/10">
      <div className="container-page flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src="/logo.png" alt="SkillItLearn" className="h-10 w-auto rounded" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-white/75 hover:text-white hover:bg-white/10
                         transition-all duration-200 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side — client-side auth (no server round-trip) */}
        <div className="hidden md:flex items-center gap-3">
          <ClientAuthWidget />
        </div>

        {/* Mobile hamburger */}
        <MobileNav />
      </div>
    </header>
    </>
  );
}

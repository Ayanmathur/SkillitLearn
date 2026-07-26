import Link from "next/link";
import { ClientAuthWidget } from "./client-auth-widget";
import { MobileNav } from "./mobile-nav";
import { MobileHeaderControls } from "./mobile-header-controls";

const NAV_LINKS = [
  { href: "/#careers", label: "Careers" },
  { href: "/certificates", label: "Certificates" },
  { href: "/verify", label: "Verify Certificate" },
  { href: "/about", label: "About" },
];

/**
 * Site header - renders instantly with no server-side auth check.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#1a1a2e] shadow-lg">
      <div className="container-page flex items-center justify-between h-16">
        {/* Left Side: Back Button + Logo */}
        <div className="flex items-center">
          <MobileHeaderControls />
          <Link href="/" className="flex-shrink-0">
            <img src="/logo.png" alt="SkillItLearn" className="h-9 md:h-10 w-auto rounded" />
          </Link>
        </div>

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

        {/* Right side - client-side auth (no server round-trip) */}
        <div className="hidden md:flex items-center gap-3">
          <ClientAuthWidget />
        </div>

        {/* Mobile hamburger */}
        <MobileNav />
      </div>
    </header>
  );
}

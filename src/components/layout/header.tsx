import Link from "next/link";
import { getCurrentUser } from "@/app/auth/actions";
import { MobileNav } from "./mobile-nav";
import { SignOutButton } from "./sign-out-button";

const NAV_LINKS = [
  { href: "/#careers", label: "Careers" },
  { href: "/certificates", label: "Certificates" },
  { href: "/verify", label: "Verify Certificate" },
  { href: "/about", label: "About" },
];

export async function Header() {
  const user = await getCurrentUser();
  const isLoggedIn = !!user;

  return (
    <header className="sticky top-0 z-50 bg-green-50 shadow-lg">
      <div className="container-page flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img src="/logo.svg" alt="SkillItLearn" className="h-10 w-auto rounded" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-gray-600 hover:text-accent hover:bg-white/60
                         transition-all duration-200 text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-gray-600">{user.fullName}</span>
              {(user.role === "admin" || user.role === "super_admin") && (
                <Link
                  href="/admin"
                  className="text-xs px-3 py-1.5 rounded-full bg-accent/20 text-accent font-semibold hover:bg-accent/30 transition-colors"
                >
                  Admin
                </Link>
              )}
              <SignOutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="bg-accent hover:bg-accent-hover text-white font-semibold
                         rounded-full px-6 py-2 text-sm
                         transition-all duration-200 hover:shadow-md hover:shadow-accent/20"
            >
              Log in
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <MobileNav isLoggedIn={isLoggedIn} userName={user?.fullName} />
      </div>
    </header>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";

export function MobileHeaderControls() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show back button on homepage
  const isHomepage = pathname === "/";

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  if (isHomepage) return null;

  return (
    <button
      onClick={handleBack}
      className="md:hidden inline-flex items-center gap-1 text-[#5bbd72] bg-white/10 hover:bg-white/20
                 px-3 py-1.5 rounded-full text-xs font-semibold transition-all mr-2"
      aria-label="Go back"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}

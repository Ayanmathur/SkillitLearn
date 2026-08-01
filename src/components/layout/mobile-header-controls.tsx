"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function MobileHeaderControls() {
  const pathname = usePathname();
  const router = useRouter();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS (iPhone, iPad, iPod)
    const userAgent = window.navigator.userAgent || "";
    const isIOSDevice = /iPhone|iPad|iPod/i.test(userAgent) || 
      (navigator.maxTouchPoints > 1 && /Macintosh/i.test(userAgent));
    setIsIOS(isIOSDevice);
  }, []);

  // Don't show back button on homepage
  const isHomepage = pathname === "/";
  if (isHomepage) return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`md:hidden inline-flex items-center gap-1 text-white bg-white/15 hover:bg-white/25
                 active:scale-95 px-3 py-1.5 rounded-full text-xs font-semibold 
                 transition-all mr-2.5 shadow-sm backdrop-blur-md ${isIOS ? "ring-1 ring-white/20" : ""}`}
      aria-label="Go back"
      title="Back"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span>Back</span>
    </button>
  );
}

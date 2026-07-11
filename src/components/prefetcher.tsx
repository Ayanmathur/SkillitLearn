"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Progressive Prefetcher — silently prefetches the next level of routes
 * in the background during browser idle time.
 *
 * Usage: Drop <Prefetcher urls={["/careers/software-engineering", ...]} />
 * on any page to warm those routes before the user clicks.
 *
 * Uses requestIdleCallback so prefetching never blocks the main thread
 * or competes with the current page's rendering.
 */
export function Prefetcher({ urls }: { urls: string[] }) {
  const router = useRouter();
  const prefetched = useRef(new Set<string>());

  useEffect(() => {
    if (!urls.length) return;

    // Use requestIdleCallback to prefetch without blocking UI
    const prefetchBatch = () => {
      const schedule =
        typeof window !== "undefined" && "requestIdleCallback" in window
          ? window.requestIdleCallback
          : (cb: () => void) => setTimeout(cb, 100);

      urls.forEach((url, index) => {
        if (prefetched.current.has(url)) return;

        schedule(() => {
          router.prefetch(url);
          prefetched.current.add(url);
        });
      });
    };

    // Small delay to let the current page finish rendering first
    const timer = setTimeout(prefetchBatch, 300);
    return () => clearTimeout(timer);
  }, [urls, router]);

  return null; // This component renders nothing
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Progressive Prefetcher — silently prefetches the next level of routes
 * in the background during browser idle time.
 *
 * THROTTLED: Only prefetches up to `maxPrefetch` URLs (default 6),
 * staggered 500ms apart, during idle time. This prevents a thundering
 * herd of 50+ simultaneous server requests.
 */
export function Prefetcher({
  urls,
  maxPrefetch = 6,
}: {
  urls: string[];
  maxPrefetch?: number;
}) {
  const router = useRouter();
  const prefetched = useRef(new Set<string>());

  useEffect(() => {
    if (!urls.length) return;

    // Only prefetch the first N urls to avoid server overload
    const batch = urls.slice(0, maxPrefetch);
    const timers: ReturnType<typeof setTimeout>[] = [];

    batch.forEach((url, index) => {
      if (prefetched.current.has(url)) return;

      // Stagger prefetches 500ms apart, starting after 500ms
      const timer = setTimeout(() => {
        router.prefetch(url);
        prefetched.current.add(url);
      }, 500 + index * 500);

      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [urls, router, maxPrefetch]);

  return null;
}

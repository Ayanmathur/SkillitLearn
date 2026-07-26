"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Progressive Prefetcher - silently loads pages in the background.
 *
 * When a career is chosen, this prefetches the ENTIRE tree
 * (paths + skills + quizzes) so every click within that career
 * is instant. Requests are staggered 200ms apart to avoid
 * overwhelming the server.
 */
export function Prefetcher({
  urls,
  maxPrefetch = 30,
}: {
  urls: string[];
  maxPrefetch?: number;
}) {
  const router = useRouter();
  const prefetched = useRef(new Set<string>());

  useEffect(() => {
    if (!urls.length) return;

    const batch = urls.slice(0, maxPrefetch);
    const timers: ReturnType<typeof setTimeout>[] = [];

    batch.forEach((url, index) => {
      if (prefetched.current.has(url)) return;

      // Stagger prefetches 200ms apart, starting after 300ms idle
      const timer = setTimeout(() => {
        router.prefetch(url);
        prefetched.current.add(url);
      }, 300 + index * 200);

      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [urls, router, maxPrefetch]);

  return null;
}

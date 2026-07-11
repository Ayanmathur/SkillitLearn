/**
 * Simple in-memory rate limiter for server actions.
 * In production, use Redis-backed rate limiting.
 *
 * Usage:
 *   const limiter = createRateLimiter({ maxRequests: 10, windowMs: 60000 });
 *   const allowed = limiter.check(ip);
 */

interface RateLimiterOptions {
  maxRequests: number; // Max requests per window
  windowMs: number;    // Window duration in ms
}

interface Entry {
  count: number;
  resetAt: number;
}

const stores = new Map<string, Map<string, Entry>>();

export function createRateLimiter(name: string, opts: RateLimiterOptions) {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  const store = stores.get(name)!;

  // Cleanup old entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      if (entry.resetAt < now) store.delete(key);
    });
  }, 300000);

  return {
    check(key: string): { allowed: boolean; remaining: number; retryAfterMs?: number } {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || entry.resetAt < now) {
        store.set(key, { count: 1, resetAt: now + opts.windowMs });
        return { allowed: true, remaining: opts.maxRequests - 1 };
      }

      if (entry.count >= opts.maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: entry.resetAt - now,
        };
      }

      entry.count++;
      return { allowed: true, remaining: opts.maxRequests - entry.count };
    },

    reset(key: string) {
      store.delete(key);
    },
  };
}

// Pre-configured limiters
export const verifyLimiter = createRateLimiter("verify", {
  maxRequests: 10,
  windowMs: 60 * 1000, // 10 requests per minute
});

export const certIssueLimiter = createRateLimiter("cert-issue", {
  maxRequests: 5,
  windowMs: 60 * 1000, // 5 per minute
});

export const uploadLimiter = createRateLimiter("upload", {
  maxRequests: 20,
  windowMs: 60 * 1000, // 20 per minute
});

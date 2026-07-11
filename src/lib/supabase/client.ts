import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 *
 * Used EXCLUSIVELY for Auth flows (login, signup, session management).
 * All database access goes through Prisma - never through this client.
 *
 * Only browser-safe env vars (NEXT_PUBLIC_) are used here.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

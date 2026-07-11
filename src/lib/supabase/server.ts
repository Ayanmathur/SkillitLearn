import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client.
 *
 * Used for:
 * - Auth session verification on the server
 * - Supabase Storage operations (signed URLs, uploads)
 *
 * NOT used for database queries - all DB access goes through Prisma.
 *
 * Has access to the service role key for admin Storage operations,
 * but defaults to the anon key for regular auth-scoped requests.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Server-side Supabase admin client (service role).
 *
 * Used ONLY for:
 * - Storage operations requiring elevated permissions (signed URLs for private buckets)
 * - Admin operations that bypass RLS
 *
 * NEVER expose this client or its key to the browser.
 */
export function createServiceRoleClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // Service role client does not manage cookies
        },
      },
    }
  );
}

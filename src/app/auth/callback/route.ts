import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Auth callback route.
 *
 * Handles:
 * 1. Email verification OTP confirmation
 * 2. Google OAuth redirect (exchanges code for session)
 *
 * After successful auth, ensures the user exists in our DB
 * (handles Google OAuth first-login where no signup created a DB record).
 *
 * IMPORTANT: Uses the request/response cookie pattern (not the shared
 * `createServerSupabaseClient` helper) because Route Handlers need to
 * write Set-Cookie headers on the *response* object - the `cookies()`
 * API from next/headers can silently fail to persist cookies in this context.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();

    // Build a response we can attach Set-Cookie headers to
    const response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure user exists in our DB (critical for Google OAuth first login)
      try {
        await prisma.user.upsert({
          where: { id: data.user.id },
          update: {
            email: data.user.email!,
            fullName:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              data.user.email!.split("@")[0],
          },
          create: {
            id: data.user.id,
            email: data.user.email!,
            fullName:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              data.user.email!.split("@")[0],
            role: "learner",
          },
        });
      } catch (dbError) {
        console.error("Failed to upsert user during OAuth callback:", dbError);
      }

      return response;
    }
  }

  // Auth failed - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}

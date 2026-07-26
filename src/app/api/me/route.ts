import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/me - returns the current user's profile (name + role).
 * Used by the client-side auth widget in the header.
 * Lightweight: only fetches 2 fields from the DB.
 */
export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ fullName: null, role: null }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { fullName: true, role: true },
  });

  return NextResponse.json({
    fullName: dbUser?.fullName || user.user_metadata?.full_name || user.email?.split("@")[0],
    role: dbUser?.role || "learner",
  });
}

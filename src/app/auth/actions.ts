"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { z } from "zod";

// ── Helpers ───────────────────────────────────────────────

function getSiteUrl() {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000");

  url = url.replace(/\/+$/, "");
  if (!url.startsWith("http")) url = `https://${url}`;
  return url;
}

// ── Validators ───────────────────────────────────────────────

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be at most 72 characters"),
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters")
    .trim(),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// ── Sign Up ──────────────────────────────────────────────────

export async function signUp(formData: FormData) {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password, fullName } = parsed.data;
  const supabase = await createServerSupabaseClient();

  // Create auth user in Supabase (triggers email OTP verification)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "An unexpected error occurred. Please try again." };
  }

  // Create corresponding user record in our DB
  try {
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: { email, fullName },
      create: {
        id: data.user.id,
        email,
        fullName,
        role: "learner",
      },
    });
  } catch (dbError) {
    console.error("Failed to create user record:", dbError);
  }

  return {
    success: true,
    message:
      "✉️ Check your email for a verification link. You must verify your email before logging in.",
  };
}

// ── Sign In ──────────────────────────────────────────────────

export async function signIn(formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Generic error to prevent user enumeration
    return { error: "Invalid email or password." };
  }

  if (!data.user) {
    return { error: "Invalid email or password." };
  }

  // Ensure user exists in our DB (handles edge case where auth
  // user exists but DB record was missed during signup)
  try {
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: { email: data.user.email! },
      create: {
        id: data.user.id,
        email: data.user.email!,
        fullName:
          data.user.user_metadata?.full_name ||
          data.user.email!.split("@")[0],
        role: "learner",
      },
    });
  } catch (dbError) {
    console.error("Failed to upsert user record:", dbError);
  }

  // Check if this is the admin user
  const dbUser = await prisma.user.findUnique({
    where: { id: data.user.id },
    select: { role: true },
  });

  // Redirect based on role
  if (
    dbUser?.role === "admin" ||
    dbUser?.role === "super_admin"
  ) {
    redirect("/admin");
  }

  redirect("/");
}

// ── Sign In with Google ──────────────────────────────────────

export async function signInWithGoogle() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

// ── Sign Out ─────────────────────────────────────────────────

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ── Get Current User (server-side, DB-verified) ──────────────
// CRITICAL: This always checks the DB for the authoritative role,
// never trusts the JWT/session alone.

export async function getCurrentUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Always fetch from DB - the single source of truth for role
  // We use Supabase JS instead of Prisma here to prevent heavy cold starts on every page load
  const { data: dbUser } = await supabase
    .from("users")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  if (!dbUser) {
    // Auth user exists but no DB record - create one (fallback to prisma for writes)
    const newUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        fullName:
          user.user_metadata?.full_name || user.email!.split("@")[0],
        role: "learner",
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });
    return newUser;
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    fullName: dbUser.full_name,
    role: dbUser.role,
  };
}

// ── Require Auth (helper for server actions) ─────────────────

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

// ── Require Role (helper for server actions) ─────────────────

export async function requireRole(
  allowedRoles: Array<"learner" | "instructor" | "admin" | "super_admin">
) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role as any)) {
    throw new Error("Insufficient permissions");
  }
  return user;
}

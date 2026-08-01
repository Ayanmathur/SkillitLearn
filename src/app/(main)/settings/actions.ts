"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUser, requireAuth } from "@/app/auth/actions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(fullName: string) {
  const user = await requireAuth();

  const cleanName = (fullName || "").trim();
  if (cleanName.length < 2) {
    return { error: "Name must be at least 2 characters long." };
  }

  try {
    const supabase = await createServerSupabaseClient();

    // Update Supabase auth metadata
    await supabase.auth.updateUser({
      data: { full_name: cleanName },
    }).catch((e) => console.warn("Auth metadata update warning:", e));

    // Update Users DB record with upsert fallback
    await prisma.user.upsert({
      where: { id: user.id },
      update: { fullName: cleanName },
      create: {
        id: user.id,
        email: user.email,
        fullName: cleanName,
        role: "learner",
      },
    }).catch((e) => console.warn("Prisma user upsert warning:", e));

    revalidatePath("/settings");
    revalidatePath("/certificates");
    return { success: true, message: "Profile updated successfully!" };
  } catch (err: any) {
    return { error: err?.message || "Failed to update profile." };
  }
}

export async function updatePassword(password: string) {
  await requireAuth();

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return { error: error.message };
    }

    return { success: true, message: "Password updated successfully!" };
  } catch (err: any) {
    return { error: err?.message || "Failed to update password." };
  }
}

export async function deleteAccount() {
  const user = await requireAuth();

  // Delete from DB first
  try {
    await prisma.user.delete({
      where: { id: user.id },
    }).catch((e) => console.warn("Prisma user delete warning:", e));
  } catch (err) {
    console.error("Error deleting DB user record:", err);
  }

  // Delete from Supabase Auth admin schema
  try {
    const { createServiceRoleClient } = await import("@/lib/supabase/server");
    const adminSupabase = createServiceRoleClient();
    await adminSupabase.auth.admin.deleteUser(user.id);
  } catch (authErr) {
    console.error("Error deleting Auth user record:", authErr);
  }

  // Sign out user session
  try {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  } catch (e) {
    console.warn("SignOut warning:", e);
  }

  return { success: true };
}

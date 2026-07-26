"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUser, requireAuth } from "@/app/auth/actions";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(fullName: string) {
  const user = await requireAuth();

  if (!fullName || fullName.trim().length < 2) {
    return { error: "Name must be at least 2 characters long." };
  }

  const supabase = await createServerSupabaseClient();

  // Update Supabase auth metadata
  await supabase.auth.updateUser({
    data: { full_name: fullName.trim() },
  });

  // Update Users DB record
  await prisma.user.update({
    where: { id: user.id },
    data: { fullName: fullName.trim() },
  });

  revalidatePath("/settings");
  revalidatePath("/certificates");
  return { success: true, message: "Profile updated successfully!" };
}

export async function updatePassword(password: string) {
  await requireAuth();

  if (!password || password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: "Password updated successfully!" };
}

export async function deleteAccount() {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  // Delete from DB first
  try {
    await prisma.user.delete({
      where: { id: user.id },
    });
  } catch (err) {
    console.error("Error deleting DB user record:", err);
  }

  // Sign out user session
  await supabase.auth.signOut();
  return { success: true };
}

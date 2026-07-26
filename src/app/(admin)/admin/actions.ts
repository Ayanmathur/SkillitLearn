"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const updateRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["learner", "instructor", "admin", "super_admin"]),
});

/**
 * Admin action: promote/demote a user's role.
 *
 * Server-side role check: only admin/super_admin can call this.
 * Additionally, only super_admin can promote to admin/super_admin.
 */
export async function updateUserRole(formData: FormData) {
  // Re-check role from DB - never trust client
  const currentUser = await requireRole(["admin", "super_admin"]);

  const parsed = updateRoleSchema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { userId, role } = parsed.data;

  // Only super_admin can promote to admin or super_admin
  if (
    (role === "admin" || role === "super_admin") &&
    currentUser.role !== "super_admin"
  ) {
    return { error: "Only super admins can promote users to admin roles." };
  }

  // Cannot change own role (safety)
  if (userId === currentUser.id) {
    return { error: "You cannot change your own role." };
  }

  // Update role
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      actorUserId: currentUser.id,
      action: "role_change",
      targetTable: "users",
      targetId: userId,
      metadataJson: { newRole: role },
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

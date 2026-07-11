"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// ── Validators ──────────────────────────────────────────
const createCareerSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  description: z.string().min(10).max(2000),
  iconUrl: z.string().optional(),
});

const updateCareerSchema = createCareerSchema.extend({
  id: z.string().uuid(),
});

// ── Create ──────────────────────────────────────────────
export async function createCareer(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = createCareerSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    iconUrl: formData.get("iconUrl") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    const career = await prisma.career.create({
      data: { ...parsed.data, createdBy: user.id },
    });
    await prisma.auditLog.create({
      data: { actorUserId: user.id, action: "create", targetTable: "careers", targetId: career.id, metadataJson: { name: career.name } },
    });
    revalidatePath("/admin/careers");
    return { success: true, id: career.id };
  } catch (e: any) {
    if (e.code === "P2002") return { error: "A career with this slug already exists." };
    return { error: "Failed to create career." };
  }
}

// ── Update ──────────────────────────────────────────────
export async function updateCareer(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = updateCareerSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    iconUrl: formData.get("iconUrl") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { id, ...data } = parsed.data;
  await prisma.career.update({ where: { id }, data });
  await prisma.auditLog.create({
    data: { actorUserId: user.id, action: "update", targetTable: "careers", targetId: id, metadataJson: { name: data.name } },
  });
  revalidatePath("/admin/careers");
  revalidatePath(`/admin/careers/${id}`);
  return { success: true };
}

// ── Delete ──────────────────────────────────────────────
export async function deleteCareer(id: string) {
  const user = await requireRole(["admin", "super_admin"]);
  z.string().uuid().parse(id);

  const pathCount = await prisma.path.count({ where: { careerId: id } });
  if (pathCount > 0) return { error: `Cannot delete - ${pathCount} paths still exist under this career. Delete them first.` };

  await prisma.career.delete({ where: { id } });
  await prisma.auditLog.create({
    data: { actorUserId: user.id, action: "delete", targetTable: "careers", targetId: id },
  });
  revalidatePath("/admin/careers");
  return { success: true };
}

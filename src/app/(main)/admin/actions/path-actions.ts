"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createPathSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().min(5).max(2000),
  careerId: z.string().uuid(),
});
const updatePathSchema = createPathSchema.extend({ id: z.string().uuid() });

export async function createPath(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = createPathSchema.safeParse({
    name: formData.get("name"), slug: formData.get("slug"),
    description: formData.get("description"), careerId: formData.get("careerId"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const maxOrder = await prisma.path.aggregate({ where: { careerId: parsed.data.careerId }, _max: { orderIndex: true } });
  const career = await prisma.career.findUnique({ where: { id: parsed.data.careerId }, select: { id: true } });
  if (!career) return { error: "Career not found." };

  try {
    const path = await prisma.path.create({ data: { ...parsed.data, orderIndex: (maxOrder._max.orderIndex ?? -1) + 1 } });
    await prisma.auditLog.create({ data: { actorUserId: user.id, action: "create", targetTable: "paths", targetId: path.id, metadataJson: { name: path.name } } });
    revalidatePath(`/admin/careers/${parsed.data.careerId}`);
    return { success: true, id: path.id };
  } catch (e: any) {
    if (e.code === "P2002") return { error: "A path with this slug already exists." };
    return { error: "Failed to create path." };
  }
}

export async function updatePath(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = updatePathSchema.safeParse({
    id: formData.get("id"), name: formData.get("name"), slug: formData.get("slug"),
    description: formData.get("description"), careerId: formData.get("careerId"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, ...data } = parsed.data;
  await prisma.path.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "update", targetTable: "paths", targetId: id, metadataJson: { name: data.name } } });
  revalidatePath(`/admin/careers/${data.careerId}`);
  return { success: true };
}

export async function deletePath(id: string) {
  const user = await requireRole(["admin", "super_admin"]);
  z.string().uuid().parse(id);
  const skillCount = await prisma.skill.count({ where: { pathId: id } });
  if (skillCount > 0) return { error: `Cannot delete - ${skillCount} skills exist. Delete them first.` };
  const path = await prisma.path.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "delete", targetTable: "paths", targetId: id } });
  revalidatePath(`/admin/careers/${path.careerId}`);
  return { success: true };
}

"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createSkillSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().min(5).max(2000),
  pathId: z.string().uuid(),
  estimatedHours: z.coerce.number().int().min(1).max(500),
});
const updateSkillSchema = createSkillSchema.extend({ id: z.string().uuid() });

export async function createSkill(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = createSkillSchema.safeParse({
    name: formData.get("name"), slug: formData.get("slug"),
    description: formData.get("description"), pathId: formData.get("pathId"),
    estimatedHours: formData.get("estimatedHours"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const maxOrder = await prisma.skill.aggregate({ where: { pathId: parsed.data.pathId }, _max: { orderIndex: true } });
  try {
    const skill = await prisma.skill.create({ data: { ...parsed.data, orderIndex: (maxOrder._max.orderIndex ?? -1) + 1 } });
    await prisma.auditLog.create({ data: { actorUserId: user.id, action: "create", targetTable: "skills", targetId: skill.id, metadataJson: { name: skill.name } } });
    revalidatePath(`/admin/paths/${parsed.data.pathId}`);
    return { success: true, id: skill.id };
  } catch (e: any) {
    if (e.code === "P2002") return { error: "A skill with this slug already exists." };
    return { error: "Failed to create skill." };
  }
}

export async function updateSkill(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = updateSkillSchema.safeParse({
    id: formData.get("id"), name: formData.get("name"), slug: formData.get("slug"),
    description: formData.get("description"), pathId: formData.get("pathId"),
    estimatedHours: formData.get("estimatedHours"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, ...data } = parsed.data;
  await prisma.skill.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "update", targetTable: "skills", targetId: id } });
  revalidatePath(`/admin/paths/${data.pathId}`);
  return { success: true };
}

export async function deleteSkill(id: string) {
  const user = await requireRole(["admin", "super_admin"]);
  z.string().uuid().parse(id);
  const modCount = await prisma.track.count({ where: { skillId: id } });
  if (modCount > 0) return { error: `Cannot delete - ${modCount} tracks exist. Delete them first.` };
  const skill = await prisma.skill.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "delete", targetTable: "skills", targetId: id } });
  revalidatePath(`/admin/paths/${skill.pathId}`);
  return { success: true };
}

"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createModuleSchema = z.object({ title: z.string().min(2).max(300), skillId: z.string().uuid() });
const updateModuleSchema = createModuleSchema.extend({ id: z.string().uuid() });
const createStepSchema = z.object({ title: z.string().min(2).max(300), content: z.string().max(50000), moduleId: z.string().uuid() });
const updateStepSchema = createStepSchema.extend({ id: z.string().uuid() });

export async function createModule(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = createModuleSchema.safeParse({ title: formData.get("title"), skillId: formData.get("skillId") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const maxOrder = await prisma.module.aggregate({ where: { skillId: parsed.data.skillId }, _max: { orderIndex: true } });
  const mod = await prisma.module.create({ data: { ...parsed.data, orderIndex: (maxOrder._max.orderIndex ?? -1) + 1 } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "create", targetTable: "modules", targetId: mod.id } });
  revalidatePath(`/admin/skills/${parsed.data.skillId}`);
  return { success: true, id: mod.id };
}

export async function updateModule(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = updateModuleSchema.safeParse({ id: formData.get("id"), title: formData.get("title"), skillId: formData.get("skillId") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, ...data } = parsed.data;
  await prisma.module.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "update", targetTable: "modules", targetId: id } });
  revalidatePath(`/admin/skills/${data.skillId}`);
  return { success: true };
}

export async function deleteModule(id: string) {
  const user = await requireRole(["admin", "super_admin"]);
  z.string().uuid().parse(id);
  const stepCount = await prisma.step.count({ where: { moduleId: id } });
  if (stepCount > 0) return { error: `Cannot delete - ${stepCount} steps exist. Delete them first.` };
  const mod = await prisma.module.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "delete", targetTable: "modules", targetId: id } });
  revalidatePath(`/admin/skills/${mod.skillId}`);
  return { success: true };
}

export async function createStep(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = createStepSchema.safeParse({ title: formData.get("title"), content: formData.get("content"), moduleId: formData.get("moduleId") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const maxOrder = await prisma.step.aggregate({ where: { moduleId: parsed.data.moduleId }, _max: { orderIndex: true } });
  const step = await prisma.step.create({ data: { ...parsed.data, orderIndex: (maxOrder._max.orderIndex ?? -1) + 1 } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "create", targetTable: "steps", targetId: step.id } });
  revalidatePath(`/admin/modules/${parsed.data.moduleId}`);
  return { success: true, id: step.id };
}

export async function updateStep(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = updateStepSchema.safeParse({ id: formData.get("id"), title: formData.get("title"), content: formData.get("content"), moduleId: formData.get("moduleId") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, ...data } = parsed.data;
  await prisma.step.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "update", targetTable: "steps", targetId: id } });
  revalidatePath(`/admin/modules/${data.moduleId}`);
  return { success: true };
}

export async function deleteStep(id: string) {
  const user = await requireRole(["admin", "super_admin"]);
  z.string().uuid().parse(id);
  await prisma.step.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "delete", targetTable: "steps", targetId: id } });
  return { success: true };
}

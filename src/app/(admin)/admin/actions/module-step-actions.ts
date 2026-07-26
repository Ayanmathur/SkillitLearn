"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createModuleSchema = z.object({ title: z.string().min(2).max(300), skillId: z.string().uuid() });
const updateModuleSchema = createModuleSchema.extend({ id: z.string().uuid() });
const createStepSchema = z.object({ title: z.string().min(2).max(300), content: z.string().max(50000), trackId: z.string().uuid() });
const updateStepSchema = createStepSchema.extend({ id: z.string().uuid() });

export async function createModule(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = createModuleSchema.safeParse({ title: formData.get("title"), skillId: formData.get("skillId") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const maxOrder = await prisma.track.aggregate({ where: { skillId: parsed.data.skillId }, _max: { orderIndex: true } });
  const mod = await prisma.track.create({ data: { ...parsed.data, orderIndex: (maxOrder._max.orderIndex ?? -1) + 1 } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "create", targetTable: "tracks", targetId: mod.id } });
  revalidatePath(`/admin/skills/${parsed.data.skillId}`);
  return { success: true, id: mod.id };
}

export async function updateModule(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = updateModuleSchema.safeParse({ id: formData.get("id"), title: formData.get("title"), skillId: formData.get("skillId") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, ...data } = parsed.data;
  await prisma.track.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "update", targetTable: "tracks", targetId: id } });
  revalidatePath(`/admin/skills/${data.skillId}`);
  return { success: true };
}

export async function deleteModule(id: string) {
  const user = await requireRole(["admin", "super_admin"]);
  z.string().uuid().parse(id);
  const stepCount = await prisma.step.count({ where: { trackId: id } });
  if (stepCount > 0) return { error: `Cannot delete - ${stepCount} steps exist. Delete them first.` };
  const mod = await prisma.track.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "delete", targetTable: "tracks", targetId: id } });
  revalidatePath(`/admin/skills/${mod.skillId}`);
  return { success: true };
}

export async function createStep(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = createStepSchema.safeParse({ title: formData.get("title"), content: formData.get("content"), trackId: formData.get("trackId") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const maxOrder = await prisma.step.aggregate({ where: { trackId: parsed.data.trackId }, _max: { orderIndex: true } });
  const step = await prisma.step.create({ data: { ...parsed.data, orderIndex: (maxOrder._max.orderIndex ?? -1) + 1 } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "create", targetTable: "steps", targetId: step.id } });
  revalidatePath(`/admin/tracks/${parsed.data.trackId}`);
  return { success: true, id: step.id };
}

export async function updateStep(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const parsed = updateStepSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    content: formData.get("content"),
    trackId: formData.get("trackId"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, ...data } = parsed.data;
  await prisma.step.update({ where: { id }, data });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "update", targetTable: "steps", targetId: id } });
  revalidatePath(`/admin/tracks/${data.trackId}`);
  return { success: true };
}

export async function deleteStep(id: string) {
  const user = await requireRole(["admin", "super_admin"]);
  z.string().uuid().parse(id);
  await prisma.step.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "delete", targetTable: "steps", targetId: id } });
  return { success: true };
}

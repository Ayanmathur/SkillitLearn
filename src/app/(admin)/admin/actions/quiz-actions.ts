"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const choiceSchema = z.object({ id: z.string(), text: z.string().min(1) });
const createQuestionSchema = z.object({
  skillId: z.string().uuid(),
  questionText: z.string().min(10).max(1000),
  choicesJson: z.array(choiceSchema).length(4),
  correctChoiceId: z.string(),
  explanation: z.string().min(5).max(2000),
});
const updateQuestionSchema = createQuestionSchema.extend({ id: z.string().uuid() });

export async function createQuestion(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const data = JSON.parse(formData.get("data") as string);
  const parsed = createQuestionSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Validate correctChoiceId is one of the choice IDs
  const choiceIds = parsed.data.choicesJson.map((c) => c.id);
  if (!choiceIds.includes(parsed.data.correctChoiceId)) {
    return { error: "Correct choice must be one of the 4 options." };
  }

  const maxOrder = await prisma.quizQuestion.aggregate({ where: { skillId: parsed.data.skillId }, _max: { orderIndex: true } });
  const q = await prisma.quizQuestion.create({
    data: { ...parsed.data, orderIndex: (maxOrder._max.orderIndex ?? -1) + 1 },
  });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "create", targetTable: "quiz_questions", targetId: q.id } });
  revalidatePath(`/admin/skills/${parsed.data.skillId}`);
  return { success: true, id: q.id };
}

export async function updateQuestion(formData: FormData) {
  const user = await requireRole(["admin", "super_admin"]);
  const data = JSON.parse(formData.get("data") as string);
  const parsed = updateQuestionSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const choiceIds = parsed.data.choicesJson.map((c) => c.id);
  if (!choiceIds.includes(parsed.data.correctChoiceId)) {
    return { error: "Correct choice must be one of the 4 options." };
  }

  const { id, ...rest } = parsed.data;
  await prisma.quizQuestion.update({ where: { id }, data: rest });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "update", targetTable: "quiz_questions", targetId: id } });
  revalidatePath(`/admin/skills/${rest.skillId}`);
  return { success: true };
}

export async function deleteQuestion(id: string) {
  const user = await requireRole(["admin", "super_admin"]);
  z.string().uuid().parse(id);
  await prisma.quizQuestion.delete({ where: { id } });
  await prisma.auditLog.create({ data: { actorUserId: user.id, action: "delete", targetTable: "quiz_questions", targetId: id } });
  return { success: true };
}

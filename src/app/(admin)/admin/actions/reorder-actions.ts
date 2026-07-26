"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/app/auth/actions";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const reorderSchema = z.object({
  table: z.enum(["paths", "skills", "tracks", "steps", "quizQuestions"]),
  items: z.array(z.object({ id: z.string().uuid(), orderIndex: z.number().int().min(0) })),
});

/**
 * Generic reorder action for drag-and-drop.
 * Updates order_index for multiple items in a single table.
 */
export async function reorderItems(data: { table: string; items: Array<{ id: string; orderIndex: number }> }) {
  await requireRole(["admin", "super_admin"]);
  const parsed = reorderSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { table, items } = parsed.data;

  // Map table name to Prisma model
  const modelMap: Record<string, any> = {
    paths: prisma.path,
    skills: prisma.skill,
    tracks: prisma.track,
    steps: prisma.step,
    quizQuestions: prisma.quizQuestion,
  };

  const model = modelMap[table];
  if (!model) return { error: "Invalid table." };

  // Update all order indices in a transaction
  await prisma.$transaction(
    items.map((item) =>
      model.update({
        where: { id: item.id },
        data: { orderIndex: item.orderIndex },
      })
    )
  );

  revalidatePath("/admin");
  return { success: true };
}

"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/app/auth/actions";
import { z } from "zod";

const submitQuizSchema = z.object({
  skillId: z.string().uuid(),
  answers: z.record(z.string().uuid(), z.string()), // questionId -> choiceId
});

/**
 * Fetch 5 random quiz questions for a skill.
 *
 * CRITICAL: Never sends correct_choice_id to the client.
 * Only returns question text, choices (without marking correct), and IDs.
 */
export async function getQuizQuestions(skillId: string) {
  const user = await requireAuth();

  // Verify all steps are completed for this skill
  const skill = await prisma.skill.findUnique({
    where: { id: skillId },
    include: {
      modules: {
        include: {
          steps: { select: { id: true } },
        },
      },
    },
  });

  if (!skill) throw new Error("Skill not found");

  const allStepIds = skill.modules.flatMap((m) =>
    m.steps.map((s) => s.id)
  );

  // Check step completion
  const completedSteps = await prisma.learnerProgress.count({
    where: {
      userId: user.id,
      stepId: { in: allStepIds },
    },
  });

  const allStepsComplete = completedSteps >= allStepIds.length;

  // If no steps exist for this skill (data not yet seeded), allow quiz
  // Otherwise require all steps to be completed
  if (allStepIds.length > 0 && !allStepsComplete) {
    return {
      error: "complete_steps_first",
      completed: completedSteps,
      total: allStepIds.length,
    };
  }

  // Fetch all questions for this skill and pick 5 at random
  const allQuestions = await prisma.quizQuestion.findMany({
    where: { skillId },
    select: {
      id: true,
      questionText: true,
      choicesJson: true,
      // NOTE: correctChoiceId is NOT selected - never sent to client
      orderIndex: true,
    },
  });

  if (allQuestions.length < 5) {
    return { error: "not_enough_questions", count: allQuestions.length };
  }

  // Fisher-Yates shuffle and take 5
  const shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, 5).map((q) => ({
    id: q.id,
    questionText: q.questionText,
    choices: q.choicesJson as Array<{ id: string; text: string }>,
  }));

  return { questions: selected, skillId };
}

/**
 * Grade a quiz submission. Server-side only.
 *
 * - Checks answers against correct_choice_id from DB
 * - Pass threshold: 80% (4/5)
 * - Creates quiz_attempts row
 * - On pass: updates skill_completion.quiz_passed = true
 */
export async function submitQuiz(data: {
  skillId: string;
  answers: Record<string, string>;
}) {
  const user = await requireAuth();

  const parsed = submitQuizSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { skillId, answers } = parsed.data;
  const questionIds = Object.keys(answers);

  if (questionIds.length !== 5) {
    return { error: "Please answer all 5 questions." };
  }

  // Fetch the correct answers from DB
  const questions = await prisma.quizQuestion.findMany({
    where: { id: { in: questionIds }, skillId },
    select: {
      id: true,
      questionText: true,
      choicesJson: true,
      correctChoiceId: true,
      explanation: true,
    },
  });

  if (questions.length !== 5) {
    return { error: "Invalid quiz submission - question mismatch." };
  }

  // Grade
  let score = 0;
  const results = questions.map((q) => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctChoiceId;
    if (isCorrect) score++;

    return {
      questionId: q.id,
      questionText: q.questionText,
      choices: q.choicesJson as Array<{ id: string; text: string }>,
      userAnswer,
      correctAnswer: q.correctChoiceId,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const passed = score >= 4; // 80% threshold = 4/5

  // Insert quiz attempt
  await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      skillId,
      score,
      passed,
      answersJson: answers,
    },
  });

  // If passed, update skill_completion
  if (passed) {
    // Check if all steps are completed too
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
      include: {
        modules: { include: { steps: { select: { id: true } } } },
      },
    });

    const allStepIds = skill?.modules.flatMap((m) =>
      m.steps.map((s) => s.id)
    ) || [];

    const completedSteps = await prisma.learnerProgress.count({
      where: { userId: user.id, stepId: { in: allStepIds } },
    });

    const stepsCompleted = allStepIds.length === 0 || completedSteps >= allStepIds.length;

    await prisma.skillCompletion.upsert({
      where: {
        userId_skillId: { userId: user.id, skillId },
      },
      update: {
        quizPassed: true,
        stepsCompleted,
        completedAt: stepsCompleted ? new Date() : null,
      },
      create: {
        userId: user.id,
        skillId,
        quizPassed: true,
        stepsCompleted,
        completedAt: stepsCompleted ? new Date() : null,
      },
    });
  }

  return { score, passed, results, total: 5 };
}

/**
 * Mark a step as completed for the current user.
 */
export async function markStepComplete(stepId: string) {
  const user = await requireAuth();

  // Check step exists
  const step = await prisma.step.findUnique({
    where: { id: stepId },
    select: { id: true },
  });
  if (!step) return { error: "Step not found" };

  // Upsert (idempotent)
  await prisma.learnerProgress.upsert({
    where: {
      userId_stepId: { userId: user.id, stepId },
    },
    update: {},
    create: {
      userId: user.id,
      stepId,
    },
  });

  return { success: true };
}

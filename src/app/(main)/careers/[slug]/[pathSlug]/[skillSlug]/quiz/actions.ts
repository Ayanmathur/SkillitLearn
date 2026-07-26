"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentUser, requireAuth } from "@/app/auth/actions";
import { getQuizForSkill } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const submitQuizSchema = z.object({
  skillId: z.string().uuid(),
  answers: z.record(z.string().uuid(), z.number()), // questionId -> selectedOptionIndex
});

/**
 * Fetch 15 random quiz questions for a skill:
 * 5 Easy, 5 Moderate, 5 Difficult.
 *
 * CRITICAL: Never sends correct_option_index to the client.
 */
export async function getQuizQuestionsBySlug(skillSlug: string) {
  const user = await requireAuth();

  const quizData = await getQuizForSkill(skillSlug);

  if (!quizData || !quizData.questions || quizData.questions.length === 0) {
    return { error: "no_questions_found" };
  }

  // Sanitize questions - omit correctOptionIndex from payload sent to client
  const clientQuestions = quizData.questions.map((q: any) => ({
    id: q.id,
    questionText: q.questionText,
    choices: q.options.map((optText: string, idx: number) => ({
      id: String(idx),
      text: optText,
    })),
    difficulty: q.difficulty,
  }));

  return {
    skillId: quizData.skill.id,
    skillName: quizData.skill.name,
    questions: clientQuestions,
  };
}

/**
 * Grade a 15-question quiz submission.
 * - Checks answers against correct_option_index from DB
 * - Passing threshold: 10 / 15 correct (66% / 10 required)
 * - Records quiz_attempts row
 * - On pass: updates skill completion
 */
export async function submitQuiz(data: {
  skillId: string;
  answers: Record<string, number>;
}) {
  const user = await requireAuth();
  const supabase = await createServerSupabaseClient();

  const parsed = submitQuizSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { skillId, answers } = parsed.data;
  const questionIds = Object.keys(answers);

  if (questionIds.length < 1) {
    return { error: "Please answer the quiz questions." };
  }

  // Fetch true correct answers from DB
  const { data: questions, error: qErr } = await supabase
    .from("quiz_questions")
    .select("id, question_text, options, correct_option_index, explanation, difficulty")
    .in("id", questionIds)
    .eq("skill_id", skillId);

  if (qErr || !questions) {
    return { error: "Failed to grade quiz submission." };
  }

  let score = 0;
  const total = questions.length;

  const results = questions.map((q: any) => {
    const userChoiceIdx = answers[q.id];
    const isCorrect = userChoiceIdx === q.correct_option_index;
    if (isCorrect) score++;

    return {
      questionId: q.id,
      questionText: q.question_text,
      choices: (q.options || []).map((optText: string, idx: number) => ({
        id: String(idx),
        text: optText,
      })),
      userAnswer: String(userChoiceIdx),
      correctAnswer: String(q.correct_option_index),
      isCorrect,
      explanation: q.explanation,
      difficulty: q.difficulty,
    };
  });

  // Passing criteria: 10 out of 15 correct (>= 10 or >= 66%)
  const passed = score >= 10 || (total < 15 && score / total >= 0.66);

  // Record quiz attempt via Prisma (reliable DB connection)
  try {
    await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        skillId: skillId,
        score: score,
        passed: passed,
        answersJson: answers,
      },
    });
  } catch (e) {
    console.error("Quiz attempt record error:", e);
  }

  if (passed) {
    try {
      await prisma.skillCompletion.upsert({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: skillId,
          },
        },
        update: {
          quizPassed: true,
          completedAt: new Date(),
        },
        create: {
          userId: user.id,
          skillId: skillId,
          quizPassed: true,
          completedAt: new Date(),
        },
      });
    } catch (e) {
      console.error("Skill completion record error:", e);
    }
  }

  return { score, total, passed, results };
}

/**
 * Mark step complete (helper)
 */
export async function markStepComplete(stepId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "not_authenticated" };
    }

    await prisma.learnerProgress.upsert({
      where: {
        userId_stepId: {
          userId: user.id,
          stepId: stepId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        stepId: stepId,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("markStepComplete error:", error?.message || error);
    return { error: error?.message || "Failed to mark step complete" };
  }
}

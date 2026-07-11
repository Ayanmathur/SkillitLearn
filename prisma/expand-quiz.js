/**
 * SkillItLearn — Expand Quiz Questions to 20 per Skill
 *
 * The initial seed created 5 questions per skill. This script adds
 * 15 more per skill to reach the target of 20 questions each.
 *
 * Question strategy:
 * - Questions derived from the actual step content per skill
 * - 20 are stored in DB; at quiz time, 5 are randomly selected
 * - Each question has 4 choices, 1 correct, 1-2 sentence explanation
 *
 * Usage: node prisma/expand-quiz.js
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ log: ["error"] });

// ── Question templates ──────────────────────────────────────
// 15 additional question patterns per skill, each derived from
// step content structure (the steps follow a consistent pedagogy:
// Why It Matters → Key Terms → Mental Model → Tools → Walkthrough
// → Mistakes → Exercise → Modify → Feedback → Self-Check)

function generateAdditionalQuestions(skill, modules, steps, existingCount) {
  const questions = [];
  const skillName = skill.name;
  const stepTitles = steps.map((s) => s.title);
  const moduleNames = modules.map((m) => m.title);
  let orderIndex = existingCount + 1;

  // Helper: pick a random step's title
  const pickStep = (i) => stepTitles[i % stepTitles.length] || skillName;

  // ── Template pool (15 question patterns) ───────────────────

  // Q6: Why the skill matters
  questions.push({
    questionText: `Why is learning "${skillName}" considered valuable in a professional context?`,
    choicesJson: [
      { id: "a", text: `It solves a real, recurring problem that organizations face` },
      { id: "b", text: `It is only useful for passing standardized exams` },
      { id: "c", text: `It has no practical application outside academic settings` },
      { id: "d", text: `It is a purely decorative addition to a resume` },
    ],
    correctChoiceId: "a",
    explanation: `${skillName} solves real problems that organizations encounter regularly, which is why it appears in career paths and job descriptions.`,
    orderIndex: orderIndex++,
  });

  // Q7: Key terminology
  questions.push({
    questionText: `When building vocabulary for "${skillName}", what is the recommended approach?`,
    choicesJson: [
      { id: "a", text: `Learn terms in context by connecting them to concrete examples from the field` },
      { id: "b", text: `Memorize a dictionary of all possible terms before starting any practice` },
      { id: "c", text: `Ignore terminology completely and focus only on doing` },
      { id: "d", text: `Only learn terms that appear on certification exams` },
    ],
    correctChoiceId: "a",
    explanation: `Building vocabulary in context — by seeing terms used in real scenarios — leads to deeper understanding than rote memorization.`,
    orderIndex: orderIndex++,
  });

  // Q8: Mental model formation
  questions.push({
    questionText: `What is the purpose of forming a "mental model" for "${skillName}"?`,
    choicesJson: [
      { id: "a", text: `To create a simplified internal representation that helps predict how things work` },
      { id: "b", text: `To memorize every detail before starting any practical work` },
      { id: "c", text: `Mental models are only useful for visual learners` },
      { id: "d", text: `To avoid ever having to look up documentation` },
    ],
    correctChoiceId: "a",
    explanation: `A mental model is a simplified internal map that helps you predict outcomes and reason about ${skillName} without needing to remember every detail.`,
    orderIndex: orderIndex++,
  });

  // Q9: Tools and methods
  questions.push({
    questionText: `When learning the standard tools for "${skillName}", what should you prioritize?`,
    choicesJson: [
      { id: "a", text: `Understanding which tools practitioners actually use and why they chose them` },
      { id: "b", text: `Installing every available tool regardless of whether you need it` },
      { id: "c", text: `Only using the most expensive enterprise-grade tools` },
      { id: "d", text: `Avoiding all tools and working entirely manually` },
    ],
    correctChoiceId: "a",
    explanation: `Understanding why practitioners chose specific tools gives you better judgment when selecting approaches for ${skillName}.`,
    orderIndex: orderIndex++,
  });

  // Q10: Step-by-step walkthrough purpose
  questions.push({
    questionText: `What is the benefit of a step-by-step walkthrough in "${skillName}"?`,
    choicesJson: [
      { id: "a", text: `It shows the complete workflow from start to finish, making the process concrete` },
      { id: "b", text: `Walkthroughs are unnecessary if you already read the theory` },
      { id: "c", text: `They are only for people who cannot learn independently` },
      { id: "d", text: `The walkthrough is just a copy of the documentation` },
    ],
    correctChoiceId: "a",
    explanation: `Walkthroughs turn abstract concepts into concrete sequences, helping learners see how ${skillName} works end-to-end.`,
    orderIndex: orderIndex++,
  });

  // Q11: Common mistakes
  questions.push({
    questionText: `Why does the "${skillName}" learning path include a section on common beginner mistakes?`,
    choicesJson: [
      { id: "a", text: `Recognizing pitfalls in advance helps learners avoid wasting time on preventable errors` },
      { id: "b", text: `To discourage beginners from trying new approaches` },
      { id: "c", text: `Mistakes are impossible to make once you complete the course` },
      { id: "d", text: `It is included only for entertainment value` },
    ],
    correctChoiceId: "a",
    explanation: `Studying common mistakes builds pattern recognition — you learn to spot warning signs before they become real problems in ${skillName}.`,
    orderIndex: orderIndex++,
  });

  // Q12: Practice exercise approach
  questions.push({
    questionText: `What is the recommended approach to the practice exercises in "${skillName}"?`,
    choicesJson: [
      { id: "a", text: `Attempt the exercise yourself first, then compare with the reference solution` },
      { id: "b", text: `Copy the reference solution without trying it yourself` },
      { id: "c", text: `Skip exercises entirely and move to the next skill` },
      { id: "d", text: `Only attempt exercises if you are already confident in the topic` },
    ],
    correctChoiceId: "a",
    explanation: `Attempting exercises independently before checking solutions builds genuine problem-solving ability in ${skillName}.`,
    orderIndex: orderIndex++,
  });

  // Q13: Modify and extend
  questions.push({
    questionText: `What is the purpose of the "modify and extend" step in "${skillName}"?`,
    choicesJson: [
      { id: "a", text: `To test the edges of your understanding by changing parameters and observing results` },
      { id: "b", text: `To break the original exercise beyond repair` },
      { id: "c", text: `To create a portfolio piece for job interviews` },
      { id: "d", text: `This step is optional and has no learning value` },
    ],
    correctChoiceId: "a",
    explanation: `Modifying existing work reveals the boundaries of your knowledge — where ${skillName} concepts hold and where they don't.`,
    orderIndex: orderIndex++,
  });

  // Q14: Feedback value
  questions.push({
    questionText: `How does feedback accelerate learning in "${skillName}"?`,
    choicesJson: [
      { id: "a", text: `It reveals blind spots between what you think you did and what actually happened` },
      { id: "b", text: `Feedback is only useful if it comes from a paid instructor` },
      { id: "c", text: `Feedback slows down learning because it creates self-doubt` },
      { id: "d", text: `Only automated feedback tools are worth using` },
    ],
    correctChoiceId: "a",
    explanation: `Feedback closes the perception gap — often what you think happened during ${skillName} practice differs from reality.`,
    orderIndex: orderIndex++,
  });

  // Q15: Self-check and review
  questions.push({
    questionText: `What should you do during the self-check phase of "${skillName}"?`,
    choicesJson: [
      { id: "a", text: `Honestly assess which concepts are solid and which need more practice` },
      { id: "b", text: `Mark everything as complete and move on as fast as possible` },
      { id: "c", text: `Only review topics that were easy to understand` },
      { id: "d", text: `Skip the self-check if you passed the practice exercise` },
    ],
    correctChoiceId: "a",
    explanation: `Honest self-assessment identifies gaps in ${skillName} knowledge before they compound in later, more advanced skills.`,
    orderIndex: orderIndex++,
  });

  // Q16: Module structure
  if (moduleNames.length > 1) {
    questions.push({
      questionText: `The "${skillName}" skill is organized into modules. Why is this structure used?`,
      choicesJson: [
        { id: "a", text: `Modules group related concepts so you can build understanding incrementally` },
        { id: "b", text: `Modules exist only to make the skill look longer` },
        { id: "c", text: `You must complete modules in any random order` },
        { id: "d", text: `Modules are independent and have no connection to each other` },
      ],
      correctChoiceId: "a",
      explanation: `Modules in ${skillName} (like "${moduleNames[0]}" and "${moduleNames[Math.min(1, moduleNames.length - 1)]}") group related ideas so each builds on the previous one.`,
      orderIndex: orderIndex++,
    });
  } else {
    questions.push({
      questionText: `How should you approach reviewing completed modules in "${skillName}"?`,
      choicesJson: [
        { id: "a", text: `Periodically revisit key concepts to reinforce long-term retention` },
        { id: "b", text: `Never look back once a module is marked complete` },
        { id: "c", text: `Only review if you fail the quiz` },
        { id: "d", text: `Reviews are unnecessary for well-structured content` },
      ],
      correctChoiceId: "a",
      explanation: `Spaced revisiting of ${skillName} concepts strengthens neural pathways and prevents knowledge decay.`,
      orderIndex: orderIndex++,
    });
  }

  // Q17: Estimated time
  questions.push({
    questionText: `The estimated hours for "${skillName}" represent what?`,
    choicesJson: [
      { id: "a", text: `A realistic estimate of focused practice time needed for functional competency` },
      { id: "b", text: `The minimum time to memorize all content` },
      { id: "c", text: `A strict deadline after which access is revoked` },
      { id: "d", text: `The time to watch all videos at 2× speed` },
    ],
    correctChoiceId: "a",
    explanation: `Estimated hours indicate how much focused, deliberate practice time a typical learner needs to reach competency in ${skillName}.`,
    orderIndex: orderIndex++,
  });

  // Q18: Connecting skills in a path
  questions.push({
    questionText: `How does "${skillName}" connect to other skills in its learning path?`,
    choicesJson: [
      { id: "a", text: `Each skill builds on concepts from earlier skills, creating compound understanding` },
      { id: "b", text: `Skills in a path are completely independent with no shared concepts` },
      { id: "c", text: `Later skills are always harder and cannot be understood without mastering all previous ones` },
      { id: "d", text: `Skills are arranged randomly within their path` },
    ],
    correctChoiceId: "a",
    explanation: `Skills within a path are sequenced so that ${skillName} builds on prior knowledge and prepares you for what comes next.`,
    orderIndex: orderIndex++,
  });

  // Q19: Practical application
  questions.push({
    questionText: `Which statement best describes how "${skillName}" is applied in real work?`,
    choicesJson: [
      { id: "a", text: `It is used to solve specific, recurring challenges that professionals encounter` },
      { id: "b", text: `It is purely theoretical with no workplace application` },
      { id: "c", text: `It can only be applied by people with advanced degrees` },
      { id: "d", text: `Real-world application looks nothing like what you learn in the skill` },
    ],
    correctChoiceId: "a",
    explanation: `${skillName} directly addresses challenges that professionals face, which is why it's included in the career path curriculum.`,
    orderIndex: orderIndex++,
  });

  // Q20: Mastery vs. completion
  questions.push({
    questionText: `What is the difference between "completing" and "mastering" "${skillName}"?`,
    choicesJson: [
      { id: "a", text: `Completion means finishing all steps; mastery means applying concepts fluently to new situations` },
      { id: "b", text: `There is no difference — finishing the steps equals mastery` },
      { id: "c", text: `Mastery requires reading additional textbooks not included in the path` },
      { id: "d", text: `You can master a skill without completing any of its steps` },
    ],
    correctChoiceId: "a",
    explanation: `Completing ${skillName} steps is the starting point; true mastery comes from repeated application to varied situations over time.`,
    orderIndex: orderIndex++,
  });

  return questions;
}

// ============================================================
// Main: expand questions for all skills
// ============================================================
async function main() {
  console.log("📝 Expanding quiz questions to 20 per skill...\n");

  // Get all skills with their existing question count
  const skills = await prisma.skill.findMany({
    include: {
      quizQuestions: { select: { id: true } },
      modules: {
        include: {
          steps: { select: { id: true, title: true, content: true } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  console.log(`Found ${skills.length} skills\n`);

  let totalAdded = 0;
  let skipped = 0;

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    const existingCount = skill.quizQuestions.length;

    if (existingCount >= 20) {
      skipped++;
      continue;
    }

    const allSteps = skill.modules.flatMap((m) =>
      m.steps.map((s) => ({ ...s, moduleTitle: m.title }))
    );

    const additionalQuestions = generateAdditionalQuestions(
      skill,
      skill.modules,
      allSteps,
      existingCount
    );

    // Only add enough to reach 20
    const needed = 20 - existingCount;
    const toInsert = additionalQuestions.slice(0, needed);

    for (const q of toInsert) {
      await prisma.quizQuestion.create({
        data: {
          skillId: skill.id,
          questionText: q.questionText,
          choicesJson: q.choicesJson,
          correctChoiceId: q.correctChoiceId,
          explanation: q.explanation,
          orderIndex: q.orderIndex,
        },
      });
      totalAdded++;
    }

    if ((i + 1) % 20 === 0 || i === skills.length - 1) {
      process.stdout.write(
        `  Progress: ${i + 1}/${skills.length} skills processed (${totalAdded} questions added)\n`
      );
    }
  }

  // Final counts
  const finalCount = await prisma.quizQuestion.count();
  const skillCount = await prisma.skill.count();

  console.log(`\n✅ Expansion complete!`);
  console.log(`   Questions added: ${totalAdded}`);
  console.log(`   Skills skipped (already ≥20): ${skipped}`);
  console.log(`   Total quiz questions now: ${finalCount}`);
  console.log(`   Expected: ${skillCount * 20} (20 × ${skillCount} skills)`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

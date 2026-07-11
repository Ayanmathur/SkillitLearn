/**
 * SkillItLearn — Resilient Seed Script (Prompts 2a + 2b)
 *
 * RESUMABLE: Skips careers/paths/skills/modules that already exist.
 * RESILIENT: Retries on connection resets with exponential backoff.
 *            Reconnects Prisma client after failures.
 *
 * Seeds: taxonomy → modules → steps → 5 quiz questions per skill
 * (Expand to 20 via expand-quiz.js after this completes)
 *
 * Usage: node prisma/seed.js
 */

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

let prisma = new PrismaClient({ log: ["error"] });

// ── Data files ───────────────────────────────────────────────
const DATA_DIR = path.resolve(__dirname, "../..");
const DATA_FILES = [
  "skillitlearn_dataset_part1.json",
  "skillitlearn_dataset_part2.json",
  "skillitlearn_dataset_part3.json",
  "skillitlearn_dataset_part4.json",
  "skillitlearn_dataset_part5_additional_skills.json",
];

// ── System admin user ────────────────────────────────────────
const SYSTEM_ADMIN_ID = "00000000-0000-4000-a000-000000000001";
const SYSTEM_ADMIN = {
  id: SYSTEM_ADMIN_ID,
  email: "system@skillitlearn.com",
  fullName: "System Admin",
  role: "super_admin",
};

// ── Counters ─────────────────────────────────────────────────
const counts = {
  careers: 0,
  paths: 0,
  skills: 0,
  modules: 0,
  steps: 0,
  quizQuestions: 0,
  skippedSkills: 0,
  thinContentSkills: [],
};

// ============================================================
// Retry helper — handles connection resets
// ============================================================
async function withRetry(fn, label, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isConnectionError =
        err.code === "P1017" ||
        err.code === "P1001" ||
        err.code === "P1002" ||
        (err.message && err.message.includes("connection"));

      if (isConnectionError && attempt < maxRetries) {
        const delay = Math.min(2000 * Math.pow(2, attempt - 1), 30000);
        console.log(
          `  ⚠ Connection lost during "${label}" (attempt ${attempt}/${maxRetries}). Retrying in ${delay / 1000}s...`
        );
        await sleep(delay);

        // Reconnect Prisma
        try {
          await prisma.$disconnect();
        } catch (_) {}
        prisma = new PrismaClient({ log: ["error"] });
        continue;
      }
      throw err;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// Step 1: Read and merge data files (deduplicate by slug)
// ============================================================
function loadAndMergeData() {
  console.log("\n📂 Loading data files...");
  const careersMap = new Map();

  for (const file of DATA_FILES) {
    const filePath = path.join(DATA_DIR, file);
    console.log(`  Reading ${file}...`);
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    for (const career of data.careers) {
      if (!careersMap.has(career.slug)) {
        careersMap.set(career.slug, {
          name: career.name,
          slug: career.slug,
          description: career.description,
          paths: new Map(),
        });
      }

      const c = careersMap.get(career.slug);
      for (const p of career.paths) {
        if (!c.paths.has(p.slug)) {
          c.paths.set(p.slug, {
            name: p.name,
            slug: p.slug,
            description: p.description,
            estimatedHours: p.estimated_hours || 0,
            skills: new Map(),
          });
        }

        const pp = c.paths.get(p.slug);
        for (const s of p.skills) {
          const skillSlug =
            s.slug ||
            s.name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/-$/, "");

          if (!pp.skills.has(skillSlug)) {
            pp.skills.set(skillSlug, {
              name: s.name,
              slug: skillSlug,
              description: s.description || "",
              estimatedHours: s.estimated_hours || 0,
              modules: s.modules || [],
            });
          }
        }
      }
    }
  }

  console.log(`  ✅ Merged: ${careersMap.size} unique careers`);
  return careersMap;
}

// ============================================================
// Step 2: Generate 5 quiz questions from step content
// ============================================================
function generateQuizQuestions(skill, skillModules) {
  const questions = [];
  const skillName = skill.name;

  const allSteps = [];
  for (const mod of skillModules) {
    for (const step of mod.steps || []) {
      allSteps.push({ title: step.title, content: step.content || "", moduleName: mod.name });
    }
  }

  const stepsWithContent = allSteps.filter((s) => s.content.length > 50);
  if (stepsWithContent.length < 3) {
    counts.thinContentSkills.push({
      name: skill.name,
      slug: skill.slug,
      stepCount: allSteps.length,
      stepsWithContent: stepsWithContent.length,
    });
  }

  const moduleNames = skillModules.map((m) => m.name);

  // Q1
  questions.push({
    questionText: `What is the primary focus of the "${skillName}" skill?`,
    choices: [
      { id: "a", text: skill.description || `Learning the fundamentals of ${skillName}` },
      { id: "b", text: `Advanced project management techniques unrelated to ${skillName}` },
      { id: "c", text: `Generic office administration procedures` },
      { id: "d", text: `Hardware maintenance and physical equipment repair` },
    ],
    correctChoiceId: "a",
    explanation: `"${skillName}" focuses on: ${skill.description || "building competency in this domain"}.`,
  });

  // Q2
  if (moduleNames.length > 0) {
    questions.push({
      questionText: `Which of the following is a module within the "${skillName}" skill?`,
      choices: [
        { id: "a", text: moduleNames[0] },
        { id: "b", text: `Advanced Quantum Computing` },
        { id: "c", text: `Underwater Basket Weaving Techniques` },
        { id: "d", text: `Corporate Tax Compliance Procedures` },
      ],
      correctChoiceId: "a",
      explanation: `"${moduleNames[0]}" is a module in the ${skillName} skill.`,
    });
  } else {
    questions.push({
      questionText: `Why is structured learning important for "${skillName}"?`,
      choices: [
        { id: "a", text: `Structured paths build concepts progressively, ensuring solid foundations` },
        { id: "b", text: `It is not important — random learning works just as well` },
        { id: "c", text: `Only to receive a certificate at the end` },
        { id: "d", text: `Because the platform forces a specific order` },
      ],
      correctChoiceId: "a",
      explanation: `Structured learning paths help build knowledge progressively.`,
    });
  }

  // Q3
  const keyStep = allSteps.find(
    (s) => s.title.includes("Mental Model") || s.title.includes("Key Terms") || s.title.includes("Walkthrough")
  ) || allSteps[Math.min(1, allSteps.length - 1)] || { title: "Core Concepts" };

  questions.push({
    questionText: `In "${skillName}", what is the purpose of the "${keyStep.title}" step?`,
    choices: [
      { id: "a", text: extractPurpose(keyStep.title, skillName) },
      { id: "b", text: `To memorize unrelated facts from other disciplines` },
      { id: "c", text: `To skip ahead to certification without practicing` },
      { id: "d", text: `To review topics from a completely different career path` },
    ],
    correctChoiceId: "a",
    explanation: `The "${keyStep.title}" step helps learners ${extractPurpose(keyStep.title, skillName).toLowerCase()}.`,
  });

  // Q4
  questions.push({
    questionText: `What approach does "${skillName}" recommend for developing practical competency?`,
    choices: [
      { id: "a", text: `Working through realistic exercises and modifying examples to test understanding` },
      { id: "b", text: `Only reading textbooks without any hands-on practice` },
      { id: "c", text: `Watching videos passively without attempting any exercises` },
      { id: "d", text: `Memorizing all content verbatim before attempting any application` },
    ],
    correctChoiceId: "a",
    explanation: `The skill emphasizes hands-on practice through realistic exercises — not passive consumption.`,
  });

  // Q5
  questions.push({
    questionText: `What distinguishes a beginner from a competent practitioner in "${skillName}"?`,
    choices: [
      { id: "a", text: `The ability to apply concepts to new situations and recognize common patterns` },
      { id: "b", text: `Simply having read more pages of documentation` },
      { id: "c", text: `The number of certificates collected` },
      { id: "d", text: `How quickly they can answer trivia questions` },
    ],
    correctChoiceId: "a",
    explanation: `Competency in ${skillName} means applying knowledge to novel situations, not just recalling facts.`,
  });

  return questions;
}

function extractPurpose(title, skillName) {
  const purposes = {
    "Why This Skill Matters": `Understand the real-world problem that ${skillName} solves`,
    "Key Terms & Concepts": `Build a working vocabulary of core terminology used in ${skillName}`,
    "The Mental Model": `Form a simplified internal model of how ${skillName} works`,
    "Standard Tools & Methods": `Learn the tools and methods practitioners use for ${skillName}`,
    "Step-by-Step Walkthrough": `Work through a guided example of ${skillName} from start to finish`,
    "Common Beginner Mistakes": `Identify and avoid typical mistakes beginners make with ${skillName}`,
    "A Real Exercise": `Practice ${skillName} with a realistic, professional-grade exercise`,
    "Modify & Extend": `Adapt existing work to find the edges of your understanding of ${skillName}`,
    "Get Feedback": `Validate your ${skillName} work against experienced practitioners`,
    "Self-Check & Review": `Assess your own understanding and identify gaps in ${skillName}`,
  };
  return purposes[title] || `Develop understanding of ${title.toLowerCase()} within ${skillName}`;
}

// ============================================================
// Step 3: Main seed function (resumable)
// ============================================================
async function main() {
  console.log("🌱 SkillItLearn — Seeding Database (Resilient Mode)\n");
  console.log("=".repeat(60));

  const careersMap = loadAndMergeData();

  // Create system admin user
  console.log("\n👤 Creating system admin user...");
  await withRetry(
    () => prisma.user.upsert({ where: { id: SYSTEM_ADMIN_ID }, update: {}, create: SYSTEM_ADMIN }),
    "create admin"
  );
  console.log("  ✅ System admin user ready");

  console.log("\n📦 Seeding taxonomy + content...\n");

  let careerIndex = 0;
  for (const [careerSlug, careerData] of careersMap) {
    careerIndex++;
    console.log(`\n[${careerIndex}/${careersMap.size}] Career: ${careerData.name}`);

    // Upsert career
    const career = await withRetry(
      () =>
        prisma.career.upsert({
          where: { slug: careerSlug },
          update: { name: careerData.name, description: careerData.description },
          create: { name: careerData.name, slug: careerSlug, description: careerData.description, createdBy: SYSTEM_ADMIN_ID },
        }),
      `career: ${careerSlug}`
    );
    counts.careers++;

    let pathIndex = 0;
    for (const [pathSlug, pathData] of careerData.paths) {
      pathIndex++;

      const pathRecord = await withRetry(
        () =>
          prisma.path.upsert({
            where: { slug: pathSlug },
            update: { name: pathData.name, description: pathData.description, orderIndex: pathIndex },
            create: { name: pathData.name, slug: pathSlug, description: pathData.description, orderIndex: pathIndex, careerId: career.id },
          }),
        `path: ${pathSlug}`
      );
      counts.paths++;

      let skillIndex = 0;
      for (const [skillSlug, skillData] of pathData.skills) {
        skillIndex++;

        const skillRecord = await withRetry(
          () =>
            prisma.skill.upsert({
              where: { slug: skillSlug },
              update: { name: skillData.name, description: skillData.description, estimatedHours: skillData.estimatedHours, orderIndex: skillIndex },
              create: { name: skillData.name, slug: skillSlug, description: skillData.description, orderIndex: skillIndex, estimatedHours: skillData.estimatedHours, pathId: pathRecord.id },
            }),
          `skill: ${skillSlug}`
        );
        counts.skills++;

        // ── Check if this skill already has content (resumability) ──
        const existingModuleCount = await withRetry(
          () => prisma.module.count({ where: { skillId: skillRecord.id } }),
          `count modules for ${skillSlug}`
        );

        if (existingModuleCount > 0) {
          counts.skippedSkills++;
          continue; // Already seeded content for this skill
        }

        // ── Seed modules and steps ───────────────────────────
        for (const mod of skillData.modules) {
          const moduleRecord = await withRetry(
            () =>
              prisma.module.create({
                data: { title: mod.name, orderIndex: mod.order_index || 1, skillId: skillRecord.id },
              }),
            `module: ${mod.name}`
          );
          counts.modules++;

          if (mod.steps && mod.steps.length > 0) {
            await withRetry(
              () =>
                prisma.step.createMany({
                  data: mod.steps.map((step) => ({
                    moduleId: moduleRecord.id,
                    title: step.title,
                    content: step.content || "",
                    mediaUrls: [],
                    orderIndex: step.order_index || 1,
                  })),
                }),
              `steps for module: ${mod.name}`
            );
            counts.steps += mod.steps.length;
          }
        }

        // ── Generate 5 quiz questions ──────────────────────────
        const quizQuestions = generateQuizQuestions(skillData, skillData.modules);
        for (let qi = 0; qi < quizQuestions.length; qi++) {
          const q = quizQuestions[qi];
          await withRetry(
            () =>
              prisma.quizQuestion.create({
                data: {
                  skillId: skillRecord.id,
                  questionText: q.questionText,
                  choicesJson: q.choices,
                  correctChoiceId: q.correctChoiceId,
                  explanation: q.explanation,
                  orderIndex: qi + 1,
                },
              }),
            `quiz Q${qi + 1} for ${skillSlug}`
          );
          counts.quizQuestions++;
        }
      }

      process.stdout.write(`  Path ${pathIndex}: ${pathData.name} (${pathData.skills.size} skills) ✅\n`);

      // Breathing room for PgBouncer — avoid keeping the connection hot too long
      await sleep(200);
    }
  }

  // ── Summary ────────────────────────────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Seeding complete!\n");
  console.log(`  Careers:           ${counts.careers}`);
  console.log(`  Paths:             ${counts.paths}`);
  console.log(`  Skills:            ${counts.skills}`);
  console.log(`  Skills skipped:    ${counts.skippedSkills} (already had content)`);
  console.log(`  Modules:           ${counts.modules}`);
  console.log(`  Steps:             ${counts.steps}`);
  console.log(`  Quiz Questions:    ${counts.quizQuestions}`);
  console.log(`  Expected Q's:      ${(counts.skills - counts.skippedSkills) * 5} (5 × ${counts.skills - counts.skippedSkills} new skills)`);

  if (counts.thinContentSkills.length > 0) {
    console.log(`\n⚠️  Skills with thin content (${counts.thinContentSkills.length}):`);
    for (const s of counts.thinContentSkills) {
      console.log(`   - ${s.name} (${s.slug}): ${s.stepCount} steps, ${s.stepsWithContent} with content`);
    }
  }
}

main()
  .catch((e) => {
    console.error("\n❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

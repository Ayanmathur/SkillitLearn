const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPrismaProgress() {
  console.log("=== Testing Prisma learnerProgress Upsert ===");

  const userId = "e271910c-c986-4765-999e-c86da7f4bd5f";
  const stepId = "d2d98ec3-87ff-4e01-83da-4a5c9a1d8444";

  try {
    // 1. Upsert User in Prisma first
    await prisma.user.upsert({
      where: { id: userId },
      update: { email: "maymathew325@gmail.com" },
      create: {
        id: userId,
        email: "maymathew325@gmail.com",
        fullName: "May Mathew",
        role: "learner",
      },
    });
    console.log("✅ Prisma User upserted.");

    // 2. Upsert Progress in Prisma
    const progress = await prisma.learnerProgress.upsert({
      where: {
        userId_stepId: {
          userId: userId,
          stepId: stepId,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        userId: userId,
        stepId: stepId,
      },
    });

    console.log("🎉 PRISMA STEP MARK DONE SUCCESSFUL!", progress);
  } catch (err) {
    console.error("❌ Prisma Progress Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaProgress();

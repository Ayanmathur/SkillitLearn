import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding SkillItLearn database...");

  // 1. Software Engineering Career
  const sweCareer = await prisma.career.upsert({
    where: { slug: "software-engineering" },
    update: {},
    create: {
      name: "Software Engineering",
      slug: "software-engineering",
      description: "Master modern full-stack development, cloud computing, and software architecture.",
      icon: "💻",
    },
  });

  // Path: Full Stack Web Developer
  const fullstackPath = await prisma.path.upsert({
    where: {
      careerId_slug: {
        careerId: sweCareer.id,
        slug: "full-stack-web-developer",
      },
    },
    update: {},
    create: {
      careerId: sweCareer.id,
      name: "Full Stack Web Developer",
      slug: "full-stack-web-developer",
      description: "Learn HTML, CSS, JavaScript, React, Next.js, and backend databases.",
      estimatedHours: 40,
      orderIndex: 0,
    },
  });

  // Skill: React & Next.js Fundamentals
  const reactSkill = await prisma.skill.upsert({
    where: {
      pathId_slug: {
        pathId: fullstackPath.id,
        slug: "react-nextjs-fundamentals",
      },
    },
    update: {},
    create: {
      pathId: fullstackPath.id,
      name: "React & Next.js Fundamentals",
      slug: "react-nextjs-fundamentals",
      description: "Build interactive user interfaces with components, props, state, and server components.",
      orderIndex: 0,
    },
  });

  // Module: Intro to React Components
  const reactModule = await prisma.module.create({
    data: {
      skillId: reactSkill.id,
      title: "Module 1: React Component Architecture",
      orderIndex: 0,
      steps: {
        create: [
          {
            title: "Step 1: Understanding JSX and Components",
            content: "React components are the building blocks of modern web applications. JSX allows you to write HTML-like structure directly inside JavaScript.",
            orderIndex: 0,
          },
          {
            title: "Step 2: Managing State with useState",
            content: "State allows React components to remember information and update the screen when user interactions occur.",
            orderIndex: 1,
          },
        ],
      },
    },
  });

  // 2. Data & AI Career
  const dataCareer = await prisma.career.upsert({
    where: { slug: "data-science-ai" },
    update: {},
    create: {
      name: "Data Science & Artificial Intelligence",
      slug: "data-science-ai",
      description: "Learn Python, data analytics, machine learning, and AI engineering.",
      icon: "📊",
    },
  });

  // Path: Data Analyst
  const dataAnalystPath = await prisma.path.upsert({
    where: {
      careerId_slug: {
        careerId: dataCareer.id,
        slug: "data-analyst",
      },
    },
    update: {},
    create: {
      careerId: dataCareer.id,
      name: "Data Analyst",
      slug: "data-analyst",
      description: "Master SQL, Python, Pandas, and data visualization to drive business insights.",
      estimatedHours: 30,
      orderIndex: 0,
    },
  });

  // Skill: SQL & Relational Databases
  const sqlSkill = await prisma.skill.upsert({
    where: {
      pathId_slug: {
        pathId: dataAnalystPath.id,
        slug: "sql-relational-databases",
      },
    },
    update: {},
    create: {
      pathId: dataAnalystPath.id,
      name: "SQL & Relational Databases",
      slug: "sql-relational-databases",
      description: "Query databases using SELECT, JOIN, GROUP BY, and aggregations.",
      orderIndex: 0,
    },
  });

  await prisma.module.create({
    data: {
      skillId: sqlSkill.id,
      title: "Module 1: Querying Data with SQL",
      orderIndex: 0,
      steps: {
        create: [
          {
            title: "Step 1: Introduction to SQL Select Queries",
            content: "SQL (Structured Query Language) is the standard language for storing, manipulating, and retrieving data in databases.",
            orderIndex: 0,
          },
        ],
      },
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

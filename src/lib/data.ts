import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

/**
 * Cached data fetchers.
 *
 * These wrap Prisma queries in Next.js's `unstable_cache`, which stores
 * the query results in Vercel's edge data cache. After the first request,
 * subsequent requests serve cached data WITHOUT touching Prisma or the DB.
 *
 * This eliminates cold starts entirely for public content.
 */

// ── Homepage data ──────────────────────────────────────────

export const getCachedCareers = unstable_cache(
  async () => {
    return prisma.career.findMany({
      include: {
        paths: {
          include: {
            skills: { select: { id: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  },
  ["all-careers"],
  { revalidate: 3600 }
);

export const getCachedCareerStats = unstable_cache(
  async () => {
    const [careerCount, pathCount, skillCount, certCount] = await Promise.all([
      prisma.career.count(),
      prisma.path.count(),
      prisma.skill.count(),
      prisma.certificate.count(),
    ]);
    return { careerCount, pathCount, skillCount, certCount };
  },
  ["career-stats"],
  { revalidate: 3600 }
);

// ── Career detail page ─────────────────────────────────────

export const getCachedCareerBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.career.findUnique({
      where: { slug },
      include: {
        paths: {
          orderBy: { orderIndex: "asc" },
          include: {
            skills: { select: { id: true, estimatedHours: true } },
          },
        },
      },
    });
  },
  ["career-by-slug"],
  { revalidate: 3600 }
);

// ── Path detail page ───────────────────────────────────────

export const getCachedPathBySlug = unstable_cache(
  async (pathSlug: string) => {
    return prisma.path.findUnique({
      where: { slug: pathSlug },
      include: {
        career: { select: { name: true, slug: true } },
        skills: {
          orderBy: { orderIndex: "asc" },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            estimatedHours: true,
            orderIndex: true,
            modules: {
              select: { steps: { select: { id: true } } },
            },
          },
        },
      },
    });
  },
  ["path-by-slug"],
  { revalidate: 3600 }
);

// ── Skill booklet page ─────────────────────────────────────

export const getCachedSkillBySlug = unstable_cache(
  async (skillSlug: string) => {
    return prisma.skill.findUnique({
      where: { slug: skillSlug },
      include: {
        path: {
          select: {
            name: true,
            slug: true,
            career: { select: { name: true, slug: true } },
          },
        },
        modules: {
          orderBy: { orderIndex: "asc" },
          include: {
            steps: {
              orderBy: { orderIndex: "asc" },
            },
          },
        },
      },
    });
  },
  ["skill-by-slug"],
  { revalidate: 3600 }
);

// ── About page stats ───────────────────────────────────────

export const getCachedAboutStats = unstable_cache(
  async () => {
    const [careerCount, pathCount, skillCount, certCount] = await Promise.all([
      prisma.career.count(),
      prisma.path.count(),
      prisma.skill.count(),
      prisma.certificate.count(),
    ]);
    return { careerCount, pathCount, skillCount, certCount };
  },
  ["about-stats"],
  { revalidate: 3600 }
);

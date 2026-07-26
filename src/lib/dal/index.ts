import { createClient } from "@supabase/supabase-js";

/**
 * High-Performance Data Access Layer (DAL) for Public Content.
 * Uses lightweight Supabase PostgREST client to completely bypass
 * Prisma serverless cold starts (~15MB binary overhead).
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Types ───────────────────────────────────────────────────

export interface SkillSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  estimatedHours: number;
  orderIndex: number;
  stepsTotal?: number;
}

export interface PathSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  orderIndex: number;
  skills: SkillSummary[];
}

export interface CareerSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl?: string | null;
  createdAt: string;
  paths: PathSummary[];
}

// ── Homepage Careers & Stats ────────────────────────────────

export async function getAllCareers(): Promise<CareerSummary[]> {
  const { data, error } = await supabase
    .from("careers")
    .select(`
      id,
      name,
      slug,
      description,
      icon,
      created_at,
      career_paths (
        id,
        name,
        slug,
        description,
        order_index,
        skills (
          id,
          name,
          slug,
          description,
          order_index
        )
      )
    `)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("DAL getAllCareers Error:", error);
    return [];
  }

  return (data || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    iconUrl: c.icon,
    createdAt: c.created_at,
    paths: (c.career_paths || [])
      .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        orderIndex: p.order_index ?? 0,
        skills: (p.skills || [])
          .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
          .map((s: any) => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            description: s.description,
            estimatedHours: 0,
            orderIndex: s.order_index ?? 0,
          })),
      })),
  }));
}

export async function getStats() {
  try {
    const [careers, paths, skills, certs] = await Promise.all([
      supabase.from("careers").select("id", { count: "exact", head: true }),
      supabase.from("career_paths").select("id", { count: "exact", head: true }),
      supabase.from("skills").select("id", { count: "exact", head: true }),
      supabase.from("certificates").select("id", { count: "exact", head: true }),
    ]);

    return {
      careerCount: careers.count ?? 0,
      pathCount: paths.count ?? 0,
      skillCount: skills.count ?? 0,
      certCount: certs.count ?? 0,
    };
  } catch (err) {
    console.error("DAL getStats Error:", err);
    return { careerCount: 0, pathCount: 0, skillCount: 0, certCount: 0 };
  }
}

// ── Career Detail ───────────────────────────────────────────

export async function getCareerBySlug(slug: string) {
  const { data, error } = await supabase
    .from("careers")
    .select(`
      id,
      name,
      slug,
      description,
      icon,
      career_paths (
        id,
        name,
        slug,
        description,
        order_index,
        skills (
          id,
          name,
          slug,
          description,
          order_index
        )
      )
    `)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    if (error) console.error("DAL getCareerBySlug Error:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    iconUrl: data.icon,
    paths: (data.career_paths || [])
      .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        orderIndex: p.order_index ?? 0,
        skills: (p.skills || [])
          .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
          .map((s: any) => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            description: s.description,
            estimatedHours: 0,
            orderIndex: s.order_index ?? 0,
          })),
      })),
  };
}

// ── Path Detail ─────────────────────────────────────────────

export async function getPathBySlug(pathSlug: string) {
  const { data, error } = await supabase
    .from("career_paths")
    .select(`
      id,
      name,
      slug,
      description,
      order_index,
      career_id,
      careers (
        id,
        name,
        slug
      ),
      skills (
        id,
        name,
        slug,
        description,
        order_index,
        modules(
          id,
          steps (
            id
          )
        )
      )
    `)
    .eq("slug", pathSlug)
    .single();

  if (error || !data) {
    if (error) console.error("DAL getPathBySlug Error:", error);
    return null;
  }

  const careerObj = Array.isArray(data.careers) ? data.careers[0] : data.careers;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    orderIndex: data.order_index ?? 0,
    careerId: data.career_id,
    career: careerObj ? { name: careerObj.name, slug: careerObj.slug } : null,
    skills: (data.skills || [])
      .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        estimatedHours: 0,
        orderIndex: s.order_index ?? 0,
        modules: s.tracks || [],
      })),
  };
}

// ── Skill Booklet Track Detail ────────────────────────────────────

export async function getSkillBySlug(skillSlug: string) {
  const { data, error } = await supabase
    .from("skills")
    .select(`
      id,
      name,
      slug,
      description,
      order_index,
      path_id,
      career_paths (
        id,
        name,
        slug,
        careers (
          id,
          name,
          slug
        )
      ),
      modules(
        id,
        title,
        order_index,
        steps (
          id,
          title,
          content,
          media_urls,
          order_index
        )
      )
    `)
    .eq("slug", skillSlug)
    .single();

  if (error || !data) {
    if (error) console.error("DAL getSkillBySlug Error:", error);
    return null;
  }

  const pathObj = Array.isArray(data.career_paths) ? data.career_paths[0] : data.career_paths;
  const careerObj = pathObj?.careers ? (Array.isArray(pathObj.careers) ? pathObj.careers[0] : pathObj.careers) : null;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    estimatedHours: 0,
    orderIndex: data.order_index ?? 0,
    pathId: data.path_id,
    path: pathObj
      ? {
          id: pathObj.id,
          name: pathObj.name,
          slug: pathObj.slug,
          career: careerObj ? { id: careerObj.id, name: careerObj.name, slug: careerObj.slug } : null,
        }
      : null,
    modules: (data.modules || [])
      .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((m: any) => ({
        id: m.id,
        title: m.title,
        orderIndex: m.order_index ?? 0,
        steps: (m.steps || [])
          .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
          .map((s: any) => ({
            id: s.id,
            title: s.title,
            content: s.content,
            mediaUrls: s.media_urls || [],
            orderIndex: s.order_index ?? 0,
          })),
      })),
    quizQuestions: [],
  };
}

// ── Quiz Question Selection (15 Questions: 5 Easy, 5 Moderate, 5 Difficult) ──

export async function getQuizForSkill(skillSlug: string) {
  const { data: skill, error: sErr } = await supabase
    .from("skills")
    .select("id, name, slug")
    .eq("slug", skillSlug)
    .single();

  if (sErr || !skill) return null;

  const { data: questions, error: qErr } = await supabase
    .from("quiz_questions")
    .select(`
      id,
      question_text,
      options,
      correct_option_index,
      explanation,
      difficulty,
      order_index
    `)
    .eq("skill_id", skill.id);

  if (qErr || !questions || questions.length === 0) {
    return { skill, questions: [] };
  }

  // Shuffle helper
  const shuffle = <T>(array: T[]): T[] => [...array].sort(() => 0.5 - Math.random());

  const easy = shuffle(questions.filter((q: any) => q.difficulty === "easy"));
  const moderate = shuffle(questions.filter((q: any) => q.difficulty === "moderate"));
  const difficult = shuffle(questions.filter((q: any) => q.difficulty === "difficult"));

  // Select 5 of each difficulty level
  const selectedEasy = easy.slice(0, 5);
  const selectedModerate = moderate.slice(0, 5);
  const selectedDifficult = difficult.slice(0, 5);

  let selected = [...selectedEasy, ...selectedModerate, ...selectedDifficult];

  // Fallback if difficulty counts are uneven
  if (selected.length < 15) {
    const remaining = shuffle(questions.filter((q: any) => !selected.some((s) => s.id === q.id)));
    selected = [...selected, ...remaining.slice(0, 15 - selected.length)];
  }

  return {
    skill,
    questions: selected.map((q: any) => ({
      id: q.id,
      questionText: q.question_text,
      options: q.options || [],
      correctOptionIndex: q.correct_option_index,
      explanation: q.explanation,
      difficulty: q.difficulty,
    })),
  };
}


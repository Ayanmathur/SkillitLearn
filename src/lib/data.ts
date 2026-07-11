import { createClient } from "@supabase/supabase-js";

/**
 * Lightweight Supabase client for PUBLIC reads only.
 *
 * WHY THIS EXISTS: Prisma loads a ~15MB query engine binary on every
 * serverless cold start, taking 2-5 seconds. This Supabase client is
 * just an HTTP client (~20KB) that talks to Supabase's PostgREST API.
 * Zero cold start overhead. Instant.
 *
 * Prisma is still used for admin writes and user progress tracking.
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ── Homepage ────────────────────────────────────────────────

export async function getAllCareers() {
  const { data, error } = await supabase
    .from("careers")
    .select(`
      id,
      name,
      slug,
      description,
      icon_url,
      created_at,
      paths (
        id,
        slug,
        skills (
          id
        )
      )
    `)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getStats() {
  const [careers, paths, skills, certs] = await Promise.all([
    supabase.from("careers").select("id", { count: "exact", head: true }),
    supabase.from("paths").select("id", { count: "exact", head: true }),
    supabase.from("skills").select("id", { count: "exact", head: true }),
    supabase.from("certificates").select("id", { count: "exact", head: true }),
  ]);

  return {
    careerCount: careers.count ?? 0,
    pathCount: paths.count ?? 0,
    skillCount: skills.count ?? 0,
    certCount: certs.count ?? 0,
  };
}

// ── Career detail page ──────────────────────────────────────

export async function getCareerBySlug(slug: string) {
  const { data, error } = await supabase
    .from("careers")
    .select(`
      id,
      name,
      slug,
      description,
      paths (
        id,
        name,
        slug,
        description,
        order_index,
        skills (
          id,
          slug,
          estimated_hours
        )
      )
    `)
    .eq("slug", slug)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

// ── Path detail page ────────────────────────────────────────

export async function getPathBySlug(pathSlug: string) {
  const { data, error } = await supabase
    .from("paths")
    .select(`
      id,
      name,
      slug,
      description,
      career_id,
      careers (
        name,
        slug
      ),
      skills (
        id,
        name,
        slug,
        description,
        estimated_hours,
        order_index,
        modules (
          id,
          steps (
            id
          )
        )
      )
    `)
    .eq("slug", pathSlug)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

// ── Skill booklet page ──────────────────────────────────────

export async function getSkillBySlug(skillSlug: string) {
  const { data, error } = await supabase
    .from("skills")
    .select(`
      id,
      name,
      slug,
      description,
      estimated_hours,
      path_id,
      paths (
        name,
        slug,
        careers (
          name,
          slug
        )
      ),
      modules (
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

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

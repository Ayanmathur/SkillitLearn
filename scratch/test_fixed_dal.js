const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function getPathBySlugFixed(pathSlug) {
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
        order_index
      )
    `)
    .eq("slug", pathSlug)
    .single();

  if (error || !data) {
    console.error("DAL getPathBySlug Error:", error);
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
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        estimatedHours: 0,
        orderIndex: s.order_index ?? 0,
        modules: [],
        tracks: [],
      })),
  };
}

async function getSkillBySlugFixed(skillSlug) {
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
      )
    `)
    .eq("slug", skillSlug)
    .single();

  if (error || !data) {
    console.error("DAL getSkillBySlug Error:", error);
    return null;
  }

  // Fetch tracks for this skill separately to bypass PostgREST foreign key cache issues
  const { data: tracksData } = await supabase
    .from("modules")
    .select("id, title, order_index, steps(id, title, content, media_urls, order_index)")
    .eq("skill_id", data.id)
    .order("order_index", { ascending: true });

  const pathObj = Array.isArray(data.career_paths) ? data.career_paths[0] : data.career_paths;
  const careerObj = pathObj?.careers ? (Array.isArray(pathObj.careers) ? pathObj.careers[0] : pathObj.careers) : null;

  const tracksList = (tracksData || [])
    .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
    .map((m) => ({
      id: m.id,
      title: m.title,
      orderIndex: m.order_index ?? 0,
      steps: (m.steps || [])
        .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
        .map((s) => ({
          id: s.id,
          title: s.title,
          content: s.content,
          mediaUrls: s.media_urls || [],
          orderIndex: s.order_index ?? 0,
        })),
    }));

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
    modules: tracksList,
    tracks: tracksList,
    quizQuestions: [],
  };
}

async function runTests() {
  console.log("1. Testing getPathBySlugFixed('machine-learning-engineering')...");
  const pathRes = await getPathBySlugFixed('machine-learning-engineering');
  console.log("Path Success:", !!pathRes, "Skills count:", pathRes?.skills?.length);

  console.log("\n2. Testing getSkillBySlugFixed('python-for-machine-learning')...");
  const skillRes = await getSkillBySlugFixed('python-for-machine-learning');
  console.log("Skill Success:", !!skillRes, "Tracks count:", skillRes?.tracks?.length);
}

runTests();

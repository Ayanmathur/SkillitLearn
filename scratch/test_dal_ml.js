const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function getPathBySlug(pathSlug) {
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
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        estimatedHours: 0,
        orderIndex: s.order_index ?? 0,
        modules: s.modules || [],
        tracks: s.modules || [],
      })),
  };
}

async function runTest() {
  const res = await getPathBySlug("machine-learning-engineering");
  console.log("Result for machine-learning-engineering:");
  console.log(JSON.stringify(res, null, 2));
}

runTest();

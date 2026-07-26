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
        tracks (
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
        modules: s.tracks || [],
      })),
  };
}

async function simulatePathPageRender() {
  console.log("=== Simulating PathDetailPage Render for 'data-analytics' ===");
  try {
    const path = await getPathBySlug("data-analytics");
    console.log("Path loaded:", path ? path.name : "NULL");

    if (!path) {
      console.log("Result: notFound() would be called!");
      return;
    }

    // Simulate progress calculation WITHOUT optional chaining (as in original page code)
    console.log("Testing un-guarded flatMap (original page code)...");
    try {
      const stepIdsUnsafe = path.skills.flatMap((sk) =>
        sk.modules.flatMap((m) => m.steps.map((s) => s.id))
      );
      console.log("Unsafe step IDs count:", stepIdsUnsafe.length);
    } catch (e) {
      console.error("🔥 CRASH IN ORIGINAL UN-GUARDED FLATMAP:", e.message);
    }

    // Safe version
    const stepIdsSafe = path.skills.flatMap((sk) =>
      (sk.modules || []).flatMap((m) => (m.steps || []).map((s) => s.id))
    );
    console.log("Safe step IDs count:", stepIdsSafe.length);

    console.log("🎉 RENDER SIMULATION COMPLETE!");
  } catch (err) {
    console.error("❌ CRASH DETECTED IN RENDER:", err);
  }
}

simulatePathPageRender();

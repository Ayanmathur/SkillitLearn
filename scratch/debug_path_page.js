const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function testPath() {
  console.log("=== Debugging Path: data-analytics ===");

  // 1. Get path by slug
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
    .eq("slug", "data-analytics")
    .single();

  if (error) {
    console.error("Error fetching path:", error);
  } else {
    console.log("Path found:", data.name);
    console.log("Career:", data.careers);
    console.log("Skills count:", data.skills?.length || 0);

    if (data.skills && data.skills.length > 0) {
      data.skills.forEach((s, idx) => {
        console.log(`  Skill ${idx+1}: ${s.name} (${s.slug}), modules: ${s.modules?.length || 0}`);
      });
    }
  }
}

testPath();

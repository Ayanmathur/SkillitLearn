const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function testSeparatedSkill() {
  console.log("=== Testing Separated getSkillBySlug ===");

  // 1. Fetch skill
  const { data: skill, error: sErr } = await supabase
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
    .eq("slug", "sql-for-analysts")
    .single();

  if (sErr || !skill) {
    console.error("Skill Fetch Error:", sErr);
    return;
  }

  console.log("SUCCESS! Skill:", skill.name);

  // 2. Fetch tracks/modules directly
  const { data: modules, error: mErr } = await supabase
    .from("modules")
    .select("id, title, order_index")
    .eq("skill_id", skill.id)
    .order("order_index", { ascending: true });

  console.log("Modules count:", modules?.length, mErr ? mErr : "");

  if (modules && modules.length > 0) {
    const modIds = modules.map(m => m.id);
    const { data: steps, error: stErr } = await supabase
      .from("steps")
      .select("id, module_id, title, content, media_urls, order_index")
      .in("module_id", modIds)
      .order("order_index", { ascending: true });

    console.log("Total steps count across modules:", steps?.length, stErr ? stErr : "");
  }
}

testSeparatedSkill();

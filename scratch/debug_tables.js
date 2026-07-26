const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function debug() {
  // 1. Check table names
  console.log("=== Checking Tables ===");

  const { data: pathData, error: pathErr } = await supabase
    .from("career_paths")
    .select("id, name, slug")
    .eq("slug", "full-stack-web-developer")
    .single();
  console.log("career_paths lookup:", pathData, pathErr);

  const { data: pathDataOld, error: pathErrOld } = await supabase
    .from("paths")
    .select("id, name, slug")
    .eq("slug", "full-stack-web-developer")
    .single();
  console.log("paths lookup:", pathDataOld, pathErrOld);

  // 2. Check skill
  const { data: skillData, error: skillErr } = await supabase
    .from("skills")
    .select("id, name, slug, path_id")
    .eq("slug", "react-nextjs-fundamentals")
    .single();
  console.log("\nskills lookup:", skillData, skillErr);

  if (skillData) {
    // 3. Check the FK relation name from skills -> career_paths/paths
    const { data: skillWithPath, error: swpErr } = await supabase
      .from("skills")
      .select(`
        id, name, slug,
        career_paths (
          id, name, slug,
          careers (id, name, slug)
        )
      `)
      .eq("slug", "react-nextjs-fundamentals")
      .single();
    console.log("\nskills->career_paths relation:", JSON.stringify(skillWithPath, null, 2), swpErr);

    // Try with "paths" relation name
    const { data: skillWithPath2, error: swp2Err } = await supabase
      .from("skills")
      .select(`
        id, name, slug,
        paths (
          id, name, slug,
          careers (id, name, slug)
        )
      `)
      .eq("slug", "react-nextjs-fundamentals")
      .single();
    console.log("\nskills->paths relation:", JSON.stringify(skillWithPath2, null, 2), swp2Err);
  }

  // 4. Check modules & steps for this skill
  if (skillData) {
    const { data: mods, error: modErr } = await supabase
      .from("modules")
      .select("id, title, order_index")
      .eq("skill_id", skillData.id);
    console.log("\nmodules for skill:", mods?.length || 0, "modules", modErr);

    if (mods && mods.length > 0) {
      const { data: steps, error: stepErr } = await supabase
        .from("steps")
        .select("id")
        .eq("module_id", mods[0].id);
      console.log("steps in first module:", steps?.length || 0, stepErr);
    }
  }
}

debug();

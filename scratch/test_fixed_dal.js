const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function testFixedDAL() {
  console.log("=== Testing getPathBySlug('data-analytics') ===");

  const { data: pathData, error: pathErr } = await supabase
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
    .eq("slug", "data-analytics")
    .single();

  if (pathErr || !pathData) {
    console.error("Path Error:", pathErr);
  } else {
    console.log("SUCCESS! Path Name:", pathData.name);
    console.log("Career:", pathData.careers);
    console.log("Skills count:", pathData.skills?.length);
    if (pathData.skills && pathData.skills.length > 0) {
      console.log("First skill:", pathData.skills[0].name);
    }
  }

  console.log("\n=== Testing getSkillBySlug ===");
  if (pathData?.skills?.length > 0) {
    const firstSkillSlug = pathData.skills[0].slug;
    console.log(`Fetching skill '${firstSkillSlug}'...`);

    const { data: skillData, error: skillErr } = await supabase
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
      .eq("slug", firstSkillSlug)
      .single();

    if (skillErr || !skillData) {
      console.error("Skill Error:", skillErr);
    } else {
      console.log("SUCCESS! Skill Name:", skillData.name);
      console.log("Tracks/Modules count:", skillData.modules?.length);
    }
  }
}

testFixedDAL();

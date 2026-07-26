const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function testSkillPageData() {
  console.log("=== Testing getSkillBySlug('active-listening') ===");

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
      tracks (
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
    .eq("slug", "active-listening")
    .single();

  if (error || !data) {
    console.error("❌ Skill Error:", error);
    return;
  }

  console.log("🎉 SUCCESS! Skill Name:", data.name);
  console.log("Career Paths:", JSON.stringify(data.career_paths, null, 2));

  const pathObj = Array.isArray(data.career_paths) ? data.career_paths[0] : data.career_paths;
  const careerObj = pathObj?.careers ? (Array.isArray(pathObj.careers) ? pathObj.careers[0] : pathObj.careers) : null;

  console.log("Extracted pathObj:", pathObj?.name, "slug:", pathObj?.slug);
  console.log("Extracted careerObj:", careerObj?.name, "slug:", careerObj?.slug);
  console.log("Tracks count:", data.tracks?.length);
}

testSkillPageData();

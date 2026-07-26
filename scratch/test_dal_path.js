const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function testGetPathBySlug() {
  console.log("=== Testing getPathBySlug('data-analytics') ===");

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

  if (error || !data) {
    console.error("ERROR in getPathBySlug:", error);
    return;
  }

  console.log("SUCCESS! Path Name:", data.name);
  console.log("Career:", data.careers);
  console.log("Skills count:", data.skills?.length);
  if (data.skills && data.skills.length > 0) {
    console.log("First skill:", data.skills[0].name, "Modules count:", data.skills[0].modules?.length);
  }
}

testGetPathBySlug();

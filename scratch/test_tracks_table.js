const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function testTracksTable() {
  console.log("=== Testing getPathBySlug('data-analytics') with 'tracks' ===");

  const { data: pathData, error: pathErr } = await supabase
    .from("career_paths")
    .select(`
      id, name, slug, description, order_index, career_id,
      careers ( id, name, slug ),
      skills (
        id, name, slug, description, order_index,
        tracks (
          id, title, order_index,
          steps ( id, title, content, order_index )
        )
      )
    `)
    .eq("slug", "data-analytics")
    .single();

  if (pathErr || !pathData) {
    console.error("Path Query Error:", pathErr);
  } else {
    console.log("🎉 SUCCESS! Path Name:", pathData.name);
    console.log("Career:", pathData.careers);
    console.log("Skills count:", pathData.skills?.length);
    if (pathData.skills && pathData.skills.length > 0) {
      console.log("First skill name:", pathData.skills[0].name);
      console.log("First skill tracks count:", pathData.skills[0].tracks?.length);
      if (pathData.skills[0].tracks && pathData.skills[0].tracks.length > 0) {
        console.log("First track title:", pathData.skills[0].tracks[0].title);
      }
    }
  }
}

testTracksTable();

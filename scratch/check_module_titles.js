const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function checkModuleInTitles() {
  console.log("=== Checking for 'Module' in track titles ===");

  const { data, error } = await supabase
    .from("tracks")
    .select("id, title")
    .ilike("title", "%module%")
    .limit(20);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log(`Found ${data.length} tracks with 'Module' in the title:`);
  data.forEach(t => console.log(`  - "${t.title}"`));

  // Count total
  const { count } = await supabase
    .from("tracks")
    .select("*", { count: "exact", head: true })
    .ilike("title", "%module%");

  console.log(`\nTotal tracks with 'Module' in title: ${count}`);

  // Also check total tracks
  const { count: totalCount } = await supabase
    .from("tracks")
    .select("*", { count: "exact", head: true });

  console.log(`Total tracks: ${totalCount}`);
}

checkModuleInTitles();

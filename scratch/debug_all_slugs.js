const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function checkAllPaths() {
  console.log("=== Checking All Career Paths & Slugs in Supabase ===");

  const { data: paths, error } = await supabase
    .from("career_paths")
    .select("id, name, slug, careers(name, slug)");

  if (error) {
    console.error("Error fetching paths:", error);
    return;
  }

  console.log(`Found ${paths.length} total career paths in DB:\n`);
  paths.forEach((p) => {
    console.log(`Career: [${p.careers?.slug}] Path: [${p.slug}] -> "${p.name}"`);
  });

  // Check specific slug: machine-learning-engineering
  const mlPath = paths.find((p) => p.slug.includes("machine-learning") || p.slug.includes("ml"));
  console.log("\nSearching for machine-learning path slug match:", mlPath);
}

checkAllPaths();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function checkSlugs() {
  console.log("=== Checking Career Slugs ===");
  const { data: careers, error: cErr } = await supabase
    .from("careers")
    .select("id, name, slug");

  console.log("Found careers:", careers?.map(c => ({ name: c.name, slug: c.slug })));

  console.log("\n=== Searching for 'data-analytics' in career_paths ===");
  const { data: paths, error: pErr } = await supabase
    .from("career_paths")
    .select("id, name, slug, career_id, careers(name, slug)")
    .ilike("slug", "%analytics%");

  console.log("Matching paths for analytics:", JSON.stringify(paths, null, 2));

  // Check getPathBySlug for "data-analytics"
  const { data: pExact, error: pExactErr } = await supabase
    .from("career_paths")
    .select(`
      id, name, slug, description, order_index, career_id,
      careers (id, name, slug)
    `)
    .eq("slug", "data-analytics")
    .single();

  console.log("\nExact 'data-analytics' lookup result:", pExact, pExactErr);
}

checkSlugs();

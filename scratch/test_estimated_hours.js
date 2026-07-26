const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function testEstimatedHours() {
  const { data: pathData } = await supabase
    .from("career_paths")
    .select(`
      id, name, slug,
      skills (
        id, name, slug, order_index,
        tracks (
          id,
          steps ( id )
        )
      )
    `)
    .eq("slug", "data-analytics")
    .single();

  if (!pathData) return;

  console.log(`=== Path: ${pathData.name} ===`);
  let pathTotalHours = 0;

  for (const sk of pathData.skills) {
    const stepCount = (sk.tracks || []).reduce((acc, t) => acc + (t.steps?.length || 0), 0);
    const estHours = Math.max(1, Math.round(stepCount * 0.35 + 0.5));
    pathTotalHours += estHours;
    console.log(`Skill '${sk.name}': ${stepCount} steps -> ~${estHours} hours`);
  }

  console.log(`\n🎉 Path Total Estimated Hours: ~${pathTotalHours} hours`);
}

testEstimatedHours();

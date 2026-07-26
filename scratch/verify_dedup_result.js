const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function verifyExcelForAnalysis() {
  console.log("=== Verifying Excel for Analysis after Deduplication ===");

  const { data: skill } = await supabase
    .from("skills")
    .select("id, name, slug")
    .eq("slug", "excel-for-analysis")
    .single();

  if (!skill) return;

  const { data: tracks } = await supabase
    .from("tracks")
    .select(`
      id, title, order_index,
      steps ( id, title )
    `)
    .eq("skill_id", skill.id)
    .order("order_index", { ascending: true });

  console.log(`Skill: ${skill.name}`);
  console.log(`Unique Tracks count: ${tracks.length}`);

  let totalSteps = 0;
  tracks.forEach((t, i) => {
    totalSteps += t.steps ? t.steps.length : 0;
    console.log(`  Track ${i + 1} [order=${t.order_index}]: "${t.title}" (${t.steps ? t.steps.length : 0} steps)`);
  });

  const estHours = Math.max(1, Math.round(totalSteps * 0.35 + 0.5));
  console.log(`\nTotal Steps: ${totalSteps}`);
  console.log(`Estimated Skill Hours: ~${estHours} hours`);
}

verifyExcelForAnalysis();

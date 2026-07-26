const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

async function checkDuplicateTracks() {
  // Get skill ID for excel-for-analysis
  const { data: skill } = await supabase
    .from("skills")
    .select("id, name")
    .eq("slug", "excel-for-analysis")
    .single();

  if (!skill) { console.log("Skill not found"); return; }
  console.log(`Skill: ${skill.name} (${skill.id})\n`);

  // Get all tracks for this skill
  const { data: tracks } = await supabase
    .from("tracks")
    .select("id, title, order_index, skill_id")
    .eq("skill_id", skill.id)
    .order("order_index", { ascending: true });

  console.log(`Total tracks: ${tracks.length}\n`);
  tracks.forEach((t, i) => {
    console.log(`  ${i+1}. [order=${t.order_index}] "${t.title}" (id: ${t.id})`);
  });

  // Check for title duplicates
  const titleCounts = {};
  tracks.forEach(t => {
    titleCounts[t.title] = (titleCounts[t.title] || 0) + 1;
  });

  console.log("\n=== Duplicate titles ===");
  Object.entries(titleCounts).forEach(([title, count]) => {
    if (count > 1) console.log(`  "${title}" appears ${count} times`);
  });

  // Now check total across ALL skills
  console.log("\n=== Checking all skills for duplicate tracks ===");
  const { data: allSkills } = await supabase
    .from("skills")
    .select("id, name, slug")
    .limit(10);

  for (const s of allSkills) {
    const { data: sTracks } = await supabase
      .from("tracks")
      .select("id, title")
      .eq("skill_id", s.id);

    const titles = sTracks.map(t => t.title);
    const uniqueTitles = [...new Set(titles)];
    if (titles.length !== uniqueTitles.length) {
      console.log(`  ❌ ${s.name}: ${titles.length} tracks, ${uniqueTitles.length} unique (${titles.length - uniqueTitles.length} duplicates)`);
    } else {
      console.log(`  ✅ ${s.name}: ${titles.length} tracks, all unique`);
    }
  }
}

checkDuplicateTracks();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceKey);

async function deduplicateTracks() {
  console.log("=== Deduplicating Tracks Across All Skills ===\n");

  // Get all skills
  const { data: skills, error: sErr } = await supabase
    .from("skills")
    .select("id, name");

  if (sErr || !skills) {
    console.error("Failed to fetch skills:", sErr);
    return;
  }

  let totalDeleted = 0;
  let skillsAffected = 0;

  for (const skill of skills) {
    // Get all tracks for this skill
    const { data: tracks } = await supabase
      .from("tracks")
      .select("id, title, order_index")
      .eq("skill_id", skill.id)
      .order("order_index", { ascending: true })
      .order("id", { ascending: true }); // deterministic order for picking the "keeper"

    if (!tracks || tracks.length === 0) continue;

    // Group by (title, order_index) — keep the first one, delete the rest
    const seen = new Map(); // key: "title|order_index" -> first track id
    const toDelete = [];

    for (const track of tracks) {
      const key = `${track.title}|${track.order_index}`;
      if (seen.has(key)) {
        toDelete.push(track.id);
      } else {
        seen.set(key, track.id);
      }
    }

    if (toDelete.length > 0) {
      skillsAffected++;
      console.log(`${skill.name}: Deleting ${toDelete.length} duplicate tracks (keeping ${seen.size})`);

      // Delete duplicate tracks (CASCADE will remove their steps too)
      const { error: delErr } = await supabase
        .from("tracks")
        .delete()
        .in("id", toDelete);

      if (delErr) {
        console.error(`  ❌ Error deleting tracks for ${skill.name}:`, delErr.message);
      } else {
        totalDeleted += toDelete.length;
        console.log(`  ✅ Deleted ${toDelete.length} duplicates`);
      }
    }
  }

  console.log(`\n=== DONE ===`);
  console.log(`Skills affected: ${skillsAffected}`);
  console.log(`Total duplicate tracks deleted: ${totalDeleted}`);

  // Verify final count
  const { count } = await supabase
    .from("tracks")
    .select("*", { count: "exact", head: true });
  console.log(`Remaining tracks in DB: ${count}`);
}

deduplicateTracks();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function cleanDuplicateModules() {
  console.log('🚀 Starting Module/Track Cleanup and Deduplication...');

  const { data: skills, error } = await supabase.from('skills').select('id, name');

  if (error || !skills) {
    console.error('Error fetching skills:', error);
    return;
  }

  let removedCount = 0;
  let fixedSkillsCount = 0;

  for (const skill of skills) {
    const { data: modules } = await supabase
      .from('modules')
      .select('id, title, order_index, created_at')
      .eq('skill_id', skill.id)
      .order('order_index', { ascending: true });

    if (!modules || modules.length === 0) continue;

    const seenTitles = new Map();
    const idsToDelete = [];
    const validModules = [];

    for (const mod of modules) {
      // Normalize title (remove extra spaces and case)
      const normTitle = mod.title.trim().toLowerCase();

      // If we see generic title "Module 1" when a specific titled module exists, or duplicate title
      if (seenTitles.has(normTitle)) {
        idsToDelete.push(mod.id);
      } else {
        seenTitles.set(normTitle, mod.id);
        validModules.push(mod);
      }
    }

    if (idsToDelete.length > 0) {
      console.log(`[CLEAN] Skill "${skill.name}": Removing ${idsToDelete.length} duplicate tracks...`);
      for (const delId of idsToDelete) {
        await supabase.from('steps').delete().eq('module_id', delId);
        await supabase.from('modules').delete().eq('id', delId);
        removedCount++;
      }
    }

    // Re-index remaining valid modules cleanly 1, 2, 3...
    const { data: remainingMods } = await supabase
      .from('modules')
      .select('id, title, order_index')
      .eq('skill_id', skill.id)
      .order('order_index', { ascending: true });

    if (remainingMods && remainingMods.length > 0) {
      let newIdx = 1;
      for (const m of remainingMods) {
        await supabase
          .from('modules')
          .update({ order_index: newIdx })
          .eq('id', m.id);
        newIdx++;
      }
      fixedSkillsCount++;
    }
  }

  console.log(`\n🎉 Module Cleanup Complete! Removed ${removedCount} duplicate modules. Cleaned ordering across ${fixedSkillsCount} skills.`);
}

cleanDuplicateModules().catch(console.error);

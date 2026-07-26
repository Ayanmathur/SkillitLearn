const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function deduplicateModules() {
  console.log('🚀 Deduplicating modules and re-ordering tracks per skill...');

  const { data: skills, error: sErr } = await supabase.from('skills').select('id, name');
  if (sErr || !skills) {
    console.error('Error fetching skills:', sErr);
    return;
  }

  let totalRemovedModules = 0;

  for (const skill of skills) {
    const { data: modules, error: mErr } = await supabase
      .from('modules')
      .select('id, title, order_index, created_at')
      .eq('skill_id', skill.id)
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true });

    if (mErr || !modules || modules.length <= 1) continue;

    // Group modules by clean normalized title or track number
    const seenTitles = new Map();
    const modulesToDelete = [];

    for (const mod of modules) {
      // Normalize title (e.g. "Module 1", "Module 1: HTML & CSS" -> key)
      const cleanKey = mod.title.toLowerCase().replace(/^(module|track)\s*\d*:?\s*/i, '').trim() || mod.title.toLowerCase();

      if (seenTitles.has(cleanKey)) {
        modulesToDelete.push(mod.id);
      } else {
        seenTitles.set(cleanKey, mod);
      }
    }

    if (modulesToDelete.length > 0) {
      // First delete steps belonging to duplicate modules
      await supabase.from('steps').delete().in('module_id', modulesToDelete);
      // Delete duplicate modules
      const { error: dErr } = await supabase.from('modules').delete().in('id', modulesToDelete);
      if (!dErr) {
        totalRemovedModules += modulesToDelete.length;
      }
    }

    // Re-index remaining modules for clean 1, 2, 3 ordering
    const { data: remaining } = await supabase
      .from('modules')
      .select('id, title, order_index')
      .eq('skill_id', skill.id)
      .order('created_at', { ascending: true });

    if (remaining && remaining.length > 0) {
      let idx = 1;
      for (const mod of remaining) {
        // Clean title to replace "Module" with "Track"
        let newTitle = mod.title.replace(/^Module\s*/i, 'Track ');
        if (!newTitle.toLowerCase().startsWith('track')) {
          newTitle = `Track ${idx}: ${newTitle}`;
        }
        await supabase
          .from('modules')
          .update({ order_index: idx, title: newTitle })
          .eq('id', mod.id);
        idx++;
      }
    }
  }

  console.log(`\n🎉 Module deduplication complete! Removed ${totalRemovedModules} duplicate module records and re-indexed all tracks.`);
}

deduplicateModules().catch(console.error);

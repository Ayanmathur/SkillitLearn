const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const allDatasetFiles = [
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part1.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part2.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part3.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part4.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part5_additional_skills.json',
  'D:/Downloads/skillitlearn_seed_data_expanded.json',
  'D:/Downloads/skillitlearn_full_dataset_multimodule.json',
  'D:/Downloads/skillitlearn_full_dataset.json',
];

async function analyzeAndFill() {
  console.log('=== Analyzing All Datasets vs Supabase DB ===');

  const fileCareers = new Map(); // slug -> career object

  for (const filePath of allDatasetFiles) {
    if (!fs.existsSync(filePath)) {
      console.log(`[SKIP] File not found: ${filePath}`);
      continue;
    }

    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const careers = content.careers || (Array.isArray(content) ? content : []);
      console.log(`[READ] ${path.basename(filePath)}: ${careers.length} careers found.`);

      for (const c of careers) {
        if (!c.slug) continue;
        if (!fileCareers.has(c.slug)) {
          fileCareers.set(c.slug, c);
        } else {
          // Merge paths if missing
          const existing = fileCareers.get(c.slug);
          if (c.paths && Array.isArray(c.paths)) {
            const existingPathSlugs = new Set((existing.paths || []).map(p => p.slug));
            for (const p of c.paths) {
              if (!existingPathSlugs.has(p.slug)) {
                existing.paths = existing.paths || [];
                existing.paths.push(p);
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(`[ERROR] Reading ${filePath}:`, e.message);
    }
  }

  console.log(`Total unique careers across all dataset files: ${fileCareers.size}`);

  // Fetch all existing careers from Supabase
  const { data: dbCareers } = await supabase.from('careers').select('id, slug, name');
  const dbSlugSet = new Set((dbCareers || []).map(c => c.slug));
  console.log(`Total careers currently in Supabase DB: ${dbCareers ? dbCareers.length : 0}`);

  const missingSlugs = [];
  for (const [slug, c] of fileCareers.entries()) {
    if (!dbSlugSet.has(slug)) {
      missingSlugs.push(slug);
    }
  }

  console.log(`Missing careers to insert into Supabase: ${missingSlugs.length}`);
  if (missingSlugs.length > 0) {
    console.log("Missing slugs:", missingSlugs);
  }

  // Now perform comprehensive upsert of all dataset items to ensure complete populating
  console.log('\n--- Upserting all unique careers, paths, skills, modules & steps ---');

  for (const [slug, career] of fileCareers.entries()) {
    const { data: dbCareer, error: cErr } = await supabase
      .from('careers')
      .upsert(
        {
          name: career.name,
          slug: career.slug,
          description: career.description || `${career.name} career path`,
          icon: career.icon || '🎓',
        },
        { onConflict: 'slug' }
      )
      .select()
      .single();

    if (cErr || !dbCareer) {
      console.error(`Error upserting career ${career.name}:`, cErr ? cErr.message : 'Unknown');
      continue;
    }

    if (!career.paths || !Array.isArray(career.paths)) continue;

    let pIdx = 0;
    for (const pathObj of career.paths) {
      if (!pathObj.name || !pathObj.slug) continue;
      pIdx++;

      const { data: dbPath, error: pErr } = await supabase
        .from('career_paths')
        .upsert(
          {
            career_id: dbCareer.id,
            name: pathObj.name,
            slug: pathObj.slug,
            description: pathObj.description || `${pathObj.name} learning path`,
            estimated_hours: pathObj.estimated_hours || 25,
            order_index: pIdx,
          },
          { onConflict: 'career_id,slug' }
        )
        .select()
        .single();

      if (pErr || !dbPath) {
        console.error(`Error upserting path ${pathObj.name}:`, pErr ? pErr.message : 'Unknown');
        continue;
      }

      if (!pathObj.skills || !Array.isArray(pathObj.skills)) continue;

      let sIdx = 0;
      for (const skillObj of pathObj.skills) {
        if (!skillObj.name || !skillObj.slug) continue;
        sIdx++;

        const { data: dbSkill, error: sErr } = await supabase
          .from('skills')
          .upsert(
            {
              path_id: dbPath.id,
              name: skillObj.name,
              slug: skillObj.slug,
              description: skillObj.description || `${skillObj.name} skill`,
              order_index: sIdx,
            },
            { onConflict: 'path_id,slug' }
          )
          .select()
          .single();

        if (sErr || !dbSkill) {
          console.error(`Error upserting skill ${skillObj.name}:`, sErr ? sErr.message : 'Unknown');
          continue;
        }

        if (!skillObj.modules || !Array.isArray(skillObj.modules)) continue;

        let mIdx = 0;
        for (const moduleObj of skillObj.modules) {
          mIdx++;
          
          // Check if module already exists for this skill
          const { data: existingMods } = await supabase
            .from('modules')
            .select('id')
            .eq('skill_id', dbSkill.id)
            .eq('title', moduleObj.title || `Module ${mIdx}: ${skillObj.name}`);

          let dbModule = existingMods && existingMods.length > 0 ? existingMods[0] : null;

          if (!dbModule) {
            const { data: newMod, error: mErr } = await supabase
              .from('modules')
              .insert({
                skill_id: dbSkill.id,
                title: moduleObj.title || `Module ${mIdx}: ${skillObj.name}`,
                order_index: mIdx,
              })
              .select()
              .single();

            if (mErr) continue;
            dbModule = newMod;
          }

          if (dbModule && moduleObj.steps && Array.isArray(moduleObj.steps)) {
            // Check existing steps
            const { data: existingSteps } = await supabase
              .from('steps')
              .select('id')
              .eq('module_id', dbModule.id);

            if (!existingSteps || existingSteps.length === 0) {
              let stIdx = 0;
              const stepRows = moduleObj.steps.map((st) => {
                stIdx++;
                return {
                  module_id: dbModule.id,
                  title: st.title || `Step ${stIdx}`,
                  content: st.content || st.text || 'Step content description...',
                  order_index: stIdx,
                };
              });

              await supabase.from('steps').insert(stepRows);
            }
          }
        }
      }
    }
  }

  console.log('\n=== Ingestion & Analysis Completed Successfully ===');
}

analyzeAndFill().catch(console.error);

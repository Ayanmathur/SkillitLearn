const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const downloadFiles = [
  'D:/Downloads/skillitlearn_seed_data_expanded.json',
  'D:/Downloads/skillitlearn_full_dataset_multimodule.json',
  'D:/Downloads/skillitlearn_full_dataset.json',
];

async function importDownloads() {
  console.log('🚀 Checking and Ingesting any additional datasets from Downloads...');

  for (const filePath of downloadFiles) {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    console.log(`\n📦 Ingesting ${path.basename(filePath)}...`);
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const careers = fileData.careers || (Array.isArray(fileData) ? fileData : []);

    for (const career of careers) {
      if (!career.name || !career.slug) continue;

      // Upsert Career
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
        if (cErr) console.error(`Error upserting career ${career.name}:`, cErr.message);
        continue;
      }

      if (!career.paths || !Array.isArray(career.paths)) continue;

      let pIdx = 0;
      for (const pathObj of career.paths) {
        if (!pathObj.name || !pathObj.slug) continue;
        pIdx++;

        // Upsert Path
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
          if (pErr) console.error(`Error upserting path ${pathObj.name}:`, pErr.message);
          continue;
        }

        if (!pathObj.skills || !Array.isArray(pathObj.skills)) continue;

        let sIdx = 0;
        for (const skillObj of pathObj.skills) {
          if (!skillObj.name || !skillObj.slug) continue;
          sIdx++;

          // Upsert Skill
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
            if (sErr) console.error(`Error upserting skill ${skillObj.name}:`, sErr.message);
            continue;
          }

          if (!skillObj.modules || !Array.isArray(skillObj.modules)) continue;

          let mIdx = 0;
          for (const moduleObj of skillObj.modules) {
            mIdx++;
            const { data: dbModule, error: mErr } = await supabase
              .from('modules')
              .insert({
                skill_id: dbSkill.id,
                title: moduleObj.title || `Module ${mIdx}: ${skillObj.name}`,
                order_index: mIdx,
              })
              .select()
              .single();

            if (mErr || !dbModule) continue;

            if (moduleObj.steps && Array.isArray(moduleObj.steps)) {
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

  console.log('\n🎉 Downloads Datasets Ingestion & Merging Completed!');
}

importDownloads().catch((e) => console.error(e));

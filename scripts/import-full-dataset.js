const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4MzMxOSwiZXhwIjoyMTAwNjU5MzE5fQ.RvZeZP5Y_4GIKd8nsihXeEi1zZPwUYXV2tt0_90pRUA';

const supabase = createClient(supabaseUrl, serviceRoleKey);

const datasetFiles = [
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part1.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part2.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part3.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part4.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part5_additional_skills.json',
];

async function importDataset() {
  console.log('🚀 Starting Full Dataset Ingestion into Supabase...');

  for (const filePath of datasetFiles) {
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    console.log(`\n📦 Importing ${path.basename(filePath)}...`);
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const careers = fileData.careers || [];

    for (const career of careers) {
      console.log(` → Importing Career: ${career.name}`);

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

      if (cErr) {
        console.error(`Error inserting career ${career.name}:`, cErr.message);
        continue;
      }

      if (!career.paths || !Array.isArray(career.paths)) continue;

      let pIdx = 0;
      for (const pathObj of career.paths) {
        pIdx++;
        // Upsert Career Path
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

        if (pErr) {
          console.error(`Error inserting path ${pathObj.name}:`, pErr.message);
          continue;
        }

        if (!pathObj.skills || !Array.isArray(pathObj.skills)) continue;

        let sIdx = 0;
        for (const skillObj of pathObj.skills) {
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

          if (sErr) {
            console.error(`Error inserting skill ${skillObj.name}:`, sErr.message);
            continue;
          }

          if (!skillObj.modules || !Array.isArray(skillObj.modules)) continue;

          let mIdx = 0;
          for (const moduleObj of skillObj.modules) {
            mIdx++;
            // Insert Module
            const { data: dbModule, error: mErr } = await supabase
              .from('modules')
              .insert({
                skill_id: dbSkill.id,
                title: moduleObj.title || `Module ${mIdx}: ${skillObj.name}`,
                order_index: mIdx,
              })
              .select()
              .single();

            if (mErr) {
              console.error(`Error inserting module ${moduleObj.title}:`, mErr.message);
              continue;
            }

            // Insert Steps
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

              const { error: stErr } = await supabase.from('steps').insert(stepRows);
              if (stErr) {
                console.error(`Error inserting steps for module ${dbModule.id}:`, stErr.message);
              }
            }
          }
        }
      }
    }
  }

  console.log('\n🎉 Full Dataset Ingestion Completed Successfully!');
}

importDataset().catch((err) => {
  console.error('Fatal ingestion error:', err);
  process.exit(1);
});

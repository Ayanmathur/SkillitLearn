const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://pghgxwjkwrkxnncpsrwu.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnaGd4d2prd3JreG5uY3Bzcnd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODMzMTksImV4cCI6MjEwMDY1OTMxOX0.4-x4MrkPCktc_GtGZZwnF2QWRo5r3b9zYecRFP9mSOA';

const supabase = createClient(supabaseUrl, anonKey);

function maskTitle(title) {
  if (!title) return "";
  let cleaned = title.replace(/\bModules?\b/gi, "Track");
  cleaned = cleaned.replace(/^Track\s*\d+:\s*/i, "");
  return cleaned;
}

async function exportFullCurriculum() {
  console.log("=== Fetching Full Curriculum Data from Supabase ===");

  // 1. Fetch all careers
  const { data: careers, error: cErr } = await supabase
    .from("careers")
    .select("id, name, slug, description")
    .order("name", { ascending: true });

  if (cErr || !careers) {
    console.error("Failed to fetch careers:", cErr);
    return;
  }

  console.log(`Fetched ${careers.length} Careers.`);

  let mdContent = `# 🎓 SkillItLearn — Full Curriculum Catalog\n\n`;
  mdContent += `This document provides the complete hierarchical catalog of all **Careers**, **Learning Paths**, **Skills**, **Tracks**, and **Steps** across the platform.\n\n`;
  mdContent += `---\n\n`;

  for (let ci = 0; ci < careers.length; ci++) {
    const career = careers[ci];
    mdContent += `## ${ci + 1}. Career: ${career.name}\n`;
    mdContent += `**Slug**: \`${career.slug}\`  \n`;
    if (career.description) mdContent += `**Description**: ${career.description}  \n`;
    mdContent += `\n`;

    // Fetch paths for this career
    const { data: paths } = await supabase
      .from("career_paths")
      .select("id, name, slug, description, order_index")
      .eq("career_id", career.id)
      .order("order_index", { ascending: true });

    if (!paths || paths.length === 0) {
      mdContent += `> *No learning paths created under this career yet.*\n\n`;
      continue;
    }

    for (let pi = 0; pi < paths.length; pi++) {
      const pathObj = paths[pi];
      mdContent += `### ${ci + 1}.${pi + 1} Learning Path: ${pathObj.name}\n`;
      mdContent += `- **Path Slug**: \`${pathObj.slug}\`  \n`;
      if (pathObj.description) mdContent += `- **Description**: ${pathObj.description}  \n`;
      mdContent += `\n`;

      // Fetch skills for this path
      const { data: skills } = await supabase
        .from("skills")
        .select("id, name, slug, description, order_index")
        .eq("path_id", pathObj.id)
        .order("order_index", { ascending: true });

      if (!skills || skills.length === 0) {
        mdContent += `  > *No skills in this path.*\n\n`;
        continue;
      }

      for (let si = 0; si < skills.length; si++) {
        const skill = skills[si];
        mdContent += `#### ⚡ Skill ${si + 1}: ${skill.name}\n`;
        mdContent += `- **Skill Slug**: \`${skill.slug}\`  \n`;
        if (skill.description) mdContent += `- **Description**: ${skill.description}  \n`;

        // Fetch tracks for this skill
        const { data: tracks } = await supabase
          .from("tracks")
          .select("id, title, order_index")
          .eq("skill_id", skill.id)
          .order("order_index", { ascending: true });

        if (!tracks || tracks.length === 0) {
          mdContent += `  - *No tracks available.*\n\n`;
          continue;
        }

        const trackIds = tracks.map(t => t.id);
        const { data: steps } = await supabase
          .from("steps")
          .select("id, module_id, title, content, order_index")
          .in("module_id", trackIds)
          .order("order_index", { ascending: true });

        const stepsByTrack = new Map();
        (steps || []).forEach(st => {
          if (!stepsByTrack.has(st.module_id)) stepsByTrack.set(st.module_id, []);
          stepsByTrack.get(st.module_id).push(st);
        });

        mdContent += `\n  **Tracks & Steps (${tracks.length} Tracks)**:\n`;

        tracks.forEach((trk, ti) => {
          const trackTitle = maskTitle(trk.title);
          const trkSteps = (stepsByTrack.get(trk.id) || []).sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));

          mdContent += `  - **Track ${ti + 1}**: ${trackTitle}\n`;
          if (trkSteps.length > 0) {
            trkSteps.forEach((stepObj, stIdx) => {
              const stepTitle = maskTitle(stepObj.title);
              mdContent += `    - Step ${stIdx + 1}: ${stepTitle}\n`;
            });
          } else {
            mdContent += `    - *No steps listed*\n`;
          }
        });

        mdContent += `\n`;
      }
    }

    mdContent += `---\n\n`;
  }

  // Save to Artifacts directory
  const artifactPath = "C:\\Users\\mathu\\.gemini\\antigravity\\brain\\8e3b80cc-7793-4bdb-a47b-9b018c004d97\\full_curriculum_catalog.md";
  fs.writeFileSync(artifactPath, mdContent, 'utf8');
  console.log(`🎉 Full Curriculum Catalog exported successfully to: ${artifactPath}`);

  // Also save a copy locally in scratch for reference
  fs.writeFileSync("d:\\Projects\\Skillitlearn\\skillitlearn-app\\scratch\\full_curriculum_catalog.md", mdContent, 'utf8');
}

exportFullCurriculum();

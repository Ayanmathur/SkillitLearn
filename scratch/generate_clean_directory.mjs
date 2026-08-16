import fs from "fs";

const careers = JSON.parse(fs.readFileSync("scratch/catalog_dump.json", "utf-8"));

let md = "# 🧭 Master Skills Directory (All 359 Skills Across 52 Careers)\n\n";
md += "> **Tracking Rule**: As each skill is overhauled with deep graduate-level material and 15 randomized quiz questions, tick its checkbox `[x]` and mark it `(Completed)`.\n\n";

let skillIdx = 1;
careers.forEach((c, cIdx) => {
  md += `## Career ${cIdx + 1}: ${c.name}\n`;
  md += `**Slug**: \`${c.slug}\` | **Paths**: ${c.career_paths.length}\n\n`;

  c.career_paths.forEach((p, pIdx) => {
    md += `### Path ${pIdx + 1}: ${p.name}\n`;
    md += `**Slug**: \`${p.slug}\`\n\n`;
    md += "| # | Skill Name | Direct URL Route | Core Learning Focus |\n";
    md += "|---|---|---|---|\n";

    p.skills.forEach((s) => {
      const isCompleted = skillIdx <= 13;
      const completedTag = isCompleted ? `[x] **${s.name}** (Completed)` : `**${s.name}**`;
      const route = `/careers/${c.slug}/${p.slug}/${s.slug}`;
      md += `| ${skillIdx} | ${completedTag} | [${route}](${route}) | ${s.description || "Professional mastery curriculum."} |\n`;
      skillIdx++;
    });
    md += "\n";
  });
  md += "---\n\n";
});

fs.writeFileSync("C:/Users/mathu/.gemini/antigravity/brain/8e3b80cc-7793-4bdb-a47b-9b018c004d97/all_skills_directory.md", md);
fs.writeFileSync("scratch/all_skills_directory.md", md);

console.log("Successfully generated clean all_skills_directory.md! Total skills:", skillIdx - 1);

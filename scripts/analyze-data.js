const fs = require("fs");
const path = require("path");

const dataDir = "d:/Projects/Skillitlearn";
const files = [
  "skillitlearn_dataset_part1.json",
  "skillitlearn_dataset_part2.json",
  "skillitlearn_dataset_part3.json",
  "skillitlearn_dataset_part4.json",
  "skillitlearn_dataset_part5_additional_skills.json",
];

const allCareers = new Map();

files.forEach((f) => {
  const data = JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf8"));
  data.careers.forEach((career) => {
    if (!allCareers.has(career.slug)) {
      allCareers.set(career.slug, {
        name: career.name,
        slug: career.slug,
        description: career.description,
        paths: new Map(),
      });
    }
    const cc = allCareers.get(career.slug);
    career.paths.forEach((p) => {
      if (!cc.paths.has(p.slug)) {
        cc.paths.set(p.slug, {
          name: p.name,
          slug: p.slug,
          description: p.description,
          estimated_hours: p.estimated_hours,
          skills: new Map(),
        });
      }
      const pp = cc.paths.get(p.slug);
      p.skills.forEach((s) => {
        if (!pp.skills.has(s.slug || s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))) {
          const slug = s.slug || s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");
          pp.skills.set(slug, {
            name: s.name,
            slug: slug,
            description: s.description,
            estimated_hours: s.estimated_hours,
          });
        }
      });
    });
  });
});

let totalPaths = 0;
let totalSkills = 0;
console.log(`\n=== Dataset Analysis ===\n`);
allCareers.forEach((career) => {
  let careerSkills = 0;
  career.paths.forEach((p) => (careerSkills += p.skills.size));
  totalPaths += career.paths.size;
  totalSkills += careerSkills;
  console.log(`Career: ${career.name} (${career.slug})`);
  console.log(`  Paths: ${career.paths.size}, Skills: ${careerSkills}`);
  career.paths.forEach((p) => {
    console.log(`    - ${p.name} (${p.slug}): ${p.skills.size} skills`);
  });
});
console.log(`\n=== Totals ===`);
console.log(`Careers: ${allCareers.size}`);
console.log(`Paths: ${totalPaths}`);
console.log(`Skills: ${totalSkills}`);

const fs = require('fs');

const downloadFiles = [
  'D:/Downloads/skillitlearn_seed_data_expanded.json',
  'D:/Downloads/skillitlearn_full_dataset_multimodule.json',
  'D:/Downloads/skillitlearn_full_dataset.json',
];

downloadFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      console.log(`=== ${file} ===`);
      const careers = data.careers || (Array.isArray(data) ? data : []);
      console.log(`Careers count: ${careers.length}`);
      careers.slice(0, 5).forEach((c) => {
        console.log(` - Career: ${c.name} (${c.slug})`);
      });
    } catch (e) {
      console.error(`Error parsing ${file}:`, e.message);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});

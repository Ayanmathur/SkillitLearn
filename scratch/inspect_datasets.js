const fs = require('fs');

const files = [
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part1.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part2.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part3.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part4.json',
  'D:/Projects/Skillitlearn/skillitlearn_dataset_part5_additional_skills.json',
];

files.forEach((file) => {
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    console.log(`=== ${file} ===`);
    if (data.careers) {
      console.log(`Careers count: ${data.careers.length}`);
      data.careers.forEach((c) => {
        console.log(` - Career: ${c.name} (${c.slug}), Paths: ${c.paths ? c.paths.length : 0}`);
      });
    } else {
      console.log(`Root keys: ${Object.keys(data)}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
